#!/bin/bash
set -e

alias cld='claude --continue'
alias cldyolo='claude --dangerously-skip-permissions'

# Clear configurations to avoid caching issues in development
echo "Clearing configurations..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Execute the original command
exec "$@"