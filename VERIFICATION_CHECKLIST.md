# Verification Checklist for Exe Build

This checklist helps verify that everything is set up correctly for building the Windows executable.

## ✅ Pre-Build Verification

### Required Software
- [ ] Windows 10 or 11
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)

### Repository Setup
- [ ] Repository cloned
- [ ] In correct directory (`cd urban-barnacle`)
- [ ] On correct branch (optional: `git checkout copilot/create-exe-launch-game`)

### Dependencies
- [ ] Run `npm install` (should complete without errors)
- [ ] Check `node_modules/electron` exists
- [ ] Check `node_modules/electron-builder` exists

## ✅ File Verification

### Required Files Present
- [ ] `electron/main.js` - Electron main process
- [ ] `package.json` - Updated with Electron config
- [ ] `next.config.ts` - Configured for static export
- [ ] `BUILD_EXE.md` - Build documentation
- [ ] `build-exe.bat` - Build script

### Configuration Check
Run these commands to verify:

```bash
# Check main entry point
node -p "require('./package.json').main"
# Should output: electron/main.js

# Check build config exists
node -p "require('./package.json').build.appId"
# Should output: com.xaric23.underground-club-manager

# Check Next.js config
node -p "require('./next.config').default.output"
# Should output: export
```

## ✅ Build Process

### Test Build (without Electron)
```bash
npm run build
```
Expected output:
- ✅ "Compiled successfully"
- ✅ "Generating static pages"
- ✅ `out/` directory created
- ✅ `out/index.html` exists

### Full Executable Build
```bash
npm run build-exe
```

Expected process:
1. ✅ Next.js builds (1-2 minutes)
2. ✅ Electron-builder packages (2-3 minutes)
3. ✅ `dist/` directory created
4. ✅ Installer created: `dist/Underground Club Manager Setup 0.1.0.exe`

## ✅ Post-Build Verification

### Installer File
- [ ] File exists: `dist/Underground Club Manager Setup 0.1.0.exe`
- [ ] File size: ~100-150MB
- [ ] File type: Windows executable (.exe)

### Test Installation
- [ ] Run the installer
- [ ] Follow installation wizard
- [ ] Installation completes successfully
- [ ] Desktop shortcut created (optional)
- [ ] Start Menu entry created

### Test Game
- [ ] Launch game from shortcut/Start Menu
- [ ] Game window opens
- [ ] Game loads properly
- [ ] Game is playable
- [ ] Saving/loading works
- [ ] Can close and reopen

## ✅ Distribution Check

Before sharing with others:
- [ ] Installer runs on clean Windows machine
- [ ] No errors during installation
- [ ] Game launches without Node.js installed
- [ ] Game works offline (disconnect internet and test)
- [ ] Save files persist between sessions

## 🔧 Troubleshooting

### Build Fails at npm install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails at Next.js
```bash
# Clear Next.js cache
rm -rf .next out
npm run build
```

### Build Fails at electron-builder
```bash
# Check if electron is installed
npm list electron

# Reinstall if needed
npm install --save-dev electron electron-builder
```

### Installer Won't Run
- Run as Administrator
- Disable Windows Defender temporarily
- Check antivirus isn't blocking

## 📊 Expected Output

### Successful Build Output
```
> next build
✓ Compiled successfully
✓ Generating static pages (4/4)

> electron-builder
  • Building NSIS target
  • Packaging for windows
  • Building installer
  • Done
```

### Directory Structure After Build
```
urban-barnacle/
├── out/                      # Next.js static export
│   └── index.html
├── dist/                     # Electron build output
│   └── Underground Club Manager Setup 0.1.0.exe
├── electron/
│   └── main.js
└── package.json
```

## ✅ Final Checklist

All must be checked before distributing:
- [ ] Build completes without errors
- [ ] Installer file created
- [ ] Installer tested on Windows
- [ ] Game launches successfully
- [ ] Game functionality works
- [ ] Saves persist correctly
- [ ] Uninstaller works

## 🎉 Success!

If all items are checked, your executable is ready to distribute!

Share the file: `dist/Underground Club Manager Setup 0.1.0.exe`

## Need Help?

- See **BUILD_EXE.md** for detailed instructions
- See **QUICKSTART_EXE.md** for quick reference
- See **EXE_IMPLEMENTATION.md** for technical details
