# Building Underground Club Manager for Android 🤖

This guide explains how to build the Underground Club Manager game as a native Android application using Capacitor.

## Prerequisites

### Required Software

1. **Node.js 18+** and npm
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

2. **Android Studio**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Install the latest stable version

3. **Java Development Kit (JDK) 17+**
   - Android Studio usually includes this
   - Verify: `java --version`

4. **Android SDK**
   - Installed via Android Studio
   - Ensure Android SDK Platform-Tools and Build-Tools are installed

### Environment Setup

After installing Android Studio:

1. Open Android Studio
2. Go to **Tools > SDK Manager**
3. In **SDK Platforms**, install:
   - Android API 34 (or latest)
   - Android API 33 (recommended for compatibility)
4. In **SDK Tools**, ensure these are installed:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android Emulator (optional, for testing)
   - Intel x86 Emulator Accelerator (HAXM) or equivalent

5. Set up environment variables (add to your shell profile):
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk  # On Linux/Mac
   # Or on Windows: set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   ```

## Quick Start

### 1. Install Dependencies

```bash
# Clone and navigate to repository
git clone https://github.com/Xaric23/urban-barnacle.git
cd urban-barnacle

# Install all dependencies
npm install
```

### 2. Build for Android

```bash
# Build the web app and sync to Android project
npm run android:build
```

This command:
1. Builds the Next.js static export (`npm run build`)
2. Copies the web assets to the Android project
3. Syncs Capacitor plugins and configuration

### 3. Open in Android Studio

```bash
# Open the Android project in Android Studio
npm run android:open
```

This opens the native Android project in Android Studio where you can:
- Build the APK
- Run on an emulator
- Run on a physical device
- Generate signed release builds

### 4. Build APK/AAB

#### Option A: Using Android Studio (Recommended)

1. In Android Studio, select **Build > Build Bundle(s) / APK(s)**
2. Choose:
   - **Build APK(s)** - For direct installation (debug/testing)
   - **Build Bundle(s)** - For Google Play Store (AAB format)

3. For a **signed release build**:
   - Go to **Build > Generate Signed Bundle / APK**
   - Follow the wizard to create or use a keystore
   - Select release build variant
   - APK/AAB will be in `android/app/build/outputs/`

#### Option B: Using Command Line

```bash
# Debug APK (for testing)
cd android
./gradlew assembleDebug

# Release APK (requires signing configuration)
./gradlew assembleRelease

# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

## Development Workflow

### Making Changes

When you modify the web app code (TypeScript/React):

1. **Build and sync**:
   ```bash
   npm run android:build
   ```

2. **Or sync only** (if web assets already built):
   ```bash
   npm run android:sync
   ```

3. **Reload in Android Studio** or rebuild the app

### Live Reload (Development)

For faster development, you can use Capacitor's live reload:

1. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

2. In `capacitor.config.ts`, add:
   ```typescript
   server: {
     url: 'http://YOUR_COMPUTER_IP:3000',
     cleartext: true
   }
   ```

3. Sync and run:
   ```bash
   npm run android:sync
   ```

4. App will load from dev server with hot reload

**Note**: Remove the `server` config before building production APK!

## Testing

### On Android Emulator

1. In Android Studio, go to **Tools > Device Manager**
2. Create a virtual device (e.g., Pixel 5, API 33)
3. Click Run (green play button) in Android Studio

### On Physical Device

1. Enable **Developer Options** on your Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect device via USB
4. Click Run in Android Studio and select your device

### Testing Save Data

The game uses `localStorage` which Capacitor maps to native storage:
- Data persists between app launches
- Located in app's private storage
- Automatically cleared when app is uninstalled

## Build Outputs

### File Locations

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB (Bundle)**: `android/app/build/outputs/bundle/release/app-release.aab`

### File Sizes

Typical sizes:
- Debug APK: ~8-12 MB
- Release APK: ~6-10 MB (optimized)
- AAB: ~5-8 MB (Google Play format)

## Signing for Release

To publish on Google Play or distribute signed APKs:

### 1. Generate Keystore

```bash
keytool -genkey -v -keystore underground-club.keystore -alias underground-club -keyalg RSA -keysize 2048 -validity 10000
```

Follow prompts to set passwords and details.

### 2. Configure Signing

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=underground-club
storeFile=../underground-club.keystore
```

**Important**: Add `key.properties` to `.gitignore`!

### 3. Update `android/app/build.gradle`

Add before `android` block:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add inside `android` block:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ... existing release config
    }
}
```

### 4. Build Signed Release

```bash
cd android
./gradlew assembleRelease
```

Or use Android Studio: **Build > Generate Signed Bundle / APK**

## Troubleshooting

### Build Fails - "SDK not found"

**Solution**: Ensure `ANDROID_HOME` environment variable is set correctly.

```bash
# Check if set
echo $ANDROID_HOME  # Linux/Mac
echo %ANDROID_HOME%  # Windows

# Should point to Android SDK location
```

### "Gradle sync failed"

**Solution**: 
1. Open Android Studio
2. File > Invalidate Caches / Restart
3. Tools > SDK Manager - ensure SDK components are installed
4. Try: `cd android && ./gradlew clean`

### APK Not Installing on Device

**Solution**:
- For debug builds: Enable "Install from Unknown Sources" on device
- Check device has enough storage
- Uninstall previous version first
- Check Android version compatibility (minimum SDK in `build.gradle`)

### "cleartext traffic not permitted"

**Solution**: This happens with live reload. The production build doesn't need this. Remove `server` config from `capacitor.config.ts` for production builds.

### App Crashes on Launch

**Solution**:
1. Check Android Studio Logcat for errors
2. Ensure Next.js build completed successfully
3. Try clean build: `cd android && ./gradlew clean`
4. Verify `out/` directory has the built web assets

### localStorage Not Working

**Solution**: Capacitor automatically handles `localStorage`. If issues occur:
1. Check Logcat for storage permissions errors
2. Ensure app has required permissions in `AndroidManifest.xml`
3. Test on device (not just emulator)

## Publishing to Google Play

### 1. Prepare Assets

- **App Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: Various device sizes
- **Privacy Policy**: Required for apps with user data

### 2. Build AAB

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 3. Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Create application
3. Upload AAB
4. Fill in store listing details
5. Submit for review

### 4. App Requirements

- Target API level 34+ (Android 14)
- Signed with upload key
- Privacy policy URL
- Content rating completed
- All store listing fields completed

## Customization

### App Icon and Splash Screen

1. Add icon files to `android/app/src/main/res/`:
   - `mipmap-mdpi/ic_launcher.png` (48x48)
   - `mipmap-hdpi/ic_launcher.png` (72x72)
   - `mipmap-xhdpi/ic_launcher.png` (96x96)
   - `mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `mipmap-xxxhdpi/ic_launcher.png` (192x192)

2. Or use Android Studio's Image Asset wizard:
   - Right-click `res` folder
   - New > Image Asset
   - Upload 512x512 source image

### App Name

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">Underground Club Manager</string>
    <string name="title_activity_main">Underground Club Manager</string>
</resources>
```

### Permissions

Edit `android/app/src/main/AndroidManifest.xml` to add permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<!-- Add other permissions as needed -->
```

## Additional Resources

- **Capacitor Docs**: [capacitorjs.com/docs](https://capacitorjs.com/docs)
- **Android Developer Guide**: [developer.android.com/guide](https://developer.android.com/guide)
- **Next.js + Capacitor**: [capacitorjs.com/docs/guides/nextjs](https://capacitorjs.com/docs/guides/nextjs)

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run android:build` | Build Next.js and sync to Android |
| `npm run android:sync` | Sync web assets to Android (no rebuild) |
| `npm run android:open` | Open project in Android Studio |
| `npx cap run android` | Build and run on device/emulator |
| `cd android && ./gradlew assembleDebug` | Build debug APK via Gradle |
| `cd android && ./gradlew assembleRelease` | Build release APK via Gradle |

## Support

For issues specific to:
- **Game functionality**: Open issue on GitHub
- **Android build issues**: Check Capacitor docs or Android Studio logs
- **Google Play**: Consult Play Console help center

---

**Happy Building! 🚀**

*Last Updated: November 2024*
