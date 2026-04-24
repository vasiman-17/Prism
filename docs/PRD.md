# PRism — Product Requirements Document

## What It Is
PRism is an AI-powered GitHub Pull Request reviewer. 
Paste a public GitHub PR URL. PRism reads the entire 
diff and returns a structured senior-engineer-level 
review with 4 sections plus a risk score.

## Target User
Junior to mid-level developers who want instant, 
detailed feedback on their code before requesting 
human review.

## Core Features

### 1. PR Analysis
- Input: public GitHub PR URL
- Output: structured JSON review with 4 sections

### 2. Review Sections
- SUMMARY: 2-3 sentence plain English explanation 
  of what the PR does
- RISKS: 3-5 specific bugs or risks found in the diff
- SUGGESTIONS: 3-5 specific improvements with 
  exact code changes where possible
- RISK SCORE: integer 0-100

### 3. Risk Score Logic
- 0-29: Safe to merge
- 30-69: Review carefully before merging  
- 70-100: Do not merge, fix issues first

## Pages
1. Landing page — hero with PR URL input
2. Scan page — fullscreen cinematic animation 
   while processing
3. Results page — animated review cards

## Out of Scope (not building this)
- Private repo support
- Authentication/user accounts
- Saving review history
- Comments posted back to GitHub