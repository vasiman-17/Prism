import os
import re
import requests


def _get_github_headers():
    """Build GitHub API headers, including auth token if available."""
    headers = {
        "User-Agent": "PRism-App",
        "Accept": "application/vnd.github.v3+json"
    }
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    return headers


def parse_pr_url(pr_url):
    """Extract owner, repo, and pull number from GitHub PR URL."""
    # Handle both https://github.com/owner/repo/pull/123 and variations
    match = re.search(r'(?:https?://)?(?:www\.)?github\.com/([^/]+)/([^/]+)/pull/(\d+)', pr_url)
    if not match:
        raise ValueError(f"Invalid GitHub PR URL: {pr_url}")

    owner, repo, pull_number = match.groups()
    return owner, repo, pull_number


def get_pr_data(pr_url):
    """Fetch PR metadata and diff from GitHub REST API."""
    try:
        owner, repo, pull_number = parse_pr_url(pr_url)
    except ValueError as e:
        raise Exception(str(e))

    # Fetch PR metadata
    pr_url_api = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"
    files_url_api = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/files"

    try:
        headers = _get_github_headers()

        # Fetch PR metadata
        pr_response = requests.get(pr_url_api, headers=headers, timeout=10)

        if pr_response.status_code != 200:
            if pr_response.status_code == 404:
                raise Exception("Pull request not found. Make sure the URL is correct and the repo is public.")
            if pr_response.status_code == 403:
                raise Exception("GitHub API rate limit exceeded. Please try again in a few minutes.")
            raise Exception(f"GitHub API returned status {pr_response.status_code}")
        pr = pr_response.json()

        # Fetch PR files and diffs
        files_response = requests.get(files_url_api, headers=headers, timeout=10)
        if files_response.status_code != 200:
            raise Exception(f"GitHub API returned status {files_response.status_code}")
        files = files_response.json()

    except requests.exceptions.RequestException as e:
        raise Exception(f"Could not fetch PR. Make sure it is a public repository. Error: {str(e)}")

    # Extract diff text from all files
    diff_text = ""
    file_names = []

    for file_obj in files:
        file_names.append(file_obj.get("filename", ""))
        patch = file_obj.get("patch", "")
        if patch:
            diff_text += f"\n--- {file_obj.get('filename', '')}\n{patch}"

    # Limit diff_text to 6000 characters
    if len(diff_text) > 6000:
        diff_text = diff_text[:6000] + "\n... (truncated)"

    return {
        "title": pr.get("title", ""),
        "author": pr.get("user", {}).get("login", "unknown"),
        "files_changed": len(files),
        "additions": pr.get("additions", 0),
        "deletions": pr.get("deletions", 0),
        "body": pr.get("body", "") or "",
        "diff_text": diff_text,
        "file_names": file_names,
        "pr_url": pr.get("html_url", pr_url)
    }
