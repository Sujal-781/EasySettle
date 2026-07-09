import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'

export default defineConfig({
  overrides: [
    {
      files: ['**/*.{js,jsx}'],
      extends: [
        js.configs.recommended,
        reactHooks.configs.flat.recommended,
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        globals: globals.browser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          parser: '@babel/eslint-parser', // Using Babel parser for compatibility with modern JavaScript features
        },
      },
    },
  ],
  ignorePatterns: ['dist'], // Replaced globalIgnores with ignorePatterns
})