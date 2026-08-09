#!/usr/bin/env bash
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
source_file="$repo_root/desktop-plugin/nexus-control/plugin.js"

if [[ ! -f "$source_file" ]]; then
  printf 'Missing plugin source: %s\n' "$source_file" >&2
  exit 1
fi

if [[ -n "${WINDOWS_HERMES_HOME:-}" ]]; then
  hermes_home=$WINDOWS_HERMES_HOME
else
  windows_profile=$(cd /mnt/c && cmd.exe /d /c "echo %USERPROFILE%" | tr -d '\r')
  windows_profile_wsl=$(wslpath "$windows_profile")
  hermes_home="$windows_profile_wsl/AppData/Local/hermes"
fi

target="$hermes_home/desktop-plugins/nexus-control/plugin.js"
install -D -m 0644 "$source_file" "$target"

source_hash=$(sha256sum "$source_file" | cut -d' ' -f1)
target_hash=$(sha256sum "$target" | cut -d' ' -f1)

if [[ "$source_hash" != "$target_hash" ]]; then
  printf 'Plugin verification failed.\n' >&2
  exit 1
fi

printf 'Installed NEXUS plugin: %s\nSHA-256: %s\n' "$target" "$target_hash"
printf 'In Hermes Desktop, use Settings -> Plugins -> Rescan.\n'
