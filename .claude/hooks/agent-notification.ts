#!/usr/bin/env bun

/**
 * Plays a random audio notification for the given agent when it stops.
 * Looks for audio files in the dev-hooks plugin (any installed version).
 * Fails silently if bun, the plugin, or the audio player is unavailable.
 *
 * Usage: bun .claude/hooks/agent-notification.ts --agent=coder
 */

import { readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

async function main(): Promise<void> {
    if (process.env.SKIP_HOOKS) process.exit(0);

    try {
        const args = process.argv.slice(2);
        const agentName = args
            .find((a) => a.startsWith('--agent='))
            ?.split('=')[1];

        if (!agentName) process.exit(0);

        // Dynamically find the latest installed version of the dev-hooks plugin
        const pluginBase = join(
            homedir(),
            '.claude',
            'plugins',
            'cache',
            'personal-plugins',
            'dev-hooks',
        );

        let versions: string[];
        try {
            versions = readdirSync(pluginBase).sort();
        } catch {
            process.exit(0);
        }

        if (versions.length === 0) process.exit(0);

        const latestVersion = versions[versions.length - 1];
        const audioDir = join(
            pluginBase,
            latestVersion,
            'hooks',
            'utils',
            'notification',
            'audio-files',
        );

        // Find audio files matching the agent name (e.g. coder-01.mp3 ... coder-15.mp3)
        let files: string[];
        try {
            files = readdirSync(audioDir).filter(
                (f) => f.startsWith(`${agentName}-`) && f.endsWith('.mp3'),
            );
        } catch {
            process.exit(0);
        }

        if (files.length === 0) process.exit(0);

        const file = files[Math.floor(Math.random() * files.length)];
        const filePath = join(audioDir, file);

        const platform = process.platform;
        if (platform === 'darwin') {
            Bun.spawn(['afplay', '-v', '0.5', filePath]);
        } else if (platform === 'linux') {
            Bun.spawn(['paplay', filePath]);
        } else if (platform === 'win32') {
            Bun.spawn([
                'powershell',
                '-c',
                `(New-Object Media.SoundPlayer '${filePath}').PlaySync();`,
            ]);
        }
    } catch {
        // Fail silently
    }
}

main();
