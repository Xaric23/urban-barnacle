# Branch Cleanup Guide

This guide explains how to clean up unnecessary branches in the repository.

## 🚀 Quick Start

**New to this?** Start with the [CLEANUP_CHECKLIST.md](./CLEANUP_CHECKLIST.md) for a step-by-step checklist format.

**Want details?** Continue reading this guide for comprehensive instructions.

## Cleanup Options

### Option 1: Manual Cleanup via GitHub UI

1. Go to: https://github.com/Xaric23/urban-barnacle/branches
2. Review the [BRANCHES_TO_DELETE.md](./BRANCHES_TO_DELETE.md) file
3. For each branch listed, click the trash icon to delete it
4. Note: Protected branches cannot be deleted via UI without first removing protection

### Option 2: Using the Cleanup Script

```bash
# First, do a dry run to see what would be deleted
bash scripts/delete_unnecessary_branches.sh --dry-run

# Then, actually delete the branches
bash scripts/delete_unnecessary_branches.sh
```

**Important**: The script requires:
- Repository admin access
- Branches must be unprotected before deletion

### Option 3: Automated Cleanup (Recommended)

The repository includes an automated branch cleanup workflow at `.github/workflows/cleanup-branches.yml` that:
- Runs automatically after pull requests are closed
- Runs weekly on Sundays
- Can be manually triggered from the Actions tab

However, **protected branches cannot be auto-deleted**. See "Dealing with Protected Branches" below.

## Current Situation

As of 2026-02-10, the repository has:
- **48 total branches**
- **38 merged branches** (should be deleted)
- **6 closed but not merged branches** (should be deleted)
- **3 open PRs** (keep for now)
- **1 main branch** (keep always)

**All branches are currently protected**, preventing automatic deletion.

## Dealing with Protected Branches

### Why Are All Branches Protected?

All branches in this repository have branch protection enabled, which prevents:
- Force pushes
- Deletion via API or scripts
- Accidental removal

### How to Unprotect Branches

Only repository administrators can modify branch protection rules:

1. Go to: https://github.com/Xaric23/urban-barnacle/settings/branches
2. Review each protection rule
3. Either:
   - **Option A**: Remove protection for merged/closed branches individually
   - **Option B**: Modify protection rules to exclude old branches
   - **Option C**: Temporarily disable all protection (not recommended)

### Recommended Protection Strategy

Instead of protecting all branches, protect only:
- `main` - The default branch
- Active development branches (if any)

For Copilot and Dependabot branches:
- Let them be created unprotected
- Enable auto-delete after merge (see below)

## Enabling Auto-Delete After Merge

To prevent branch accumulation in the future:

1. Go to: https://github.com/Xaric23/urban-barnacle/settings
2. Scroll to "Pull Requests" section
3. Enable: **"Automatically delete head branches"**

This will automatically delete branches after their PRs are merged.

## Detailed Branch List

See [BRANCHES_TO_DELETE.md](./BRANCHES_TO_DELETE.md) for:
- Complete list of branches to delete
- PR numbers and merge status
- Categorization by type
- Detailed recommendations

## Safety Notes

Before deleting branches:

1. ✅ **Verify all changes are merged**: Check that merged PRs are actually in main
2. ✅ **Back up if needed**: Consider backing up the repository
3. ✅ **Review closed but not merged PRs**: Ensure no important changes are lost
4. ✅ **Keep open PRs**: Don't delete branches with active PRs

## Verification After Cleanup

After deleting branches:

```bash
# List remaining branches
git fetch --all --prune
git branch -r

# Verify main branch has all merged changes
git log --oneline main | head -20
```

Expected result: Only `main` and active PR branches should remain.

## Troubleshooting

### "Branch is protected" error

**Problem**: Cannot delete branch via script or API

**Solution**: 
1. Remove branch protection rules
2. Try deletion again

### "Branch not found" error

**Problem**: Branch was already deleted

**Solution**: This is safe to ignore - the branch is already gone

### Script fails with permission error

**Problem**: Insufficient repository permissions

**Solution**:
1. Ensure you have admin access to the repository
2. Check that your git remote is correctly configured
3. Verify your GitHub token has the correct permissions

## Future Prevention

To avoid branch accumulation:

1. ✅ Enable "Automatically delete head branches" in repository settings
2. ✅ Use the cleanup workflow (already configured)
3. ✅ Only protect necessary branches (main, develop)
4. ✅ Regularly review branches (monthly)

## Summary

**Immediate Action Required:**
1. Review [BRANCHES_TO_DELETE.md](./BRANCHES_TO_DELETE.md)
2. Remove branch protection from merged/closed branches
3. Run the deletion script or manually delete via GitHub UI
4. Enable auto-delete for future PRs

**Long-term Actions:**
1. Configure proper branch protection (only main)
2. Let automated cleanup workflow handle future branches
3. Regularly review branch list (quarterly)

## Questions?

If you need help:
1. Review the documentation files
2. Check the GitHub repository settings
3. Consult GitHub's branch management documentation
4. Open an issue for repository-specific questions
