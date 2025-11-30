#!/bin/bash
set -e

# Fix permissions on mounted volumes (runs as root initially)
if [ -d /var/lib/dotmac ]; then
    chown -R appuser:appuser /var/lib/dotmac 2>/dev/null || true
fi

# If running as root, switch to appuser
if [ "$(id -u)" = "0" ]; then
    exec gosu appuser "$@"
fi

# If not root, just execute the command
exec "$@"
