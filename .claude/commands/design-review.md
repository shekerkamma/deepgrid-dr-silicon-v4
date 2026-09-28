---
description: Design review of pending changes (or a given commit range) on the DG32 v4 site
argument-hint: "[commit-range, e.g. HEAD~1..HEAD; default: uncommitted + commits ahead of origin/main]"
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Task
---

<!-- Adapted from OneRedOak/claude-code-workflows design-review-slash-command (MIT); see
     .claude/THIRD_PARTY_NOTICES.md. -->

Requested range: `$ARGUMENTS` (empty means: uncommitted changes plus commits ahead of `origin/main`).

## Repository state

Status:
!`git status --short`

Commits ahead of origin/main:
!`git log --oneline origin/main..HEAD`

Files changed, committed and uncommitted, against origin/main:
!`git diff --stat origin/main`

## Task

1. Work out the changes to review. If a range was given, use `git diff --stat <range>` and
   `git log --oneline <range>`; otherwise use the state above. If there are no changes at all, say so and stop.
2. Launch the `design-review` subagent with: the list of changed files, the commit subjects, and the scope
   rule from its instructions (shared files mean a representative route set).
3. Reply with the agent's markdown report and nothing else.
