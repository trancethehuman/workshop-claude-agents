#!/usr/bin/env python3
"""
Eval Runner for Startup Funding Analysis Agent

Runs the golden dataset from data/evals/funding-analysis-evals.json
against Claude and reports pass/fail results.

Usage:
    python3 scripts/run-funding-evals.py
    python3 scripts/run-funding-evals.py --filter=hard
    python3 scripts/run-funding-evals.py --id=predict-001
    python3 scripts/run-funding-evals.py --dry-run
"""

import json
import subprocess
import sys
import time
from pathlib import Path

# Get script directory
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
EVAL_FILE = PROJECT_DIR / "data" / "evals" / "funding-analysis-evals.json"
OUTPUT_DIR = PROJECT_DIR / "output"


def load_evals():
    """Load eval set from JSON file."""
    with open(EVAL_FILE) as f:
        return json.load(f)


def parse_args():
    """Parse command line arguments."""
    args = {
        "filter": None,
        "id": None,
        "verbose": False,
        "dry_run": False,
    }

    for arg in sys.argv[1:]:
        if arg.startswith("--filter="):
            args["filter"] = arg.split("=")[1]
        elif arg.startswith("--id="):
            args["id"] = arg.split("=")[1]
        elif arg in ("--verbose", "-v"):
            args["verbose"] = True
        elif arg == "--dry-run":
            args["dry_run"] = True

    return args


def run_eval(eval_case, verbose=False):
    """Run a single eval using Claude CLI with streaming output."""
    start_time = time.time()

    prompt = f"""You have access to a SQLite database at data/startup-funding.db with startup funding data.

Tables:
- startups (id, name, industry, sub_industry, founded_date, description, website, headquarters)
- investors (id, name, type, focus_areas, notable_investments)
- funding_rounds (id, startup_id, stage, amount_usd, funding_date, lead_investor_id, valuation_usd, announced)
- startup_metrics (id, startup_id, metric_date, arr_usd, employee_count, monthly_active_users)

Query the database and answer this question:

{eval_case['input']}

Show your SQL queries and provide a clear answer."""

    output = ""
    try:
        # Use proper CLI flags: -p for prompt, stream-json for progress, allowedTools for auto-approve
        # Note: stream-json requires --verbose when using -p
        cmd = [
            'claude', '-p', prompt,
            '--output-format', 'stream-json',
            '--verbose',
            '--allowedTools', 'Bash(sqlite3:*),Read'
        ]

        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=PROJECT_DIR
        )

        # Parse streaming JSON output and show progress
        output_events = []
        print()  # Newline before streaming output
        for line in process.stdout:
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
                output_events.append(event)

                # Stream assistant content (text and tool_use)
                if event.get('type') == 'assistant':
                    message = event.get('message', {})
                    for content in message.get('content', []):
                        if content.get('type') == 'text':
                            print(content.get('text', ''), end='', flush=True)
                        elif content.get('type') == 'tool_use':
                            tool_name = content.get('name', 'tool')
                            tool_input = content.get('input', {})
                            print(f"\n\033[90m┌─ {tool_name}\033[0m", flush=True)
                            # Show command for Bash, query for SQL tools
                            if 'command' in tool_input:
                                cmd_preview = tool_input['command'][:200]
                                if len(tool_input['command']) > 200:
                                    cmd_preview += '...'
                                print(f"\033[90m│ {cmd_preview}\033[0m", flush=True)
                            elif 'query' in tool_input:
                                query_preview = tool_input['query'][:200]
                                if len(tool_input['query']) > 200:
                                    query_preview += '...'
                                print(f"\033[90m│ {query_preview}\033[0m", flush=True)

                # Stream tool results
                elif event.get('type') == 'user':
                    message = event.get('message', {})
                    for content in message.get('content', []):
                        if content.get('type') == 'tool_result':
                            result_content = content.get('content', '')
                            is_error = content.get('is_error', False)
                            if is_error:
                                print(f"\033[91m│ Error: {result_content[:100]}\033[0m", flush=True)
                            else:
                                # Show first few lines of result
                                lines = str(result_content).split('\n')[:5]
                                for line in lines:
                                    if line.strip():
                                        print(f"\033[90m│ {line[:100]}\033[0m", flush=True)
                                if len(str(result_content).split('\n')) > 5:
                                    print(f"\033[90m│ ...\033[0m", flush=True)
                            print(f"\033[90m└─\033[0m", flush=True)

            except json.JSONDecodeError:
                pass
        print()  # Newline after streaming

        process.wait(timeout=180)

        # Extract final result text from stream
        for event in output_events:
            if event.get('type') == 'result':
                output = event.get('result', '')
                break

        # Fallback: concatenate assistant message content if no result event
        if not output:
            for event in output_events:
                if event.get('type') == 'assistant':
                    message = event.get('message', {})
                    for content in message.get('content', []):
                        if content.get('type') == 'text':
                            output += content.get('text', '')

    except subprocess.TimeoutExpired:
        process.kill()
        output = "ERROR: Timeout after 3 minutes"
    except Exception as e:
        output = f"ERROR: {e}"

    duration_ms = int((time.time() - start_time) * 1000)

    # Check criteria
    criteria_results = []
    for criterion in eval_case["pass_criteria"]:
        lower_output = output.lower()
        passed = True
        note = ""

        if "Returns exactly" in criterion:
            import re
            match = re.search(r"Returns exactly (\d+)", criterion)
            if match:
                expected = match.group(1)
                passed = expected in output
                note = "" if passed else f"Expected {expected} not found"
        elif "Does NOT" in criterion:
            forbidden = criterion.replace("Does NOT ", "").lower().split()[0]
            passed = forbidden not in lower_output
            note = "" if passed else f"Found forbidden: {forbidden}"
        elif "uses" in criterion.lower():
            required = criterion.lower().replace("uses ", "").split()[0]
            passed = required in lower_output
            note = "" if passed else f"Missing: {required}"
        else:
            passed = None  # Needs manual review
            note = "Needs manual review"

        criteria_results.append({
            "criterion": criterion,
            "passed": passed,
            "note": note
        })

    # Overall result
    definitely_failed = any(r["passed"] is False for r in criteria_results)
    all_passed = all(r["passed"] is True for r in criteria_results)

    if definitely_failed:
        passed = False
    elif all_passed:
        passed = True
    else:
        passed = "review"

    return {
        "id": eval_case["id"],
        "name": eval_case["name"],
        "difficulty": eval_case["difficulty"],
        "category": eval_case["category"],
        "passed": passed,
        "output": output[:3000],
        "criteria_results": criteria_results,
        "duration_ms": duration_ms
    }


def main():
    args = parse_args()
    eval_set = load_evals()

    # Filter evals
    evals = eval_set["evals"]
    if args["filter"]:
        evals = [e for e in evals if e["difficulty"] == args["filter"]]
    if args["id"]:
        evals = [e for e in evals if e["id"] == args["id"]]

    print(f"\n{'=' * 60}")
    print(f"  {eval_set['name']}")
    print(f"  {len(evals)} evals to run")
    print(f"{'=' * 60}\n")

    if args["dry_run"]:
        print("DRY RUN - Showing evals without executing:\n")
        for e in evals:
            print(f"[{e['id']}] {e['name']} ({e['difficulty']})")
            print(f"  Category: {e['category']}")
            input_preview = e['input'][:80] + ('...' if len(e['input']) > 80 else '')
            print(f'  Input: "{input_preview}"')
            print("  Pass criteria:")
            for c in e["pass_criteria"]:
                print(f"    - {c}")
            print()
        return

    # Run evals
    results = []
    for eval_case in evals:
        print(f"\n{'─' * 50}")
        print(f"[{eval_case['id']}] {eval_case['name']}")
        print(f"{'─' * 50}")

        result = run_eval(eval_case, verbose=args["verbose"])
        results.append(result)

        if result["passed"] is True:
            status = "✓ PASS"
        elif result["passed"] is False:
            status = "✗ FAIL"
        else:
            status = "? REVIEW"

        print(f"\n→ {status} ({result['duration_ms'] // 1000}s)")

        if args["verbose"] or result["passed"] is not True:
            for cr in result["criteria_results"]:
                if cr["passed"] is True:
                    icon = "  ✓"
                elif cr["passed"] is False:
                    icon = "  ✗"
                else:
                    icon = "  ?"
                note_str = f" ({cr['note']})" if cr["note"] else ""
                print(f"{icon} {cr['criterion']}{note_str}")
            print()

    # Summary
    print(f"\n{'=' * 60}")
    print("  RESULTS")
    print(f"{'=' * 60}")

    passed = sum(1 for r in results if r["passed"] is True)
    failed = sum(1 for r in results if r["passed"] is False)
    review = sum(1 for r in results if r["passed"] == "review")
    total = len(results)

    print(f"\n  Passed: {passed}/{total}")
    print(f"  Failed: {failed}/{total}")
    print(f"  Needs Review: {review}/{total}")

    # By difficulty
    print("\n  By difficulty:")
    for diff in ["easy", "medium", "hard"]:
        diff_results = [r for r in results if r["difficulty"] == diff]
        if diff_results:
            diff_passed = sum(1 for r in diff_results if r["passed"] is True)
            expected = int(eval_set["scoring"]["expected_pass_rates"][diff] * 100)
            print(f"    {diff}: {diff_passed}/{len(diff_results)} (expected ~{expected}%)")

    # Save results
    OUTPUT_DIR.mkdir(exist_ok=True)
    results_path = OUTPUT_DIR / "eval-results.json"
    with open(results_path, "w") as f:
        json.dump({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "eval_set": eval_set["name"],
            "summary": {"passed": passed, "failed": failed, "review": review, "total": total},
            "results": results
        }, f, indent=2)

    print(f"\n  Results saved to: output/eval-results.json")


if __name__ == "__main__":
    main()
