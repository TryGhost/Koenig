import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import ghostPlugin from 'eslint-plugin-ghost';

export default tseslint.config([
    {ignores: ['dist/**', 'build/**', '.storybook/**']},
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest']
        ],
        plugins: {
            'react-refresh': reactRefresh,
            ghost: ghostPlugin
        },
        languageOptions: {
            parserOptions: {projectService: true, tsconfigRootDir: import.meta.dirname}
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }]
        }
    },
    {
        files: ['**/*.stories.{ts,tsx}'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off'
        }
    },
    {
        files: ['test/**/*.ts', 'test/**/*.tsx'],
        rules: {
            ...ghostPlugin.configs['ts-test'].rules,
            'ghost/mocha/no-global-tests': 'off',
            'ghost/mocha/handle-done-callback': 'off',
            'ghost/mocha/no-mocha-arrows': 'off',
            'ghost/mocha/max-top-level-suites': 'off'
        }
    }
]);
