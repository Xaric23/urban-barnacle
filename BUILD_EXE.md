# Building the Underground Club Manager Executable

This guide explains how to build the Windows executable (.exe) file for Underground Club Manager.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Windows operating system (for building .exe files)

## Building the Executable

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Executable

Run the following command to create a Windows executable:

```bash
npm run build-exe
```

This command will:
1. Build the Next.js application with static export
2. Package it with Electron
3. Create a Windows installer in the `dist` folder

**Note**: The build command uses `--publish never` to prevent automatic publishing to GitHub. This means you can build the executable locally without needing a GitHub Personal Access Token.

The build process may take several minutes. Once complete, you'll find:
- `dist/Underground Club Manager Setup 0.1.0.exe` - The installer executable

### Alternative Build Options

**Build for all platforms:**
```bash
npm run dist
```

**Build portable version (no installer):**
```bash
npm run pack
```

### Publishing to GitHub Releases

If you want to publish the executable to GitHub Releases (for auto-update functionality), you'll need to:

1. Set the `GH_TOKEN` environment variable with a GitHub Personal Access Token
2. Run the publish command:

```bash
npm run publish
```

**Requirements for Publishing**:
- GitHub Personal Access Token with `repo` scope
- Set as environment variable: `GH_TOKEN=your_token_here`
- Proper permissions on the repository

**Note**: Regular users building the executable locally do NOT need to publish - the `build-exe` command is sufficient for local installation.

## Running the Game

### From Executable
1. Run the generated installer from the `dist` folder
2. Follow the installation wizard
3. Launch "Underground Club Manager" from your Start Menu or Desktop

### Development Mode
To run in development mode (for testing):
```bash
# Terminal 1 - Start Next.js dev server
npm run dev

# Terminal 2 - Start Electron
npm run electron-dev
```

## Electron App Structure

The game is packaged using:
- **Next.js**: For the game UI and logic
- **Electron**: To wrap it as a desktop application
- **electron-builder**: To create the Windows installer

## Troubleshooting

### Build Fails
- Ensure you have Node.js 18+ installed
- Delete `node_modules` and run `npm install` again
- Make sure you're on Windows for building .exe files

### App Won't Launch
- Check Windows Defender/antivirus isn't blocking the app
- Try running the installer as administrator

### Windows SmartScreen Warning
- The executable is unsigned, so Windows may show a SmartScreen warning
- Click "More info" and then "Run anyway" to proceed
- This is normal for unsigned applications

## File Structure

```
.
├── electron/
│   └── main.js           # Electron main process
├── out/                  # Next.js static export (created by build)
├── dist/                 # Built executables (created by build)
├── package.json          # Project config with Electron scripts
└── next.config.ts        # Next.js config with static export
```

## Notes

- The executable is a standalone application that doesn't require internet
- Save files are stored in your user's local app data folder
- The first launch may be slower as Windows verifies the application
- You may need to allow the app through Windows Firewall on first launch
- **The executable is unsigned** - Windows may show a SmartScreen warning on first run. Click "More info" then "Run anyway" to proceed. This is normal for unsigned applications.
- **Auto-Update System** - The app includes automatic update checking. When new versions are released as GitHub Releases, users will be notified and can download/install updates automatically. See [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md) for details.
