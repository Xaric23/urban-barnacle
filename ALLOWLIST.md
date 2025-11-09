# Development Allowlist

This document lists all external sites, services, and domains that need to be accessible for developing the Underground Club Manager application.

## Essential Services

### Package Management

#### npm Registry
- **Domain**: `registry.npmjs.org`
- **Purpose**: Download and install Node.js packages
- **Required For**: `npm install`, `npm ci`, dependency management
- **Protocol**: HTTPS (port 443)

#### npm CDN
- **Domain**: `*.npmjs.com`, `*.npmjs.org`
- **Purpose**: Package metadata and registry operations
- **Required For**: Package lookups, version checks
- **Protocol**: HTTPS (port 443)

### Version Control & Repository Hosting

#### GitHub
- **Domain**: `github.com`
- **Purpose**: Source code repository hosting
- **Required For**: Clone repository, push/pull code, CI/CD
- **Protocol**: HTTPS (port 443), SSH (port 22)

#### GitHub API
- **Domain**: `api.github.com`
- **Purpose**: GitHub API operations
- **Required For**: Auto-update system, GitHub CLI operations
- **Protocol**: HTTPS (port 443)

#### GitHub Raw Content
- **Domain**: `raw.githubusercontent.com`
- **Purpose**: Access raw file content from repositories
- **Required For**: Fetching files, scripts, configurations
- **Protocol**: HTTPS (port 443)

### Node.js & JavaScript Ecosystem

#### Node.js Official Site
- **Domain**: `nodejs.org`
- **Purpose**: Node.js runtime downloads and documentation
- **Required For**: Installing Node.js, version updates
- **Protocol**: HTTPS (port 443)

#### Next.js Telemetry
- **Domain**: `telemetry.nextjs.org`
- **Purpose**: Next.js anonymous usage telemetry
- **Required For**: Next.js build process (optional, can be disabled)
- **Protocol**: HTTPS (port 443)
- **Note**: Can opt-out via `NEXT_TELEMETRY_DISABLED=1` environment variable

### Development Tools & Extensions

#### Visual Studio Code Marketplace
- **Domain**: `marketplace.visualstudio.com`
- **Purpose**: VS Code extensions download
- **Required For**: Installing VS Code extensions (ESLint, Prettier, etc.)
- **Protocol**: HTTPS (port 443)

#### VS Code Extension Gallery
- **Domain**: `*.vo.msecnd.net`, `*.gallery.vsassets.io`
- **Purpose**: Extension assets and downloads
- **Required For**: Extension installation and updates
- **Protocol**: HTTPS (port 443)

### Electron & Desktop Build

#### Electron Release Assets
- **Domain**: `github.com/electron/electron/releases`
- **Purpose**: Download Electron binaries
- **Required For**: Building desktop application (`.exe` builds)
- **Protocol**: HTTPS (port 443)

#### GitHub Releases CDN
- **Domain**: `objects.githubusercontent.com`
- **Purpose**: Download release assets
- **Required For**: Electron binaries, auto-update downloads
- **Protocol**: HTTPS (port 443)

### Android Development (Optional)

These domains are only needed if building the Android version of the app:

#### Google Maven Repository ⚠️ CRITICAL FOR ANDROID BUILDS
- **Domain**: `dl.google.com`
- **Purpose**: Android SDK, build tools, and dependencies
- **Required For**: Android builds via Capacitor
- **Protocol**: HTTPS (port 443)
- **⚠️ Note**: This domain is ABSOLUTELY REQUIRED for Android builds. The Gradle `google()` repository resolves to this domain. Without access, Android builds will fail with "Could not resolve" errors.

#### Google APIs
- **Domain**: `*.googleapis.com`
- **Purpose**: Google services and APIs
- **Required For**: Android development tools
- **Protocol**: HTTPS (port 443)

#### Gradle
- **Domain**: `services.gradle.org`, `plugins.gradle.org`
- **Purpose**: Gradle build system
- **Required For**: Android builds
- **Protocol**: HTTPS (port 443)

#### JCenter/Maven Central
- **Domain**: `repo.maven.apache.org`, `repo1.maven.org`
- **Purpose**: Java/Android dependencies
- **Required For**: Android builds
- **Protocol**: HTTPS (port 443)

## Optional Services

### Documentation & Resources

#### Tailwind CSS CDN
- **Domain**: `cdn.tailwindcss.com`
- **Purpose**: Tailwind CSS documentation and resources
- **Required For**: Development reference only (not runtime)
- **Protocol**: HTTPS (port 443)

#### MDN Web Docs
- **Domain**: `developer.mozilla.org`
- **Purpose**: Web development documentation
- **Required For**: Development reference
- **Protocol**: HTTPS (port 443)

### AI Assistance

#### GitHub Copilot
- **Domain**: `copilot-proxy.githubusercontent.com`, `api.githubcopilot.com`
- **Purpose**: AI code suggestions
- **Required For**: GitHub Copilot VS Code extension
- **Protocol**: HTTPS (port 443)

## Localhost Development

#### Next.js Dev Server
- **Domain**: `localhost`, `127.0.0.1`
- **Port**: 3000 (default, configurable)
- **Purpose**: Local development server
- **Required For**: Running `npm run dev`
- **Protocol**: HTTP

#### Electron Dev Mode
- **Domain**: `localhost`, `127.0.0.1`
- **Port**: 3000
- **Purpose**: Electron loads Next.js dev server
- **Required For**: Running `npm run electron-dev`
- **Protocol**: HTTP

## Network Configuration Requirements

### Ports

**Outbound Connections:**
- Port 443 (HTTPS) - Required for all package managers and APIs
- Port 22 (SSH) - Optional for Git SSH operations
- Port 80 (HTTP) - Some redirects may use HTTP before HTTPS

**Inbound Connections (Development Only):**
- Port 3000 (HTTP) - Next.js development server

### Proxy Configuration

If behind a corporate proxy, configure npm:
```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

And set environment variables:
```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1
```

## Security Considerations

### SSL/TLS Requirements
- All external connections should use HTTPS (port 443)
- Verify SSL certificates for all package downloads
- Use `npm config set strict-ssl true` to enforce SSL verification

### Content Security Policy
The application uses a static export and runs entirely client-side after build, so no runtime external connections are made except:
- Auto-update checks to GitHub Releases (desktop app only)
- localStorage for save data (local only)

### Minimal Runtime Dependencies
- No analytics or tracking in production builds
- No external API calls during gameplay
- All game assets are bundled with the application

## Disabling Optional Services

### Next.js Telemetry
```bash
export NEXT_TELEMETRY_DISABLED=1
```

Or add to `.env.local`:
```
NEXT_TELEMETRY_DISABLED=1
```

### Electron Auto-Updates
The auto-update feature only runs in production builds and can be disabled by modifying `electron/main.js`.

## Testing Network Connectivity

To verify all required services are accessible:

```bash
# Test npm registry
curl -I https://registry.npmjs.org

# Test GitHub
curl -I https://github.com

# Test GitHub API
curl -I https://api.github.com

# Test Node.js site
curl -I https://nodejs.org

# Test Android builds (CRITICAL - must succeed for Android development)
curl -I https://dl.google.com

# Test Gradle services
curl -I https://services.gradle.org
```

### Understanding Connection Errors

Different error types indicate different problems:

**Exit Code 6: Could not resolve host**
```bash
$ curl -I https://dl.google.com
curl: (6) Could not resolve host: dl.google.com
```
- **Cause**: DNS-level blocking or DNS resolution failure
- **Not a 404 error**: The domain name cannot be resolved at all
- **Verify with**: `nslookup dl.google.com` (will show "REFUSED" or "can't find")
- **Solution**: Request DNS allowlisting from network administrator

**Exit Code 0 with 404 Not Found**
```bash
$ curl -I https://example.com/missing-file
HTTP/2 404
```
- **Cause**: Domain accessible but specific resource doesn't exist
- **Different from DNS blocking**: The server responds with an HTTP error
- **Solution**: Check the URL path or resource availability

**Connection Timeout**
```bash
$ curl -I https://example.com
curl: (28) Connection timed out after 30000 milliseconds
```
- **Cause**: Firewall blocking or network connectivity issue
- **Solution**: Check firewall rules and network configuration

## Troubleshooting Android Build Failures

### Error: "Could not resolve com.android.tools.build:gradle"

**Cause**: Cannot access `dl.google.com`

**Diagnostic Steps**: 
1. Test if `dl.google.com` is accessible:
   ```bash
   curl -I https://dl.google.com
   ```
   
2. Check the error type:
   - **Exit code 6** (`Could not resolve host`) = DNS-level blocking or resolution failure
   - **404 error** = Domain is accessible but resource not found (different issue)
   - **Connection timeout** = Firewall blocking
   
3. Verify DNS resolution:
   ```bash
   nslookup dl.google.com
   # Expected: IP address (e.g., 142.250.x.x)
   # Problem: "server can't find" or "REFUSED" = DNS blocking
   ```

**Solution**: 
1. If DNS blocking detected (exit code 6 or nslookup REFUSED):
   - Request your network administrator to allowlist in DNS
   - `dl.google.com` (Android Maven repository)
   - `*.googleapis.com` (Google APIs)
2. If 404 error (unlikely for this domain):
   - Check the specific URL path being accessed
   - Verify Gradle version compatibility
3. Check firewall rules and proxy configuration
4. Try alternative DNS servers temporarily:
   ```bash
   # Linux: Edit /etc/resolv.conf (temporary)
   nameserver 8.8.8.8
   nameserver 8.8.4.4
   ```

### Error: "No address associated with hostname"

**Cause**: DNS cannot resolve `dl.google.com` (DNS-level blocking, not a 404 error)

**Verification**:
```bash
# This should return "Could not resolve host" (exit code 6)
curl -I https://dl.google.com
# Exit code 6 confirms DNS issue, not HTTP 404

# DNS lookup should show REFUSED
nslookup dl.google.com
```

**Solution**:
1. Confirm DNS blocking vs. other issues:
   - DNS blocking: `curl` exit code 6, `nslookup` shows REFUSED
   - HTTP 404: `curl` shows "404 Not Found" with exit code 0
   - Network issue: Connection timeout
2. Request DNS allowlisting from network administrator
3. Try alternative DNS (e.g., 8.8.8.8, 1.1.1.1)
4. Check if a proxy is required and configure:
   ```bash
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```
5. For corporate networks: DNS may need internal allowlist entry

### Alternative: Offline Android Build

If `dl.google.com` cannot be accessed, you can:
1. Download dependencies on a machine with internet access
2. Copy the Gradle cache (`~/.gradle/caches/`) to the restricted machine
3. Configure Gradle offline mode (not recommended for development)

## Summary

**Minimum Required for Basic Development:**
1. `registry.npmjs.org` - Package installation
2. `github.com` - Repository access
3. `api.github.com` - GitHub operations
4. `nodejs.org` - Node.js runtime

**Additional for Full Build:**
5. `objects.githubusercontent.com` - Electron binaries
6. `marketplace.visualstudio.com` - VS Code extensions

**CRITICAL for Android Builds:**
7. ⚠️ `dl.google.com` - Android SDK and build tools (MANDATORY)
8. `services.gradle.org` - Gradle distribution
9. `plugins.gradle.org` - Gradle plugins
10. `repo.maven.apache.org` - Maven dependencies

**Without `dl.google.com`, Android builds will fail immediately.** This domain hosts the Google Maven repository which contains all Android SDK components, build tools, and dependencies required by Gradle.

All other services are optional or for development convenience only.

---

**Last Updated**: 2025-11-09  
**For Issues**: Open an issue on the GitHub repository if you need additional domains allowlisted
