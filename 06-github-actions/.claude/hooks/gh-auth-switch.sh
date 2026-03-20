#!/usr/bin/env bash
set -euo pipefail

resolve_github_user() {
    local remote_url
    remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ -z "$remote_url" ]]; then
        echo "ERROR: no git remote 'origin' found" >&2
        return 1
    fi

    local ssh_host
    ssh_host=$(echo "$remote_url" | sed -n 's/^git@\([^:]*\):.*/\1/p')
    if [[ -z "$ssh_host" ]]; then
        echo "ERROR: remote is not SSH format: $remote_url" >&2
        return 1
    fi

    local github_user
    github_user=$(ssh -T "git@${ssh_host#git@}" 2>&1 | grep -oP 'Hi \K[^!]+' || echo "")
    if [[ -z "$github_user" ]]; then
        echo "ERROR: could not resolve GitHub user for SSH host: $ssh_host" >&2
        return 1
    fi

    local repo_path
    repo_path=$(echo "$remote_url" | sed -n 's/^git@[^:]*:\(.*\)\.git$/\1/p')
    if [[ -z "$repo_path" ]]; then
        repo_path=$(echo "$remote_url" | sed -n 's/^git@[^:]*:\(.*\)$/\1/p')
    fi

    echo "GITHUB_USER=$github_user"
    echo "SSH_HOST=$ssh_host"
    echo "REPO=$repo_path"
}

check_gh_auth() {
    local expected_user="$1"
    local current_user
    current_user=$(gh api user -q '.login' 2>/dev/null || echo "")

    if [[ "$current_user" == "$expected_user" ]]; then
        echo "OK"
        return 0
    fi

    echo "MISMATCH:current=$current_user,expected=$expected_user"
    return 1
}

switch_gh_auth() {
    local target_user="$1"
    echo "gh CLI is not authenticated as '$target_user'."
    echo ""
    echo "Options:"
    echo "  1) Run: gh auth login -h github.com"
    echo "     Select the account for '$target_user'"
    echo ""
    echo "  2) Use a Personal Access Token:"
    echo "     Go to https://github.com/settings/tokens"
    echo "     Create a token with 'repo' scope"
    echo "     Run: echo 'TOKEN' | gh auth login --with-token"
    echo ""
    echo "  3) Skip gh CLI — git push/pull still works via SSH."
    echo "     Only gh API operations (secrets, collaborators) need gh auth."
}

if [[ "${1:-}" == "resolve" ]]; then
    resolve_github_user
elif [[ "${1:-}" == "check" ]]; then
    info=$(resolve_github_user)
    eval "$info"
    check_gh_auth "$GITHUB_USER"
elif [[ "${1:-}" == "switch" ]]; then
    info=$(resolve_github_user)
    eval "$info"
    if ! check_gh_auth "$GITHUB_USER" >/dev/null 2>&1; then
        switch_gh_auth "$GITHUB_USER"
    else
        echo "gh CLI already authenticated as $GITHUB_USER"
    fi
else
    echo "Usage: gh-auth-switch.sh {resolve|check|switch}"
    echo ""
    echo "  resolve  — detect GitHub user from git remote + SSH config"
    echo "  check    — verify gh CLI matches the repo owner"
    echo "  switch   — guide auth switch if mismatched"
fi
