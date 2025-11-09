# Auto-Update System Guide

## Overview

The Underground Club Manager now includes an automatic update system that keeps the application up-to-date with the latest features and bug fixes. The system uses `electron-updater` to automatically check for, download, and install updates from GitHub Releases.

## Features

### Automatic Update Checking
- **Launch Check**: The app automatically checks for updates 3 seconds after launch
- **Background Process**: Update checks happen silently in the background
- **No Interruption**: The game continues to work normally while checking

### User-Friendly Notifications
- **Update Available**: Users are notified when a new version is available
- **Download Choice**: Users can choose to download now or later
- **Progress Feedback**: Clear messages during download
- **Install Prompt**: Users can choose when to install the update

### Safe Installation
- **Auto-install on Quit**: Updates install when you close the app
- **Or Restart Now**: Option to restart immediately to install
- **No Data Loss**: Game saves are preserved during updates

## How It Works

### For Users

#### When an Update is Available

1. **Notification Dialog**
   ```
   Update Available
   A new version (X.X.X) is available!
   Would you like to download it now?
   [Download] [Later]
   ```

2. **If You Choose "Download"**
   - Update downloads in the background
   - You can continue playing
   - Another notification appears when download completes

3. **When Download is Complete**
   ```
   Update Ready
   Version X.X.X has been downloaded.
   The update will be installed when you close the application.
   [Restart Now] [Later]
   ```

4. **Installation**
   - Choose "Restart Now" to install immediately
   - Or choose "Later" and the update installs when you close the app
   - Your game saves are preserved

### For Developers

#### How to Publish Updates

1. **Increment Version**
   ```bash
   # Update version in package.json
   npm version patch  # or minor, or major
   ```

2. **Build and Publish**
   
   **Option A: Publish to GitHub Releases (with GH_TOKEN)**
   ```bash
   # Set your GitHub Personal Access Token
   export GH_TOKEN=your_github_token_here  # Linux/Mac
   set GH_TOKEN=your_github_token_here     # Windows CMD
   $env:GH_TOKEN="your_github_token_here"  # Windows PowerShell
   
   # Build and publish to GitHub
   npm run publish
   ```
   
   **Option B: Build Locally and Upload Manually**
   ```bash
   # Build the executable (no GitHub token needed)
   npm run build-exe
   
   # Then manually upload the installer from dist/ folder to GitHub Releases
   ```

3. **Create GitHub Release (if building locally)**
   - Go to GitHub repository releases
   - Click "Create a new release"
   - Tag version: `v0.1.1` (must match package.json version)
   - Upload the installer from `dist/` folder
   - Publish the release

4. **Users Receive Update**
   - Next time users launch the app, they'll be notified
   - They can download and install the new version

## Technical Details

### Configuration

**Package.json - Publish Settings**
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "Xaric23",
      "repo": "urban-barnacle"
    }
  }
}
```

### Update Check Timing

- **On App Launch**: 3 seconds after the window loads
- **Production Only**: Updates only check in production builds
- **Development Mode**: No update checks during development

### Update Files

Updates are downloaded to:
- **Windows**: `%LOCALAPPDATA%\underground-club-manager-updater\`
- **Temporary**: Files are cleaned up after installation

### Version Format

- **Format**: Semantic versioning (X.Y.Z)
  - `X` = Major version (breaking changes)
  - `Y` = Minor version (new features)
  - `Z` = Patch version (bug fixes)
- **Example**: `v0.1.0`, `v0.2.0`, `v1.0.0`

## User Experience

### What Users See

#### Scenario 1: Update Available
1. App launches normally
2. After 3 seconds, notification appears
3. User chooses to download
4. Download happens in background
5. User continues playing
6. When download completes, install prompt appears
7. User chooses when to restart

#### Scenario 2: No Update
1. App launches normally
2. After 3 seconds, update check happens silently
3. No update found
4. No notification (seamless experience)

### Error Handling

If update check fails:
- Error is logged to console
- User is not interrupted
- App continues working normally
- Will retry on next launch

## Security

### Safe Updates
- ✅ **GitHub Releases**: Updates come from official repository
- ✅ **HTTPS Only**: All downloads use secure connections
- ✅ **Signature Verification**: electron-updater verifies update integrity
- ✅ **User Control**: Users choose when to download and install

### No Forced Updates
- ❌ **Never Automatic**: Updates never install without user approval
- ✅ **User Choice**: Users can skip or delay updates
- ✅ **Safe Fallback**: App works fine without updating

## Troubleshooting

### Update Check Not Working

**Problem**: No update notification appears

**Solutions**:
1. Check internet connection
2. Verify GitHub repository is accessible
3. Ensure you're running production build (not dev mode)
4. Check console logs for errors

### Download Fails

**Problem**: Update download doesn't complete

**Solutions**:
1. Check available disk space
2. Verify internet connection stability
3. Try again later (temporary GitHub issue)
4. Check firewall/antivirus settings

### Installation Fails

**Problem**: Update doesn't install after download

**Solutions**:
1. Close the app completely
2. Try "Restart Now" instead of closing manually
3. Check Windows permissions
4. Run as administrator if necessary

## Development

### Testing Auto-Updates

#### Local Testing (Without Publishing)

You cannot fully test auto-updates locally without publishing to GitHub, but you can:

1. **Test Update Check**
   ```javascript
   // In electron/main.js
   console.log('Checking for updates...');
   autoUpdater.checkForUpdates();
   ```

2. **Simulate Events**
   ```javascript
   // Manually trigger events for testing UI
   autoUpdater.emit('update-available', { version: '0.2.0' });
   ```

#### Testing With GitHub Releases

1. Create a test release on GitHub
2. Build and install the previous version locally
3. Launch app and verify update notification appears
4. Test download and installation

### Disabling Auto-Updates

For testing or special builds:

```javascript
// In electron/main.js
const autoUpdateEnabled = true; // Set to false to disable

app.on('ready', () => {
  startNextServer();
  createWindow();
  
  if (!isDev && autoUpdateEnabled) {
    setTimeout(() => {
      autoUpdater.checkForUpdates();
    }, 3000);
  }
});
```

## Best Practices

### For Developers

1. **Test Thoroughly**: Test each version before releasing
2. **Changelog**: Include clear release notes in GitHub releases
3. **Version Numbers**: Follow semantic versioning
4. **Backward Compatibility**: Ensure saves work across versions
5. **Gradual Rollout**: Consider staged releases for major updates

### For Users

1. **Update Regularly**: Keep app updated for latest features and fixes
2. **Read Release Notes**: Check what's new before updating
3. **Backup Saves**: Export game saves before major updates (optional)
4. **Stable Connection**: Ensure good internet for downloads

## Future Enhancements

Potential improvements:

1. **Update Notifications in UI**: In-game notification badge
2. **Release Notes Display**: Show changelog in update dialog
3. **Delta Updates**: Only download changed files (smaller downloads)
4. **Update Schedule**: Check for updates daily/weekly
5. **Beta Channel**: Opt-in to beta releases
6. **Rollback Feature**: Revert to previous version if needed

## FAQ

**Q: Will I lose my game progress when updating?**
A: No, all game saves are preserved during updates.

**Q: Can I skip an update?**
A: Yes, click "Later" and continue playing. You can update anytime.

**Q: How large are updates?**
A: Full installer (~100-150MB). Future versions may support smaller delta updates.

**Q: How often are updates released?**
A: Check the GitHub releases page for update history and frequency.

**Q: Can I turn off auto-updates?**
A: Currently no, but updates never install without your permission.

**Q: What if the update breaks something?**
A: Report issues on GitHub. You can reinstall the previous version if needed.

## Support

For issues or questions:

1. **GitHub Issues**: Report problems on the repository
2. **Console Logs**: Check developer console for error details
3. **Community**: Ask questions in discussions
4. **Documentation**: Check README and other docs

## License

Part of Underground Club Manager - See main LICENSE file
