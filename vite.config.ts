import { defineConfig } from 'vite';
import { resolve } from 'path';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, 'src'),
        },
        conditions: ['browser', 'default'],
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            formats: ['cjs'],
            fileName: () => 'main.js',
            cssFileName: 'styles',
        },
        minify: 'esbuild',
        rollupOptions: {
            external: ['obsidian', 'electron', 'moment', ...builtinModules],
            output: {
                entryFileNames: 'main.js',
                codeSplitting: false,
                exports: 'named',
            },
        },
        target: 'esnext',
        sourcemap: false,
        emptyOutDir: true,
    },
});
