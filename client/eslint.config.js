import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import';


export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // doesn't require such extensions at the end of import
        },
        alias: {
          map: [
            ['', './public'], 
            ['@pages', './src/pages'],
            ['@features', './src/features'],
            ['@shared', './src/shared'],
            ['@routes', './src/routes'],
            ['src', './src'], 
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,

      import: importPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      ...stylistic.configs['recommended-extends'].rules,

      'import/order':  [1, {  
          'groups': [ 'external', 'builtin', 'internal', 'sibling', 'parent', 'index' ], 
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        } 
      ],
    },
  },
)
