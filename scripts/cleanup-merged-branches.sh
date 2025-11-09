#!/bin/bash

# One-Time Branch Cleanup Script
# This script deletes ALL branches that are fully merged into main
# USE WITH CAUTION - This will actually delete branches!

set -e

echo "=================================================="
echo "⚠️  ONE-TIME BRANCH CLEANUP ⚠️"
echo "=================================================="
echo ""
echo "This script will DELETE all merged branches."
echo "Protected branches (main, develop, etc.) will be skipped."
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it first:"
    echo "  - macOS: brew install gh"
    echo "  - Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo "  - Windows: winget install --id GitHub.cli"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub."
    echo ""
    echo "Run: gh auth login"
    echo ""
    exit 1
fi

echo "Press Ctrl+C now to cancel, or Enter to continue..."
read

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "Repository: $REPO"
echo ""

# Fetch latest information
echo "Fetching branch information..."
git fetch --all --prune

# Get default branch
DEFAULT_BRANCH=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)
echo "Default branch: $DEFAULT_BRANCH"
echo ""

# Protected branches
PROTECTED_BRANCHES=(
  "$DEFAULT_BRANCH"
  "main"
  "master"
  "develop"
  "staging"
  "production"
)

# Get all remote branches
echo "Analyzing branches..."
ALL_BRANCHES=$(git branch -r | grep -v HEAD | sed 's/origin\///' | tr -d ' ')

DELETED_COUNT=0
SKIPPED_COUNT=0
ERROR_COUNT=0

for branch in $ALL_BRANCHES; do
  # Check if protected
  is_protected=false
  for protected in "${PROTECTED_BRANCHES[@]}"; do
    if [[ "$branch" == "$protected" ]]; then
      is_protected=true
      break
    fi
  done
  
  if [ "$is_protected" = true ]; then
    echo "⊗ Skipping protected: $branch"
    ((SKIPPED_COUNT++))
    continue
  fi
  
  # Check if merged
  if git log "$DEFAULT_BRANCH..$branch" --oneline | grep -q .; then
    echo "⊗ Skipping unmerged: $branch (has unique commits)"
    ((SKIPPED_COUNT++))
  else
    echo "Deleting merged branch: $branch"
    
    # Delete using GitHub CLI
    if gh api -X DELETE "/repos/$REPO/git/refs/heads/$branch" &> /dev/null; then
      echo "✓ Deleted: $branch"
      ((DELETED_COUNT++))
    else
      echo "✗ Failed to delete: $branch (may be protected or already deleted)"
      ((ERROR_COUNT++))
    fi
  fi
done

echo ""
echo "=================================================="
echo "CLEANUP COMPLETE"
echo "=================================================="
echo "Branches deleted: $DELETED_COUNT"
echo "Branches skipped: $SKIPPED_COUNT"
echo "Errors: $ERROR_COUNT"
echo ""
echo "Run 'git fetch --prune' to update your local references."
