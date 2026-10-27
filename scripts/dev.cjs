#!/usr/bin/env node

const path = require('path');
const { build } = require('vite');
const {
    findObsidianVaults,
    loadVaultPath,
    saveVaultPath,
    promptUser,
    copyPluginToVault,
    getPluginId,
} = require('./utils.cjs');

// Plugin id from manifest.json (used by Obsidian as the plugin folder name)
const pluginName = getPluginId();
const useSavedVault = process.argv.includes('--default');

async function main() {
    const formerVault = loadVaultPath();
    let vaultPath;

    if (useSavedVault) {
        vaultPath = formerVault;
        if (!vaultPath) {
            const vaults = findObsidianVaults();
            if (vaults.length === 0) {
                console.error('❌ No Obsidian vaults found.');
                process.exit(1);
            }
            vaultPath = vaults[0];
            console.log(`Using default vault: ${vaultPath}`);
        } else {
            console.log(`Using saved vault: ${vaultPath}`);
        }
    } else {
        console.log('🔍 Scanning for Obsidian vaults...');

        const vaults = findObsidianVaults();

        if (vaults.length === 0) {
            console.log(
                '❌ No Obsidian vaults found. Please make sure you have Obsidian installed and have opened at least one vault.',
            );
            process.exit(1);
        }

        console.log(`✅ Found ${vaults.length} vault(s):`);

        vaultPath = await promptUser('Select a vault to copy the plugin to:', vaults, formerVault);
        saveVaultPath(vaultPath);
    }

    console.log(`Starting dev server with vault: ${vaultPath}`);

    try {
        await build({
            configFile: path.join(__dirname, '..', 'vite.config.ts'),
            mode: 'development',
            build: {
                watch: {},
                sourcemap: 'inline',
            },
            plugins: [
                {
                    name: 'copy-to-vault',
                    writeBundle() {
                        copyPluginToVault(vaultPath, pluginName);
                    },
                },
            ],
        });
    } catch (error) {
        console.error('Build error:', error);
        process.exit(1);
    }
}

main().catch(console.error);
