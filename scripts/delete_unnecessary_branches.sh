#!/bin/bash

# Script to delete unnecessary branches from the repository
# These branches have been merged or closed and are no longer needed
#
# IMPORTANT: Before running this script:
# 1. Ensure you have admin access to the repository
# 2. Unprotect all branches that need to be deleted
# 3. Review the BRANCHES_TO_DELETE.md file to confirm the list
#
# Usage:
#   bash scripts/delete_unnecessary_branches.sh [--dry-run]
#
# Options:
#   --dry-run   Show what would be deleted without actually deleting

set -e

DRY_RUN=false

# Parse command line arguments
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "DRY RUN MODE - No branches will be deleted"
    echo ""
fi

# Array of merged branches to delete
MERGED_BRANCHES=(
    "copilot/remove-bootstrap-system"
    "dependabot/npm_and_yarn/development-dependencies-8b8ba44ed6"
    "dependabot/npm_and_yarn/types/node-25.0.2"
    "dependabot/npm_and_yarn/production-dependencies-6eeb9c5ae6"
    "copilot/fix-npm-error-installing-typescript-complexity"
    "copilot/fix-stuck-on-init-bug"
    "dependabot/npm_and_yarn/development-dependencies-4d2f9f22f3"
    "dependabot/npm_and_yarn/production-dependencies-a4f14df593"
    "dependabot/github_actions/actions/checkout-6"
    "dependabot/github_actions/actions/upload-pages-artifact-4"
    "copilot/add-code-optimization-workflow"
    "copilot/delete-unnecessary-branches"
    "copilot/fix-app-launch-hang"
    "copilot/fix-github-pages-bug"
    "copilot/post-to-github-pages"
    "copilot/add-brothel-to-game"
    "copilot/add-18-plus-features"
    "copilot/create-devcontainer-allowlist"
    "copilot/create-android-version"
    "copilot/fix-breast-and-penis-size"
    "copilot/add-breast-and-penis-size"
    "copilot/fix-loading-screen-issue"
    "dependabot/npm_and_yarn/types/node-24.10.0"
    "dependabot/github_actions/actions/checkout-5"
    "dependabot/github_actions/actions/setup-node-6"
    "copilot/fix-gh-personal-access-token"
    "copilot/onboard-repository-to-copilot"
    "copilot/onboard-repo"
    "copilot/fix-loading-time-issue"
    "copilot/add-auto-update-system"
    "copilot/fix-electron-builder-config"
    "copilot/fix-electron-build-dependencies"
    "copilot/create-exe-launch-game"
    "copilot/implement-performer-chemistry-features"
    "copilot/create-bootstrap-launcher-system"
    "copilot/add-clothing-tip-features"
    "copilot/convert-project-to-nextjs"
    "copilot/create-game-mechanics"
)

# Array of closed (but not merged) branches to delete
CLOSED_BRANCHES=(
    "dependabot/npm_and_yarn/development-dependencies-4aa8229d11"
    "dependabot/npm_and_yarn/development-dependencies-4b430cfb5f"
    "dependabot/npm_and_yarn/development-dependencies-907fd374b5"
    "dependabot/npm_and_yarn/development-dependencies-cea7c95444"
    "dependabot/github_actions/actions/upload-artifact-5"
    "copilot/fix-github-pages-deployment"
)

# Combine all branches to delete
ALL_BRANCHES=("${MERGED_BRANCHES[@]}" "${CLOSED_BRANCHES[@]}")

echo "========================================"
echo "Branch Deletion Script"
echo "========================================"
echo ""
echo "This script will delete ${#ALL_BRANCHES[@]} branches:"
echo "  - ${#MERGED_BRANCHES[@]} merged branches"
echo "  - ${#CLOSED_BRANCHES[@]} closed (not merged) branches"
echo ""

if [[ "$DRY_RUN" == false ]]; then
    echo "WARNING: This will permanently delete these branches!"
    echo "Press Ctrl+C to cancel, or Enter to continue..."
    read -r
fi

echo ""
echo "Deleting branches..."
echo ""

DELETED_COUNT=0
FAILED_COUNT=0
PROTECTED_COUNT=0

for branch in "${ALL_BRANCHES[@]}"; do
    echo -n "  Deleting $branch... "
    
    if [[ "$DRY_RUN" == true ]]; then
        echo "[DRY RUN]"
        DELETED_COUNT=$((DELETED_COUNT + 1))
    else
        # Try to delete the branch once, then inspect the result
        if output=$(git push origin --delete "$branch" 2>&1); then
            echo "OK"
            DELETED_COUNT=$((DELETED_COUNT + 1))
        else
            if grep -qi "protected" <<< "$output"; then
                echo "FAILED (protected)"
                PROTECTED_COUNT=$((PROTECTED_COUNT + 1))
            else
                echo "FAILED"
                FAILED_COUNT=$((FAILED_COUNT + 1))
            fi
        fi
    fi
done

echo ""
echo "========================================"
echo "Summary"
echo "========================================"
echo "Total branches processed: ${#ALL_BRANCHES[@]}"

if [[ "$DRY_RUN" == true ]]; then
    echo "Would delete: $DELETED_COUNT"
else
    echo "Successfully deleted: $DELETED_COUNT"
fi

if [[ $PROTECTED_COUNT -gt 0 ]]; then
    echo "Protected (not deleted): $PROTECTED_COUNT"
    echo ""
    echo "NOTE: Some branches are protected."
    echo "To delete protected branches:"
    echo "  1. Go to Settings → Branches"
    echo "  2. Remove protection rules"
    echo "  3. Run this script again"
fi

if [[ $FAILED_COUNT -gt 0 ]]; then
    echo "Failed: $FAILED_COUNT"
fi

echo ""

if [[ "$DRY_RUN" == true ]]; then
    echo "DRY RUN COMPLETE - No changes were made"
else
    echo "DONE!"
fi
