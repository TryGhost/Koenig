import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr(),
        cssInjectedByJs({styleId: 'koenig-lexical-style'}),
        react()
    ],
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    },
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/lib/index.js'),
            name: 'KoenigLexical',
            fileName(format) {
                if (format === 'umd') {
                    return 'koenig-lexical.umd.js';
                }

                return 'koenig-lexical.js';
            }
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
});
