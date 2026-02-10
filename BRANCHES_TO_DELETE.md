# Branches to Delete

This document lists all branches that should be deleted from the repository to clean up unnecessary branches.

## Summary

- **Merged branches to delete**: 38 branches
- **Closed but not merged branches**: 6 branches (review needed)
- **Open PRs to keep**: 3 branches (including this PR)
- **Main branch**: 1 branch (keep)

**Total branches to delete**: 44 out of 48 branches

## How to Delete Branches

All branches in this repository are currently protected. To delete them, you need to:

1. **Unprotect the branches** (requires admin access)
2. **Delete the branches** using the GitHub UI or the provided script
3. **(Optional) Re-protect remaining branches**

### Using GitHub UI

Navigate to: `https://github.com/Xaric23/urban-barnacle/branches`

For each branch listed below, click the trash icon to delete it.

### Using Git Commands

After unprotecting branches, you can use:

```bash
# Delete a single remote branch
git push origin --delete <branch-name>

# Or use the provided cleanup script
bash scripts/delete_unnecessary_branches.sh
```

## Branches to Delete

### Merged Branches (38 branches)

These branches have been successfully merged to main and can be safely deleted:

1. `copilot/remove-bootstrap-system` (PR #74)
2. `dependabot/npm_and_yarn/development-dependencies-8b8ba44ed6` (PR #72)
3. `dependabot/npm_and_yarn/types/node-25.0.2` (PR #69)
4. `dependabot/npm_and_yarn/production-dependencies-6eeb9c5ae6` (PR #66)
5. `copilot/fix-npm-error-installing-typescript-complexity` (PR #65)
6. `copilot/fix-stuck-on-init-bug` (PR #64)
7. `dependabot/npm_and_yarn/development-dependencies-4d2f9f22f3` (PR #62)
8. `dependabot/npm_and_yarn/production-dependencies-a4f14df593` (PR #61)
9. `dependabot/github_actions/actions/checkout-6` (PR #59)
10. `dependabot/github_actions/actions/upload-pages-artifact-4` (PR #56)
11. `copilot/add-code-optimization-workflow` (PR #55)
12. `copilot/delete-unnecessary-branches` (PR #53)
13. `copilot/fix-app-launch-hang` (PR #51)
14. `copilot/fix-github-pages-bug` (PR #49)
15. `copilot/post-to-github-pages` (PR #45)
16. `copilot/add-brothel-to-game` (PR #43)
17. `copilot/add-18-plus-features` (PR #41)
18. `copilot/create-devcontainer-allowlist` (PR #39)
19. `copilot/create-android-version` (PR #37)
20. `copilot/fix-breast-and-penis-size` (PR #35)
21. `copilot/add-breast-and-penis-size` (PR #33)
22. `copilot/fix-loading-screen-issue` (PR #31)
23. `dependabot/npm_and_yarn/types/node-24.10.0` (PR #29)
24. `dependabot/github_actions/actions/checkout-5` (PR #28)
25. `dependabot/github_actions/actions/setup-node-6` (PR #27)
26. `copilot/fix-gh-personal-access-token` (PR #26)
27. `copilot/onboard-repository-to-copilot` (PR #24)
28. `copilot/onboard-repo` (PR #22)
29. `copilot/fix-loading-time-issue` (PR #20)
30. `copilot/add-auto-update-system` (PR #18)
31. `copilot/fix-electron-builder-config` (PR #16)
32. `copilot/fix-electron-build-dependencies` (PR #14)
33. `copilot/create-exe-launch-game` (PR #12)
34. `copilot/implement-performer-chemistry-features` (PR #10)
35. `copilot/create-bootstrap-launcher-system` (PR #8)
36. `copilot/add-clothing-tip-features` (PR #6)
37. `copilot/convert-project-to-nextjs` (PR #4)
38. `copilot/create-game-mechanics` (PR #1)

### Closed But Not Merged Branches (6 branches)

These branches were closed without merging. Review them before deletion to ensure no important changes are lost:

1. `dependabot/npm_and_yarn/development-dependencies-4aa8229d11` (PR #71)
   - **Reason**: Superseded by a newer dependency update
   
2. `dependabot/npm_and_yarn/development-dependencies-4b430cfb5f` (PR #70)
   - **Reason**: Superseded by a newer dependency update
   
3. `dependabot/npm_and_yarn/development-dependencies-907fd374b5` (PR #68)
   - **Reason**: Superseded by a newer dependency update
   
4. `dependabot/npm_and_yarn/development-dependencies-cea7c95444` (PR #60)
   - **Reason**: Superseded by a newer dependency update
   
5. `dependabot/github_actions/actions/upload-artifact-5` (PR #58)
   - **Reason**: Superseded by actions/upload-artifact-6
   
6. `copilot/fix-github-pages-deployment` (PR #47)
   - **Reason**: Closed in favor of a different approach

**Recommendation**: All of these can be safely deleted as they were either superseded or abandoned.

## Branches to Keep

### Active Development

1. `main` - Main branch (protected, do not delete)
2. `copilot/remove-unnecessary-branches` (PR #76) - Current PR

### Open Pull Requests

These branches have open PRs and should be kept until merged or closed:

1. `dependabot/github_actions/actions/upload-artifact-6` (PR #67)
2. `dependabot/github_actions/actions/setup-java-5` (PR #57)

## Post-Cleanup Actions

After deleting branches:

1. **Review branch protection rules** to prevent accumulation of stale branches
2. **Configure automatic branch deletion** after PR merge in repository settings:
   - Go to Settings → General → Pull Requests
   - Enable "Automatically delete head branches"
3. **Update documentation** if needed
4. **Verify all important changes** are preserved in main branch

## Notes

- All branches listed above are currently protected
- Branch protection must be removed before deletion
- Consider backing up the repository before bulk deletion
- The analysis was performed on 2026-02-10
