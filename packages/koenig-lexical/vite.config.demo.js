import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vite';
import {resolve} from 'path';

// https://vitejs.dev/config/
export default (function viteDemoConfig() {
    return defineConfig({
        plugins: [
            svgr(),
            react()
        ],
        base: '/',
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
            commonjsOptions: {
                include: [/packages/, /node_modules/]
            },
            sourcemap: true,
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html')
                }
            }
        },
        test: {
            globals: true, // required for @testing-library/jest-dom extensions
            environment: 'jsdom',
            setupFiles: './test/test-setup.js',
            include: ['./test/unit/*'],
            testTimeout: 10000,
            ...(process.env.CI && { // https://github.com/vitest-dev/vitest/issues/1674
                minThreads: 1,
                maxThreads: 2
            })
        }
    });
});
