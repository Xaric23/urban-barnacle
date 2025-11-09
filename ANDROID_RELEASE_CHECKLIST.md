# Android Release Checklist 📋

Use this checklist when preparing the first Android release or updating the Android version.

## Pre-Release Preparation

### 1. Version Management
- [ ] Update version in `package.json`
- [ ] Ensure version matches any release tags
- [ ] Update version code in `android/app/build.gradle` if needed

### 2. Testing
- [ ] Test Next.js build: `npm run build`
- [ ] Test Android sync: `npm run android:sync`
- [ ] Verify web assets copied: Check `android/app/src/main/assets/public/`
- [ ] Test in Android Studio emulator
- [ ] Test on real Android device (if available)
- [ ] Verify game saves persist between app restarts
- [ ] Test all game features work correctly
- [ ] Test on different screen sizes/orientations

### 3. App Branding (Optional Customization)
- [ ] Replace default app icon (see BUILD_ANDROID.md for instructions)
- [ ] Customize splash screen if desired
- [ ] Verify app name displays correctly: "Underground Club Manager"
- [ ] Check app package: `com.xaric23.undergroundclubmanager`

## Building for Distribution

### Option A: Debug APK (Testing Only)

```bash
cd android
./gradlew assembleDebug
```

**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

**Use for**: Testing, sharing with beta testers

### Option B: Release APK (Unsigned)

⚠️ **Warning**: Unsigned APKs cannot be published to Play Store and may show warnings on devices.

```bash
cd android
./gradlew assembleRelease
```

### Option C: Release APK (Signed) - Recommended

#### First Time Setup

1. **Generate Signing Key**:
   ```bash
   keytool -genkey -v -keystore underground-club.keystore \
     -alias underground-club -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create `android/key.properties`**:
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=underground-club
   storeFile=../underground-club.keystore
   ```

3. **Add to .gitignore** (IMPORTANT):
   ```bash
   echo "key.properties" >> android/.gitignore
   echo "*.keystore" >> android/.gitignore
   ```

4. **Configure Signing in `android/app/build.gradle`**:
   
   Add before `android {` block:
   ```gradle
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }
   ```
   
   Add inside `android {` block:
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
           minifyEnabled false
           proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
       }
   }
   ```

#### Build Signed APK

```bash
cd android
./gradlew assembleRelease
```

**Output**: `android/app/build/outputs/apk/release/app-release.apk`

### Option D: Android App Bundle (Play Store)

For Google Play Store submission:

```bash
cd android
./gradlew bundleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

## Release Distribution

### Direct APK Distribution

**Checklist**:
- [ ] Build signed release APK
- [ ] Test APK on clean device
- [ ] Create GitHub Release
- [ ] Upload APK to release
- [ ] Update release notes with:
  - Version number
  - What's new
  - Installation instructions
  - Minimum Android version
- [ ] Tag release (e.g., `v0.1.0-android`)

**Release Notes Template**:
```markdown
## Underground Club Manager v0.1.0 - Android Release

### 🎉 First Android Release!

**What's New:**
- Native Android app with full game features
- Offline play support
- Persistent save data
- Touch-optimized interface

**Installation:**
1. Download `underground-club-manager-v0.1.0.apk`
2. Enable "Install from Unknown Sources" on your device
3. Install and enjoy!

**Requirements:**
- Android 7.0 (Nougat) or higher
- ~10 MB storage space

**Known Issues:**
- [List any known issues]

See [ANDROID_QUICKSTART.md](ANDROID_QUICKSTART.md) for detailed installation instructions.
```

### Google Play Store Distribution

**Checklist**:
- [ ] Create Google Play Developer account ($25 one-time fee)
- [ ] Prepare store assets:
  - [ ] App icon: 512x512 PNG
  - [ ] Feature graphic: 1024x500 PNG
  - [ ] Screenshots (at least 2, multiple device sizes)
  - [ ] Short description (80 chars)
  - [ ] Full description (4000 chars)
  - [ ] Privacy policy URL (required!)
- [ ] Build signed AAB: `./gradlew bundleRelease`
- [ ] Create app in Play Console
- [ ] Upload AAB
- [ ] Fill in store listing
- [ ] Complete content rating questionnaire
- [ ] Set up pricing (free)
- [ ] Submit for review

**Play Store Tips**:
- First review can take 2-7 days
- Privacy policy is REQUIRED (can host on GitHub)
- Target API must be recent (Play Store requirement)
- Content rating affects app visibility

## Post-Release

- [ ] Test download and installation from release
- [ ] Monitor for user feedback/issues
- [ ] Update documentation if needed
- [ ] Plan for updates/maintenance

## Quick Commands Reference

```bash
# Full build process
npm run build                    # Build web app
npm run android:sync            # Sync to Android
npm run android:open            # Open in Android Studio

# Or combined
npm run android:build           # Build + sync in one command

# Build APK (from android directory)
cd android
./gradlew assembleDebug         # Debug APK
./gradlew assembleRelease       # Release APK
./gradlew bundleRelease         # AAB for Play Store

# Install on connected device
./gradlew installDebug
./gradlew installRelease

# Clean build
./gradlew clean
```

## Troubleshooting

### "Execution failed for task ':app:packageRelease'"
**Solution**: You need to set up code signing. See Option C above.

### "Android SDK not found"
**Solution**: Set `ANDROID_HOME` environment variable to SDK location.

### "Gradle sync failed"
**Solution**: Open in Android Studio, let it sync, then try command line again.

### APK installs but won't open
**Solution**: 
1. Check Logcat for errors
2. Verify web assets were synced: `npm run android:sync`
3. Try clean build: `cd android && ./gradlew clean`

## Security Notes

⚠️ **IMPORTANT**:
- **NEVER** commit `key.properties` or `*.keystore` files
- **KEEP** your keystore file and passwords SAFE
- **BACKUP** your keystore file securely (you cannot regenerate it!)
- **DO NOT** share your signing keys

If you lose your keystore:
- You cannot update apps on Play Store
- You'll have to release as a new app
- Users will have to reinstall

## Resources

- [BUILD_ANDROID.md](BUILD_ANDROID.md) - Complete build guide
- [ANDROID_QUICKSTART.md](ANDROID_QUICKSTART.md) - Quick reference
- [Capacitor Docs](https://capacitorjs.com/docs) - Official Capacitor documentation
- [Android Developer Guide](https://developer.android.com/guide) - Android development
- [Play Console](https://play.google.com/console) - Publish to Play Store

---

**Ready to release?** Follow the checklist step by step and you'll be good to go! 🚀
