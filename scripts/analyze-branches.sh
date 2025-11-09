#!/bin/bash

# Branch Cleanup Analysis Script
# This script analyzes branches and suggests which ones can be deleted
# It does NOT delete branches - it only provides recommendations

set -e

echo "=================================================="
echo "Branch Cleanup Analysis"
echo "=================================================="
echo ""

# Fetch latest information
echo "Fetching branch information..."
git fetch --all --prune

# Get default branch
DEFAULT_BRANCH=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)
echo "Default branch: $DEFAULT_BRANCH"
echo ""

# Protected branches that should never be deleted
PROTECTED_BRANCHES=(
  "$DEFAULT_BRANCH"
  "main"
  "master"
  "develop"
  "staging"
  "production"
)

echo "Protected branches:"
for branch in "${PROTECTED_BRANCHES[@]}"; do
  echo "  - $branch"
done
echo ""

# Arrays to store branch categorization
MERGED_BRANCHES=()
UNMERGED_BRANCHES=()
PROTECTED_FOUND=()

# Get all remote branches
ALL_BRANCHES=$(git branch -r | grep -v HEAD | sed 's/origin\///' | tr -d ' ')

echo "Analyzing branches..."
echo ""

for branch in $ALL_BRANCHES; do
  # Check if branch is protected
  is_protected=false
  for protected in "${PROTECTED_BRANCHES[@]}"; do
    if [[ "$branch" == "$protected" ]]; then
      PROTECTED_FOUND+=("$branch")
      is_protected=true
      break
    fi
  done
  
  if [ "$is_protected" = true ]; then
    continue
  fi
  
  # Check if branch has commits not in default branch
  if git log "$DEFAULT_BRANCH..$branch" --oneline | grep -q .; then
    # Has unmerged commits
    UNMERGED_BRANCHES+=("$branch")
  else
    # Fully merged
    MERGED_BRANCHES+=("$branch")
  fi
done

# Display results
echo "=================================================="
echo "ANALYSIS RESULTS"
echo "=================================================="
echo ""

echo "✓ PROTECTED BRANCHES (will not be deleted):"
if [ ${#PROTECTED_FOUND[@]} -eq 0 ]; then
  echo "  None found"
else
  for branch in "${PROTECTED_FOUND[@]}"; do
    echo "  - $branch"
  done
fi
echo ""

echo "✓ MERGED BRANCHES (safe to delete):"
if [ ${#MERGED_BRANCHES[@]} -eq 0 ]; then
  echo "  None found"
else
  for branch in "${MERGED_BRANCHES[@]}"; do
    # Get last commit date
    last_commit=$(git log -1 --format="%ci" "origin/$branch" 2>/dev/null || echo "unknown")
    echo "  - $branch (last commit: ${last_commit:0:10})"
  done
fi
echo ""

echo "⚠ UNMERGED BRANCHES (have unique commits, review before deleting):"
if [ ${#UNMERGED_BRANCHES[@]} -eq 0 ]; then
  echo "  None found"
else
  for branch in "${UNMERGED_BRANCHES[@]}"; do
    commit_count=$(git log "$DEFAULT_BRANCH..origin/$branch" --oneline | wc -l)
    last_commit=$(git log -1 --format="%ci" "origin/$branch" 2>/dev/null || echo "unknown")
    echo "  - $branch ($commit_count unmerged commits, last commit: ${last_commit:0:10})"
  done
fi
echo ""

echo "=================================================="
echo "SUMMARY"
echo "=================================================="
echo "Total branches: $((${#PROTECTED_FOUND[@]} + ${#MERGED_BRANCHES[@]} + ${#UNMERGED_BRANCHES[@]}))"
echo "  Protected: ${#PROTECTED_FOUND[@]}"
echo "  Safe to delete (merged): ${#MERGED_BRANCHES[@]}"
echo "  Needs review (unmerged): ${#UNMERGED_BRANCHES[@]}"
echo ""

# Generate deletion commands
if [ ${#MERGED_BRANCHES[@]} -gt 0 ]; then
  echo "=================================================="
  echo "DELETION COMMANDS (for merged branches)"
  echo "=================================================="
  echo ""
  echo "To delete merged branches, run these commands:"
  echo ""
  
  for branch in "${MERGED_BRANCHES[@]}"; do
    echo "git push origin --delete $branch"
  done
  echo ""
  echo "Or use the GitHub CLI:"
  echo ""
  for branch in "${MERGED_BRANCHES[@]}"; do
    echo "gh api -X DELETE /repos/{owner}/{repo}/git/refs/heads/$branch"
  done
  echo ""
fi

echo "=================================================="
echo "Note: This script only analyzes branches."
echo "Use the cleanup-branches.yml GitHub Action for automated cleanup."
echo "Or manually delete branches using the commands above."
echo "=================================================="
