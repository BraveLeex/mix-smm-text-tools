\
@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo.
echo ===========================================
echo   MIX-SMM TEXT TOOLS - AUTO SETUP
echo ===========================================
echo.

echo [1] Checking Node.js and Git...
where node >nul 2>nul
IF ERRORLEVEL 1 (
  echo [ERROR] Node.js not found. Install Node.js from https://nodejs.org/ and run this script again.
  pause
  EXIT /B 1
)

where git >nul 2>nul
IF ERRORLEVEL 1 (
  echo [ERROR] Git not found. Install Git from https://git-scm.com/ and run this script again.
  pause
  EXIT /B 1
)

echo.
echo [2] Installing npm dependencies (npm install)...
echo.
call npm install
IF ERRORLEVEL 1 (
  echo [ERROR] npm install failed.
  pause
  EXIT /B 1
)

echo.
echo [3] Building project (npm run build)...
echo.
call npm run build
IF ERRORLEVEL 1 (
  echo [ERROR] npm run build failed.
  pause
  EXIT /B 1
)

echo.
echo [4] Initializing local git repository...
echo.

IF NOT EXIST .git (
  git init
)

git add .
git commit -m "Initial commit: MIX-SMM text tools" 2>nul

echo.
echo ===========================================
echo   GITHUB CONNECTION SETUP
echo ===========================================
echo.
echo 1) Go to GitHub and create an empty repository, for example:
echo    mix-smm-text-tools
echo 2) Copy the HTTPS URL of the repository, for example:
echo    https://github.com/USERNAME/mix-smm-text-tools.git
echo.

set /p REPO_URL=Paste your GitHub repository URL and press Enter: 

IF "!REPO_URL!"=="" (
  echo [ERROR] Repository URL is empty.
  pause
  EXIT /B 1
)

echo.
echo [5] Connecting origin and pushing to GitHub...
echo.

git remote remove origin 2>nul
git remote add origin "!REPO_URL!"
git branch -M main
git push -u origin main

IF ERRORLEVEL 1 (
  echo.
  echo [ERROR] git push failed.
  echo Check:
  echo  - Repository URL correctness
  echo  - GitHub authentication (you may need a personal access token)
  echo.
  pause
  EXIT /B 1
)

echo.
echo ===========================================
echo   LOCAL START
echo ===========================================
echo.
echo To start locally, run:
echo    npm run dev
echo and open http://localhost:5173 in your browser.
echo.
echo ===========================================
echo   DEPLOY TO VERCEL (OPTIONAL)
echo ===========================================
echo.
echo 1) Go to https://vercel.com and log in with GitHub.
echo 2) Click "Add New Project" -> "Import Git Repository".
echo 3) Select your repository: !REPO_URL!
echo 4) Framework: Vite, Build command: npm run build, Output: dist
echo 5) Click Deploy.
echo.
echo After that the form will be available by a permanent Vercel URL.
echo.
pause
ENDLOCAL
EXIT /B 0
