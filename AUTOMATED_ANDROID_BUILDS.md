# Automated Android APK Builds 🤖

The repository now has a GitHub Actions workflow that automatically builds Android APKs!

## How It Works

The workflow uses the Capacitor dependencies that are already locked in `package-lock.json` (version 7.4.4), ensuring consistent builds across all environments.

## 🚀 Quick Start: Create a Release

### Method 1: Using Version Tags (Recommended)

```bash
# 1. Update version in package.json
npm version patch  # Increments from 0.1.0 to 0.1.1
# or
npm version minor  # Increments from 0.1.0 to 0.2.0
# or
npm version major  # Increments from 0.1.0 to 1.0.0

# 2. Push changes and tags
git push && git push --tags

# 3. GitHub Actions will automatically:
#    - Build Next.js app
#    - Sync to Android using locked Capacitor versions
#    - Build debug and release APKs
#    - Create a GitHub Release
#    - Attach APKs to the release
```

### Method 2: Manual Tag

```bash
# 1. Create a tag
git tag v0.1.0

# 2. Push the tag
git push origin v0.1.0

# 3. Workflow triggers automatically
```

### Method 3: Manual Workflow Trigger

1. Go to the **Actions** tab on GitHub
2. Select "Build Android APK" workflow
3. Click **Run workflow**
4. Choose branch and click **Run workflow** button
5. Download APKs from workflow artifacts

## 📦 What Gets Built

The workflow builds two APK variants:

### Debug APK
- **File**: `underground-club-manager-v{version}-debug.apk`
- **Use for**: Testing, development, beta testing
- **Size**: ~8-12 MB
- **Signing**: Debug-signed automatically

### Release APK (Unsigned)
- **File**: `underground-club-manager-v{version}-release.apk`
- **Use for**: Distribution (may show security warning)
- **Size**: ~6-10 MB (optimized)
- **Signing**: Unsigned (requires signing config for full signing)

## 📋 Release Notes Template

When a release is created automatically, it includes:

```markdown
## Underground Club Manager - Android Release

### Installation
1. Download the APK file
2. Enable "Install from Unknown Sources" on your Android device
3. Install and enjoy!

### Requirements
- Android 7.0 (Nougat) or higher
- ~10 MB storage space

### Notes
- **Debug APK**: For testing purposes, may be larger
- **Release APK**: Optimized build (unsigned - may show security warnings)
```

## 🔍 Monitoring Builds

### Check Build Status
1. Go to **Actions** tab on GitHub
2. Look for "Build Android APK" workflow runs
3. Click on a run to see detailed logs

### Download APKs

**From workflow artifacts** (if not a release):
1. Go to the workflow run
2. Scroll to **Artifacts** section
3. Download:
   - `android-debug-apk` - Debug APK
   - `android-release-apk` - Release APK (if successful)

**From GitHub Releases**:
1. Go to **Releases** page
2. Find the version release
3. Download APK files from Assets section

## 🔧 Workflow Configuration

The workflow is configured in `.github/workflows/android-build.yml`:

### Key Features
- **Node.js 20.x**: Matches development environment
- **npm ci**: Uses exact Capacitor versions from package-lock.json
- **Java 17**: Required for Android builds
- **Gradle caching**: Speeds up subsequent builds
- **Automatic versioning**: Uses version from package.json
- **Release creation**: Automatic when triggered by tags

### Capacitor Dependencies
The workflow uses the exact Capacitor versions locked in `package-lock.json`:
- `@capacitor/core@7.4.4`
- `@capacitor/cli@7.4.4`
- `@capacitor/android@7.4.4`

This ensures:
✅ Consistent builds across all environments  
✅ No dependency resolution issues  
✅ Same results as local builds  

## 🛠️ Customization

### Change Trigger Conditions

Edit `.github/workflows/android-build.yml`:

```yaml
on:
  push:
    tags:
      - 'v*'           # Trigger on v* tags
    branches:
      - main           # Also trigger on main branch pushes
  workflow_dispatch:   # Manual trigger
```

### Add Signing

To build fully signed release APKs:

1. Create repository secrets for signing:
   - `KEYSTORE_BASE64` - Base64 encoded keystore file
   - `KEYSTORE_PASSWORD` - Keystore password
   - `KEY_ALIAS` - Key alias
   - `KEY_PASSWORD` - Key password

2. Update workflow to decode keystore and configure signing

See `ANDROID_RELEASE_CHECKLIST.md` for full signing instructions.

## 📈 Build Times

Typical build times on GitHub Actions:
- **First build**: ~5-8 minutes (downloads dependencies)
- **Subsequent builds**: ~3-5 minutes (uses cached Gradle)

## ❗ Troubleshooting

### Build Fails: "Could not resolve dependencies"
- **Cause**: Network issue or repository down
- **Solution**: Re-run the workflow

### Build Fails: "Task assembleRelease failed"
- **Cause**: No signing configuration for release
- **Solution**: This is expected. Debug APK still succeeds. Configure signing for release APK.

### APK Not in Release
- **Cause**: Workflow not triggered by tag
- **Solution**: Create tag: `git tag v0.1.0 && git push origin v0.1.0`

### Wrong Version Number
- **Cause**: Version not updated in package.json
- **Solution**: Update version: `npm version patch` before creating tag

## 🎯 Best Practices

1. **Always update version** before creating a release
   ```bash
   npm version patch
   ```

2. **Test locally first** before creating public release
   ```bash
   npm run android:build
   cd android && ./gradlew assembleDebug
   ```

3. **Use semantic versioning**: v0.1.0, v0.2.0, v1.0.0

4. **Tag releases properly**: Use `v` prefix (e.g., `v0.1.0`)

5. **Check workflow logs** if build fails

## 📚 Related Documentation

- **BUILD_ANDROID.md** - Complete manual build guide
- **ANDROID_QUICKSTART.md** - Quick reference for users
- **ANDROID_RELEASE_CHECKLIST.md** - Full release workflow
- **README.md** - Project overview

## 🎉 Benefits

✅ **No local setup required** - Build APKs without Android Studio  
✅ **Consistent builds** - Same results every time using locked dependencies  
✅ **Automatic releases** - Just push a tag  
✅ **Easy distribution** - APKs attached to GitHub Releases  
✅ **Time saving** - No manual build steps  
✅ **CI/CD ready** - Integrates with existing workflows  

---

**Ready to create your first automated release?**

```bash
npm version patch && git push && git push --tags
```

Then watch the magic happen in the Actions tab! 🚀
