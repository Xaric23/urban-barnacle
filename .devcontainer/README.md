# Development Container

This directory contains the configuration for a Docker-based development container that provides a consistent development environment for the Underground Club Manager project.

## What's Included

### Base Environment
- **Node.js 20 LTS** - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control
- **GitHub CLI** - GitHub command-line tool
- **Build tools** - gcc, make, python3 for native modules

### Pre-installed Tools
- TypeScript
- ESLint
- Build essentials for native npm packages

### VS Code Extensions
When opening this project in a devcontainer, these extensions will be automatically installed:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind utility class autocomplete
- **TypeScript** - Enhanced TypeScript support
- **npm IntelliSense** - Package name autocomplete
- **Code Spell Checker** - Spell checking for code
- **GitHub Copilot** - AI pair programming (requires subscription)

## Prerequisites

### Option 1: VS Code with Dev Containers (Recommended)
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install [Visual Studio Code](https://code.visualstudio.com/)
3. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Option 2: GitHub Codespaces
No local installation required - runs entirely in the cloud.

## Using the Dev Container

### With VS Code (Local)

1. Open the project folder in VS Code
2. When prompted, click "Reopen in Container"
   - Or use Command Palette (F1) → "Dev Containers: Reopen in Container"
3. Wait for the container to build (first time only, ~2-5 minutes)
4. The terminal will automatically run `npm install`
5. Start developing!

### With GitHub Codespaces

1. Go to the repository on GitHub
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for the environment to initialize
6. Start developing in your browser or connect with VS Code

## First Time Setup

After the container starts, dependencies will be automatically installed via `postCreateCommand`. You can start the development server immediately:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Common Tasks

### Start Development Server
```bash
npm run dev
```

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Run Type Checking
```bash
npx tsc --noEmit
```

### Build Desktop App (Windows)
Note: Windows builds require a Windows host or special configuration
```bash
npm run build-exe
```

## Ports

The devcontainer automatically forwards port 3000 (Next.js dev server) to your host machine.

## File System

- The project folder is mounted at `/workspace`
- Changes are synchronized between the container and your host
- `node_modules` is inside the container for better performance

## Customization

### Add More Extensions

Edit `.devcontainer/devcontainer.json` and add extension IDs to the `extensions` array:

```json
"extensions": [
  "dbaeumer.vscode-eslint",
  "your.extension.id"
]
```

### Install Additional Tools

Edit `.devcontainer/Dockerfile` to add more system packages or global npm packages:

```dockerfile
RUN apt-get install -y your-package
# or
RUN npm install -g your-tool
```

### Change Node Version

Edit the first line of `.devcontainer/Dockerfile`:

```dockerfile
FROM node:22-bullseye  # Change from node:20-bullseye
```

## Network Access

The devcontainer requires access to several external services. See [ALLOWLIST.md](../ALLOWLIST.md) for a complete list of required domains.

### Minimum Required:
- `registry.npmjs.org` - npm packages
- `github.com` - repository access
- `api.github.com` - GitHub API

### For Proxy Environments

If behind a corporate proxy, set these in `.devcontainer/devcontainer.json`:

```json
"remoteEnv": {
  "HTTP_PROXY": "http://proxy.company.com:8080",
  "HTTPS_PROXY": "http://proxy.company.com:8080",
  "NO_PROXY": "localhost,127.0.0.1"
}
```

## Troubleshooting

### Container Won't Build
- Ensure Docker Desktop is running
- Check Docker has internet access
- Try: "Dev Containers: Rebuild Container"

### Port 3000 Already in Use
- Stop any local Next.js server running on your host
- Or change the port in `next.config.ts` and update `forwardPorts` in `devcontainer.json`

### npm install Fails
- Check network connectivity
- Verify access to `registry.npmjs.org`
- See [ALLOWLIST.md](../ALLOWLIST.md) for required domains

### Extensions Not Installing
- Check VS Code marketplace connectivity
- Verify extension IDs are correct
- Try: "Developer: Reload Window"

### Performance Issues
- Increase Docker Desktop memory allocation (Settings → Resources)
- Use Docker volumes for `node_modules` (already configured)
- Close unused applications to free up resources

## Benefits of Using Dev Containers

✅ **Consistent Environment** - Same Node version and tools for all developers  
✅ **No Local Setup** - No need to install Node, npm, or build tools on your host  
✅ **Isolated Dependencies** - Won't conflict with other projects  
✅ **Quick Onboarding** - New developers can start coding in minutes  
✅ **Reproducible Builds** - Everyone builds in the same environment  
✅ **Easy Cleanup** - Delete the container when done, no traces left  

## Alternative: Without Dev Container

If you prefer not to use Docker, you can still develop locally:

1. Install Node.js 20+ from [nodejs.org](https://nodejs.org)
2. Install dependencies: `npm install`
3. Start development: `npm run dev`

See [README.md](../README.md) for complete setup instructions.

## Resources

- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Specification](https://containers.dev/)
- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Docker Documentation](https://docs.docker.com/)

---

**Questions?** Open an issue on the GitHub repository.
