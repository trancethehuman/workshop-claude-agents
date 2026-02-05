# Windows Setup Guide

This workshop uses Unix/macOS shell commands throughout. Windows users have two options:

## Option A: Use WSL2 (Recommended)

WSL2 (Windows Subsystem for Linux) gives you a full Linux environment inside Windows. All workshop commands will work as-is.

### Install WSL2

1. Open **PowerShell as Administrator** and run:
   ```powershell
   wsl --install
   ```
2. Restart your computer when prompted.
3. Open **Ubuntu** from the Start menu and create a username/password.
4. Install Node.js inside WSL:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
5. Install Claude Code inside WSL:
   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

### VS Code + WSL

For the best experience, install the **WSL extension** in VS Code. Then open your project with:
```bash
code .
```
This opens VS Code connected to your WSL environment.

---

## Option B: Use Native Windows

If you prefer not to use WSL, most commands will work with minor adjustments. Use this reference table:

### Command Reference

| Unix Command | Windows PowerShell | Windows CMD |
|---|---|---|
| `mkdir -p path/to/dir` | `mkdir path\to\dir` | `mkdir path\to\dir` |
| `ls -la` | `dir` or `Get-ChildItem` | `dir` |
| `touch file.txt` | `New-Item file.txt` | `type nul > file.txt` |
| `cat file.txt` | `Get-Content file.txt` | `type file.txt` |
| `which command` | `Get-Command command` | `where command` |
| `export VAR=value` | `$env:VAR = "value"` | `set VAR=value` |
| `source venv/bin/activate` | `venv\Scripts\Activate.ps1` | `venv\Scripts\activate.bat` |
| `python3` | `python` or `py -3` | `python` or `py -3` |
| `chmod +x file` | _(not needed)_ | _(not needed)_ |
| `\` (line continuation) | `` ` `` (backtick) | `^` |
| `VAR=value command` | `$env:VAR="value"; command` | `set VAR=value && command` |

### Installing sqlite3 on Windows

SQLite is not pre-installed on Windows.

- **With Chocolatey:** `choco install sqlite`
- **Manual install:** Download the "sqlite-tools" bundle from [sqlite.org/download.html](https://www.sqlite.org/download.html), extract to a folder (e.g., `C:\sqlite`), and add that folder to your PATH.

### Installing Python on Windows

Download from [python.org](https://www.python.org/downloads/). During installation, check **"Add Python to PATH"**. After install, use `python` (not `python3`) in all workshop commands.

### Node Version Manager on Windows

The Unix `nvm` tool does not work on Windows. Use [nvm-windows](https://github.com/coreybutler/nvm-windows) instead:
1. Download the installer from the releases page
2. Run `nvm install 18` then `nvm use 18`
