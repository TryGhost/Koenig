import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr(),
        cssInjectedByJs({styleId: 'koenig-lexical-style'}),
        react()
    ],
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/lib/index.js'),
            name: 'KoenigLexical',
            fileName: 'koenig-lexical'
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
