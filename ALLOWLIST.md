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

#### Google Maven Repository
- **Domain**: `dl.google.com`
- **Purpose**: Android SDK, build tools, and dependencies
- **Required For**: Android builds via Capacitor
- **Protocol**: HTTPS (port 443)

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
```

## Summary

**Minimum Required for Basic Development:**
1. `registry.npmjs.org` - Package installation
2. `github.com` - Repository access
3. `api.github.com` - GitHub operations
4. `nodejs.org` - Node.js runtime

**Additional for Full Build:**
5. `objects.githubusercontent.com` - Electron binaries
6. `dl.google.com` - Android builds (optional)
7. `marketplace.visualstudio.com` - VS Code extensions

All other services are optional or for development convenience only.

---

**Last Updated**: 2025-11-09  
**For Issues**: Open an issue on the GitHub repository if you need additional domains allowlisted
