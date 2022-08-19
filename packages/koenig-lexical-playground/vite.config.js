import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [eslint(), svgr(), react()],
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
