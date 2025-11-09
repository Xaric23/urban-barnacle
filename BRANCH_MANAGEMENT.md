# Branch Management Policy

## Overview

This repository uses an automated branch cleanup system to maintain a clean and organized branch structure.

## Protected Branches

The following branches are protected and will **never** be automatically deleted:

- `main` - The primary production branch
- `master` - Alternative main branch name (if exists)
- `develop` - Development integration branch (if used)
- `staging` - Staging/pre-production branch (if used)
- `production` - Production deployment branch (if used)

## Branch Cleanup

### Automatic Cleanup

A GitHub Actions workflow (`cleanup-branches.yml`) automatically deletes merged branches:

- **Trigger 1**: After any pull request is closed (if merged)
- **Trigger 2**: Weekly on Sundays at midnight UTC
- **Trigger 3**: Manual workflow dispatch (can be run anytime)

### Cleanup Criteria

A branch is eligible for deletion if:

1. It is **fully merged** into the default branch (main)
2. It is **not** in the protected branches list
3. It has **no unmerged commits**

### Manual Branch Deletion

If you need to manually delete branches, follow these steps:

```bash
# List all remote branches
git branch -r

# Delete a remote branch
git push origin --delete branch-name

# Clean up local references to deleted remote branches
git fetch --all --prune
```

## Best Practices

### For Contributors

1. **Create feature branches** for all new features: `feature/description`
2. **Create fix branches** for bug fixes: `fix/description`  
3. **Delete your branch** after your PR is merged (or let automation handle it)
4. **Use descriptive names** to help identify stale branches

### For Maintainers

1. **Merge PRs** using "Squash and merge" or "Rebase and merge" to keep history clean
2. **Enable "Automatically delete head branches"** in repository settings for extra safety
3. **Review merged branches** periodically before the automated cleanup runs
4. **Check the workflow logs** to see which branches were deleted

## Workflow Configuration

### GitHub Repository Settings

To complement the automated workflow, enable these settings:

1. Go to **Settings** → **General** → **Pull Requests**
2. Check ✓ **Automatically delete head branches**

This ensures branches are deleted immediately after PR merge, even before the workflow runs.

### Branch Protection Rules

Set up branch protection for important branches:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rules for `main` (and other important branches):
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators (optional)

## Monitoring

### View Cleanup Activity

Check the [Actions tab](../../actions/workflows/cleanup-branches.yml) to:

- See when the workflow last ran
- View which branches were deleted
- Check for any errors or issues

### Restore Deleted Branches

If a branch was deleted by mistake:

```bash
# Find the commit SHA of the deleted branch
git reflog show origin/branch-name

# Recreate the branch pointing to that commit
git push origin <commit-sha>:refs/heads/branch-name
```

## Troubleshooting

### Branch Not Being Deleted

If a merged branch isn't being deleted:

1. **Check if it's protected** - Review the protected branches list
2. **Verify it's merged** - Ensure the PR was actually merged (not just closed)
3. **Check branch protection** - The branch might have protection rules
4. **Review workflow logs** - Look for error messages in the Actions tab

### Workflow Permissions

The workflow requires these permissions:

- `contents: write` - To delete branches

If you see permission errors, check:

1. Repository settings → Actions → General → Workflow permissions
2. Ensure "Read and write permissions" is enabled

## Summary

This automated system keeps the repository clean by:

- ✓ Removing merged feature branches automatically
- ✓ Protecting important branches from deletion
- ✓ Running on multiple triggers (PR close, weekly, manual)
- ✓ Providing clear logs of all cleanup activity

For questions or issues, open a GitHub issue or contact the repository maintainers.
