import pkg from './package.json';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vitest/config';
import {resolve} from 'path';
import {sentryVitePlugin} from '@sentry/vite-plugin';

const outputFileName = pkg.name[0] === '@' ? pkg.name.slice(pkg.name.indexOf('/') + 1) : pkg.name;

// https://vitejs.dev/config/
export default (function viteConfig() {
    return defineConfig({
        plugins: [
            svgr(),
            react(),

            // Keep sentryVitePlugin as the last plugin
            // TODO: move config values to env vars
            sentryVitePlugin({
                org: 'ghost-foundation',
                project: 'admin',

                // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
                // and need `project:releases` and `org:read` scopes
                authToken: '3878a3c19aee426b805905bba42d46c74a2e0513901345f587fcfbc628587d0e'
            })
        ],
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.VITEST_SEGFAULT_RETRY': 3,
            __APP_VERSION__: JSON.stringify(pkg.version)
        },
        resolve: {
            alias: {
                // required to prevent double-bundling of yjs due to cjs/esm mismatch
                // (see https://github.com/facebook/lexical/issues/2153)
                yjs: resolve('../../node_modules/yjs/src/index.js')
            }
        },
        optimizeDeps: {
            include: [
                '@tryghost/kg-clean-basic-html',
                '@tryghost/kg-markdown-html-renderer',
                '@tryghost/kg-simplemde'
            ]
        },
        build: {
            minify: true,
            sourcemap: true,
            cssCodeSplit: true,
            lib: {
                entry: resolve(__dirname, 'src/index.js'),
                name: pkg.name,
                fileName(format) {
                    if (format === 'umd') {
                        return `${outputFileName}.umd.js`;
                    }

                    return `${outputFileName}.js`;
                }
            },
            rollupOptions: {
                external: [
                    'react',
                    'react-dom',
                    '@tryghost/kg-markdown-html-renderer',
                    '@tryghost/kg-simplemde',
                    '@tryghost/kg-clean-basic-html'
                ],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM'
                    }
                }
            },
            commonjsOptions: {
                include: [/packages/, /node_modules/]
            }
        },
        test: {
            globals: true, // required for @testing-library/jest-dom extensions
            environment: 'jsdom',
            setupFiles: './test/test-setup.js',
            include: ['./test/unit/*'],
            testTimeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 10000,
            ...(process.env.CI && { // https://github.com/vitest-dev/vitest/issues/1674
                minThreads: 1,
                maxThreads: 2
            })
        }
    });
});
