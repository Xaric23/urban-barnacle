# Branch Cleanup Workflow Fix

## Issue
The automated branch cleanup workflow (`cleanup-branches.yml`) was not successfully deleting merged branches. While the workflow reported success, branches remained in the repository.

## Root Causes

### 1. Branch Protection
**All branches in the repository had branch protection enabled**, causing HTTP 422 errors when the workflow attempted deletion. The workflow was not checking GitHub's branch protection status before attempting to delete branches.

### 2. Incorrect Git Syntax
The workflow used incorrect syntax for checking if branches were merged:
```bash
# OLD (incorrect)
git log "$DEFAULT_BRANCH..$branch" --oneline
```

This failed because the branches only existed as remote references (not local branches), resulting in:
```
fatal: ambiguous argument 'main..copilot/some-branch': unknown revision or path not in the working tree.
```

### 3. Poor Error Reporting
The workflow didn't differentiate between different types of failures, making it difficult to diagnose why branches weren't being deleted.

## Solutions Implemented

### 1. GitHub API Protection Check
Added a check to query GitHub's branch protection API before attempting deletion:

```bash
protection_status=$(curl -s -w "%{http_code}" -o /tmp/protection_response.json \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${{ github.repository }}/branches/$branch/protection")

if [[ $protection_status == "200" ]]; then
  echo "⚠️  Branch $branch is protected in GitHub - skipping"
  ((protected_count++))
  continue
fi
```

This allows the workflow to:
- Detect protected branches before attempting deletion
- Skip protected branches gracefully
- Provide clear feedback about why branches weren't deleted

### 2. Fixed Git Log Syntax
Corrected the git log command to use the `origin/` prefix for remote branches:

```bash
# NEW (correct)
if git log "origin/$DEFAULT_BRANCH..origin/$branch" --oneline 2>/dev/null | grep -q .; then
  echo "Branch $branch has unmerged commits, skipping..."
else
  echo "Branch $branch is fully merged, attempting to delete..."
fi
```

This ensures:
- Remote branches are properly referenced
- No more "unknown revision" errors
- Accurate detection of merged vs. unmerged branches

### 3. Enhanced Logging and Metrics
Added detailed tracking and reporting:

```bash
deleted_count=0
skipped_count=0
protected_count=0

# ... during processing ...

echo "================================================"
echo "Branch cleanup completed!"
echo "  Deleted: $deleted_count"
echo "  Protected: $protected_count"
echo "  Skipped: $skipped_count"
echo "================================================"
```

Benefits:
- Clear visibility into what happened during the workflow run
- Easy to see how many branches were protected vs. skipped for other reasons
- Better emoji indicators (✅, ⚠️, ❌) for quick visual scanning

### 4. Improved Error Handling
Added specific handling for HTTP 422 errors:

```bash
if [[ $http_code == "204" ]]; then
  echo "✅ Deleted merged branch: $branch"
  ((deleted_count++))
elif [[ $http_code == "422" ]]; then
  echo "⚠️  Cannot delete $branch (HTTP 422) - branch may be protected or have a protection rule"
  ((protected_count++))
else
  echo "❌ Failed to delete $branch (HTTP $http_code)"
  ((skipped_count++))
fi
```

## Testing

### Before Fix
```
Branch copilot/some-branch is fully merged, checking if it can be deleted...
Note: Could not delete copilot/some-branch (HTTP 422) - it may be protected or already deleted

fatal: ambiguous argument 'main..copilot/another-branch': unknown revision or path not in the working tree.
```

### After Fix
```
Checking protection status for copilot/some-branch...
⚠️  Branch copilot/some-branch is protected in GitHub - skipping

================================================
Branch cleanup completed!
  Deleted: 0
  Protected: 44
  Skipped: 1
================================================
```

## How to Use

### For Repository Maintainers

1. **To enable branch deletion**, remove branch protection for merged branches:
   - Go to **Settings** → **Branches** → **Branch protection rules**
   - Edit or delete protection rules for branches you want to clean up
   
2. **Run the workflow manually**:
   - Go to **Actions** → **Cleanup Merged Branches**
   - Click **Run workflow**
   - Review the logs to see what was deleted

3. **Check the results**:
   - Look for the summary at the end of the workflow logs
   - Protected branches will be clearly marked with ⚠️
   - Successfully deleted branches will show ✅

### For Understanding Workflow Behavior

The workflow will **only delete** branches that meet ALL these criteria:
- ✅ Fully merged into the default branch (main)
- ✅ NOT in the protected list (main, master, develop, staging, production)
- ✅ NOT protected in GitHub's branch protection settings
- ✅ API deletion succeeds (HTTP 204)

The workflow will **skip** branches that:
- ⚠️ Have branch protection enabled in GitHub
- ⚠️ Are in the protected branches list
- ⚠️ Have unmerged commits
- ⚠️ Cannot be deleted for other reasons (HTTP errors)

## Files Changed

1. `.github/workflows/cleanup-branches.yml` - Main workflow file
   - Added GitHub API protection check
   - Fixed git log syntax for remote branches
   - Added counters and improved logging
   - Enhanced error handling

2. `BRANCH_MANAGEMENT.md` - Documentation
   - Updated troubleshooting section
   - Added information about the fix
   - Clarified branch protection requirements

## Related Documentation

- [BRANCH_MANAGEMENT.md](./BRANCH_MANAGEMENT.md) - Complete branch management policy
- [BRANCHES_TO_DELETE.md](./BRANCHES_TO_DELETE.md) - List of branches pending deletion
- [CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md) - Detailed cleanup instructions

## Future Improvements

Potential enhancements for future iterations:

1. **Automatic Protection Removal**: Script to automatically remove protection from fully merged branches
2. **Branch Age Criteria**: Only delete branches older than X days after merge
3. **Whitelist/Blacklist**: Configuration file for branch deletion rules
4. **Notification System**: Alert maintainers when branches are deleted
5. **Dry Run Mode**: Preview what would be deleted without actually deleting

## Conclusion

The branch cleanup workflow now:
- ✅ Correctly identifies remote branches
- ✅ Respects GitHub branch protection settings
- ✅ Provides clear, actionable feedback
- ✅ Handles errors gracefully
- ✅ Reports detailed metrics

The workflow will successfully delete merged branches once branch protection is removed from them.
