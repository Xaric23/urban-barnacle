# Android Quick Start Guide 🚀

Get Underground Club Manager running on your Android device in minutes!

## For End Users (Installing the APK)

### Prerequisites
- Android device running Android 7.0 (API 24) or higher
- ~10 MB of free storage space

### Installation Steps

1. **Download the APK**
   - Get the latest APK from the [Releases page](https://github.com/Xaric23/urban-barnacle/releases)
   - Look for a file named `underground-club-manager-X.X.X.apk`

2. **Enable Unknown Sources** (if not already enabled)
   - Go to **Settings > Security**
   - Enable **Install from Unknown Sources** or **Install Unknown Apps**
   - Or when you try to install, Android will prompt you to allow it

3. **Install the APK**
   - Open your device's **Downloads** folder
   - Tap the APK file
   - Tap **Install**
   - Tap **Open** to launch the game

4. **Start Playing!**
   - The game will load with the bootstrap screen
   - Your saves are stored locally on your device
   - Game works offline - no internet required!

## For Developers (Building from Source)

### Prerequisites
- Node.js 18+ and npm
- Android Studio (latest version)
- Android SDK and JDK 17+
- Git

### Quick Build

```bash
# 1. Clone repository
git clone https://github.com/Xaric23/urban-barnacle.git
cd urban-barnacle

# 2. Install dependencies
npm install

# 3. Build and sync to Android
npm run android:build

# 4. Open in Android Studio
npm run android:open

# 5. In Android Studio, click the green Run button to build and install on your device/emulator
```

### Build APK via Command Line

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Build Release APK (Signed)

```bash
# Build release APK (requires signing config)
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

> **Note**: Release builds require code signing. See [BUILD_ANDROID.md](BUILD_ANDROID.md) for complete signing instructions.

## Common Issues

### "App not installed"
**Solution**: 
- Uninstall any previous version first
- Ensure you have enough storage space
- Check that you're installing the correct APK for your device architecture

### "This type of file can harm your device"
**Solution**: This is a normal Android warning for APKs installed outside the Play Store. The app is safe - click "Install anyway" or "OK".

### Game won't load
**Solution**:
- Force stop the app and reopen
- Clear app cache: Settings > Apps > Underground Club Manager > Storage > Clear Cache
- Reinstall the app

### Save data lost after update
**Solution**: Save data should persist, but as a precaution:
- Before updating, play through a full day cycle to trigger auto-save
- Or manually export your save (if implemented in future versions)

## Features on Android

✅ **Full game functionality** - All features from web/desktop version
✅ **Offline play** - No internet connection required
✅ **Auto-save** - Progress saved locally on your device
✅ **Touch controls** - Optimized for touchscreen
✅ **Portrait and landscape** - Works in both orientations
✅ **No ads** - Clean gaming experience
✅ **No permissions** - App doesn't request unnecessary permissions

## System Requirements

- **Android Version**: 7.0 (Nougat) or higher
- **Storage**: ~10 MB
- **RAM**: 512 MB minimum (1 GB recommended)
- **Screen**: Any size (optimized for 5" and above)

## Performance Tips

- **Close background apps** for smoother performance on older devices
- **Use portrait mode** for better text readability
- **Adjust screen brightness** for longer battery life

## Comparison with Other Platforms

| Feature | Android | Web | Windows (exe) |
|---------|---------|-----|---------------|
| Offline | ✅ Yes | ❌ No | ✅ Yes |
| Auto-update | ⚠️ Manual* | ✅ Yes | ✅ Yes |
| Install size | ~10 MB | N/A | ~150 MB |
| Save location | App storage | localStorage | AppData |
| Distribution | APK/Play Store | Web hosting | Installer |

*Auto-update will be available if published on Google Play Store

## Getting Help

**For bugs or issues:**
- Open an issue on [GitHub](https://github.com/Xaric23/urban-barnacle/issues)
- Include your Android version and device model

**For game help:**
- See [GAMEPLAY_GUIDE.md](GAMEPLAY_GUIDE.md) for game mechanics
- See [QUICKSTART.md](QUICKSTART.md) for gameplay tips

## Building for Google Play

If you're a developer wanting to publish to Play Store:
1. See [BUILD_ANDROID.md](BUILD_ANDROID.md) for complete instructions
2. Build an AAB (Android App Bundle) instead of APK
3. Sign with a release key
4. Submit to Play Console

```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## Development Resources

- **Full build guide**: [BUILD_ANDROID.md](BUILD_ANDROID.md)
- **Project README**: [README.md](README.md)
- **Capacitor docs**: [capacitorjs.com](https://capacitorjs.com)

---

**Enjoy the game! 🎉**

Report issues: https://github.com/Xaric23/urban-barnacle/issues
