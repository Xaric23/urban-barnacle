# Branch Cleanup Checklist

Quick reference checklist for repository administrators to complete the branch cleanup.

## 📋 Pre-Cleanup Checklist

- [ ] Read [CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md) for full details
- [ ] Review [BRANCHES_TO_DELETE.md](./BRANCHES_TO_DELETE.md) to see which branches will be deleted
- [ ] Confirm you have **repository administrator access**
- [ ] Backup repository if desired (optional but recommended)

## 🔧 Cleanup Steps

### Step 1: Verify the Branch List
```bash
# Test the script to see what would be deleted
bash scripts/delete_unnecessary_branches.sh --dry-run
```
- [ ] Dry-run completed
- [ ] Reviewed list of 44 branches to delete
- [ ] Confirmed no unexpected branches in the list

### Step 2: Remove Branch Protection

Go to: https://github.com/Xaric23/urban-barnacle/settings/branches

**Current situation:** All 48 branches are protected

**Options:**
- [ ] **Option A**: Delete all protection rules temporarily
- [ ] **Option B**: Modify rules to exclude old/merged branches  
- [ ] **Option C**: Manually unprotect each branch individually

**Recommended:** Option A (temporary full removal), then recreate only for `main`

### Step 3: Execute the Cleanup

```bash
# Run the actual deletion
bash scripts/delete_unnecessary_branches.sh
```

- [ ] Script executed successfully
- [ ] 44 branches deleted
- [ ] No unexpected errors

**If you see "protected" errors:**
- Branch protection is still active
- Go back to Step 2

### Step 4: Verify Cleanup

```bash
# Check remaining branches
git fetch --all --prune
git branch -r
```

**Expected result:**
- [ ] Only 4 branches remain:
  - `origin/main`
  - `origin/copilot/remove-unnecessary-branches` (this PR)
  - `origin/dependabot/github_actions/actions/upload-artifact-6`
  - `origin/dependabot/github_actions/actions/setup-java-5`

**Or check on GitHub:**
- [ ] Visit: https://github.com/Xaric23/urban-barnacle/branches
- [ ] Confirm only 4 branches listed

## ⚙️ Post-Cleanup Configuration

### Step 5: Reconfigure Branch Protection

Go to: https://github.com/Xaric23/urban-barnacle/settings/branches

- [ ] Remove or disable all existing protection rules
- [ ] Add new protection rule **only for `main` branch**:
  - Branch name pattern: `main`
  - ✓ Require pull request reviews (optional)
  - ✓ Require status checks to pass (optional)
  - ✓ Require conversation resolution (optional)

**Important:** Do NOT protect all branches - only `main`!

### Step 6: Enable Auto-Delete After Merge

Go to: https://github.com/Xaric23/urban-barnacle/settings

Scroll to "Pull Requests" section:
- [ ] Enable: ✓ **"Automatically delete head branches"**

This prevents future branch accumulation.

### Step 7: Verify Automation

The repository already has a cleanup workflow at `.github/workflows/cleanup-branches.yml`

- [ ] Go to: https://github.com/Xaric23/urban-barnacle/actions/workflows/cleanup-branches.yml
- [ ] Manually trigger the workflow (click "Run workflow")
- [ ] Confirm it runs without errors
- [ ] Check logs to see it's working correctly

## 🎉 Completion Checklist

- [ ] 44 branches deleted successfully
- [ ] Only 4 branches remain (main + 3 active)
- [ ] Branch protection reconfigured (only main)
- [ ] Auto-delete enabled
- [ ] Automated cleanup workflow tested

## 🧹 Final Cleanup

After this PR is merged:
- [ ] Delete the `copilot/remove-unnecessary-branches` branch (this PR)
- [ ] After Dependabot PRs are merged/closed, their branches will auto-delete

**Expected final state:** Only `main` branch remains!

## 📊 Results

| Metric | Before | After |
|--------|---------|-------|
| Total branches | 48 | 4 |
| Protected branches | 48 | 1 |
| Stale branches | 44 | 0 |

**Reduction:** 92% fewer branches! 🎉

## ❓ Troubleshooting

### Issue: Script reports "FAILED (protected)"
**Solution:** Branch protection not removed. Go back to Step 2.

### Issue: Script reports "FAILED (error)"
**Solution:** Check git credentials, ensure you have push access.

### Issue: Branches not listed
**Solution:** Run `git fetch --all --prune` to update local references.

### Issue: Workflow still fails
**Solution:** Ensure branch protection is properly configured (only protect `main`).

## 📚 Reference Documents

- **What to delete:** [BRANCHES_TO_DELETE.md](./BRANCHES_TO_DELETE.md)
- **How to delete:** [CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md)  
- **Why and impact:** [BRANCH_CLEANUP_SUMMARY.md](./BRANCH_CLEANUP_SUMMARY.md)
- **Ongoing policy:** [BRANCH_MANAGEMENT.md](./BRANCH_MANAGEMENT.md)

## ⏱️ Estimated Time

- Pre-cleanup review: **5 minutes**
- Removing protection: **2 minutes**
- Running script: **1 minute**
- Verification: **2 minutes**
- Reconfiguration: **5 minutes**

**Total:** ~15 minutes

---

**Ready to start?** Begin with Step 1 above!
