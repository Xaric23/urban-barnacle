# Code Optimization Workflow

This document explains the Code Optimization Scanner workflow that automatically analyzes the codebase for optimization opportunities.

## Overview

The Code Optimization Scanner is a GitHub Actions workflow that runs comprehensive code analysis to identify:
- Large bundle sizes
- Unused dependencies
- Code complexity issues
- Dead/unused code
- Performance anti-patterns

## Workflow Triggers

The workflow runs automatically on:
- **Push to main branch**: Analyzes changes merged to main
- **Pull requests to main**: Provides optimization feedback before merge
- **Manual dispatch**: Can be triggered manually from the Actions tab

## Analysis Jobs

### 1. Bundle Size Analysis

Analyzes the Next.js build output to identify:
- Total size of build artifacts
- Largest bundles that could benefit from code splitting
- Static page sizes

**What to look for:**
- Bundles larger than 1-2 MB may need splitting
- Unexpected large files in the build output

### 2. Dependency Analysis

Scans npm dependencies to find:
- Unused dependencies that can be removed
- Largest dependencies consuming disk space

**Actions you can take:**
```bash
# Remove unused dependency
npm uninstall <package-name>

# Check what's using a large dependency
npm ls <package-name>
```

### 3. Code Complexity Analysis

Provides statistics about the codebase:
- Total number of TypeScript/TSX files
- Total lines of code
- Largest files (potential refactoring candidates)

**Guidelines:**
- Files over 500 lines may benefit from being split
- Files over 1000 lines should be reviewed for refactoring

### 4. Dead Code Detection

Uses `ts-unused-exports` to find:
- Exported functions/components that are never imported
- Code that can be safely removed

**How to fix:**
```typescript
// If an export is reported as unused, either:
// 1. Remove it if truly unused
export function unusedFunction() { ... }  // Delete this

// 2. Remove the export if only used internally
function internalFunction() { ... }  // Remove 'export'
```

### 5. Performance Hints

Quick checks for common issues:
- `console.log` statements (should be removed in production)
- `debugger` statements (should be removed before commit)
- `any` types (should use proper TypeScript types)
- TODO/FIXME comments (tracks technical debt)

**Best practices:**
```typescript
// ❌ Avoid
console.log('Debug info:', data);
const data: any = fetchData();

// ✅ Better
// Remove console.log or use proper logging
const data: UserData = fetchData();
```

## Viewing Results

1. Navigate to the **Actions** tab in GitHub
2. Click on the **Code Optimization Scanner** workflow
3. Select a workflow run
4. View the **Summary** for each job
5. Each job provides a formatted report with findings

## Understanding the Output

### Bundle Analysis Example
```
## Bundle Analysis
4.4M    .next/server
796K    .next/build
784K    .next/static
```
- Server bundle is large but expected for Next.js
- Watch for unexpected growth in these numbers

### Dependency Analysis Example
```
Unused dependencies:
- old-package (installed but never imported)

Top 10 Largest Dependencies:
500M    node_modules/electron
50M     node_modules/@capacitor
```
- Remove unused dependencies to reduce install time
- Large dependencies are noted but may be necessary

### Dead Code Example
```
lib/utils.ts: unusedHelper
components/Old.tsx: OldComponent
```
- These exports are not imported anywhere
- Safe to remove or make private

## Taking Action

After reviewing the workflow results:

1. **Prioritize** - Not all findings need immediate action
2. **Validate** - Some "unused" code may be used in tests or examples
3. **Refactor** - Break down large files into smaller modules
4. **Remove** - Delete truly unused code and dependencies
5. **Update** - Fix console.log and debugger statements

## Workflow Configuration

The workflow file is located at:
```
.github/workflows/code-optimization.yml
```

### Customizing the Workflow

You can modify thresholds and rules by editing the workflow file:

```yaml
# Example: Change Node.js version
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: '22.x'  # Change version here

# Example: Ignore specific files in dead code detection
ts-unused-exports tsconfig.json --ignoreFiles="**/*.test.ts"
```

## Integration with CI/CD

This workflow runs independently and does not block merges. It provides:
- **Informational feedback** for developers
- **Trends over time** to track code health
- **Proactive alerts** before issues become problems

## Best Practices

1. **Review regularly**: Check the workflow results weekly
2. **Address incrementally**: Don't try to fix everything at once
3. **Set goals**: Aim to reduce bundle size by X% or remove Y dependencies
4. **Document decisions**: If keeping "unused" code, add comments explaining why
5. **Automate cleanup**: Use tools like `eslint --fix` where possible

## Troubleshooting

### Workflow fails on "Install dependencies"
- Check that `package.json` and `package-lock.json` are in sync
- Ensure all dependencies are properly declared

### False positives in dead code detection
- Code may be used dynamically (e.g., via `require()`)
- Code may be exposed as public API
- Code may be used in examples or documentation

### Tools not available
- Tools are installed globally in the workflow
- If a tool fails, check the version in the workflow file

## Additional Resources

- [Next.js Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Depcheck Documentation](https://github.com/depcheck/depcheck)
- [ts-unused-exports](https://github.com/pzavolinsky/ts-unused-exports)

## Support

For issues with the workflow:
1. Check the workflow logs in GitHub Actions
2. Review this documentation
3. Open an issue in the repository
