#!/bin/bash

# Workshop Setup Script
# Run this to verify your environment is ready

echo "========================================"
echo "Workshop Environment Check"
echo "========================================"
echo ""

# Check Python
echo -n "Python 3.10+: "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    if [ "$MAJOR" -ge 3 ] && [ "$MINOR" -ge 10 ]; then
        echo "✓ ($PYTHON_VERSION)"
    else
        echo "✗ (Found $PYTHON_VERSION, need 3.10+)"
    fi
else
    echo "✗ (Not found)"
fi

# Check Git
echo -n "Git: "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo "✓ ($GIT_VERSION)"
else
    echo "✗ (Not found)"
fi

# Check Claude Code
echo -n "Claude Code: "
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>&1 | head -1)
    echo "✓ ($CLAUDE_VERSION)"
else
    echo "✗ (Not found - run: curl -fsSL https://claude.ai/install.sh | sh)"
fi

# Check if in correct directory
echo -n "Workshop repo: "
if [ -f "CLAUDE.md" ]; then
    echo "✓ (Found CLAUDE.md)"
else
    echo "✗ (CLAUDE.md not found - are you in the workshop repo?)"
fi

echo ""
echo "========================================"
echo "Setup complete. If all checks pass, you're ready!"
echo "========================================"
