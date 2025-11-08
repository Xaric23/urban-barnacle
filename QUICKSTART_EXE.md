# Quick Start: Building the Windows Executable

## TL;DR

```bash
npm install
npm run build-exe
```

Find your installer in: `dist/Underground Club Manager Setup 0.1.0.exe`

## Requirements

- Windows 10 or 11
- Node.js 18 or higher ([Download here](https://nodejs.org))

## Step-by-Step

### 1. Clone the Repository
```bash
git clone https://github.com/Xaric23/urban-barnacle.git
cd urban-barnacle
```

### 2. Install Dependencies
```bash
npm install
```
⏱️ This takes 1-2 minutes

### 3. Build the Executable
```bash
npm run build-exe
```
⏱️ This takes 3-5 minutes

### 4. Find Your Installer
Look in the `dist` folder:
```
dist/Underground Club Manager Setup 0.1.0.exe
```

### 5. Test It!
- Double-click the installer
- Follow the installation wizard
- Launch the game from your Desktop or Start Menu

## Alternative: Use the Batch Script

Double-click `build-exe.bat` to do everything automatically!

## Troubleshooting

### "npm not found"
Install Node.js: https://nodejs.org

### "Build failed"
1. Delete `node_modules` folder
2. Run `npm install` again
3. Try `npm run build-exe` again

### "Installer won't run"
- Allow through Windows Defender
- Run as Administrator

## What You Get

✅ Professional Windows installer
✅ Desktop shortcut
✅ Start Menu entry  
✅ Offline game (no internet needed)
✅ Save files in AppData
✅ Uninstaller included

## File Size

- Installer: ~100-150MB
- Installed: ~200-250MB

## Distribution

Share the installer file with others!
They don't need Node.js or any dependencies.

## Need Help?

See the detailed guides:
- **BUILD_EXE.md** - Full build documentation
- **EXE_IMPLEMENTATION.md** - Technical details
- **README.md** - Project overview

## Done!

You now have a distributable Windows executable for Underground Club Manager! 🎉
