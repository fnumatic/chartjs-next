// @vitest-environment happy-dom
import { beforeAll, describe, it, expect } from 'vitest';
import type { App, PluginManifest } from 'obsidian';
import type ChartPlugin from './main';

let TestPlugin: typeof ChartPlugin;

describe('ChartPlugin', () => {
    beforeAll(async () => {
        const mod = await import('./main');
        TestPlugin = mod.default;
    });

    it('is instantiable', () => {
        const plugin = new TestPlugin({} as unknown as App, {} as unknown as PluginManifest);
        expect(plugin).toBeInstanceOf(TestPlugin);
    });

    it('exposes the plugin lifecycle methods', () => {
        const plugin = new TestPlugin({} as unknown as App, {} as unknown as PluginManifest);
        expect(typeof plugin.onload).toBe('function');
        expect(typeof plugin.onunload).toBe('function');
    });
});
