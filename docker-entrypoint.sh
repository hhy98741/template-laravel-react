#!/bin/bash
set -e

# Clear configurations to avoid caching issues in development
echo "Clearing configurations..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Ensure PulseAudio is available then set the volume of audio playback
if command -v pactl >/dev/null 2>&1; then
    pactl set-sink-volume @DEFAULT_SINK@ 67%
fi

# Execute the original command
exec "$@"