import 'eslint-plugin-only-warn';

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import perfectionist from 'eslint-plugin-perfectionist';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import wixEditor from 'eslint-plugin-wix-editor';
import { fixupPluginRules } from '@eslint/compat';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    ignores: [
      'dist/',
      'coverage/',
      '@generated/**',
      '*.config.[cm]js',
      '.*rc.js',
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: false,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'max-lines': [1, { max: 300 }],
      'max-params': [1, { max: 5 }],
      'no-unneeded-ternary': [1],
    },
  },
  {
    plugins: {
      'wix-editor': fixupPluginRules(wixEditor),
    },
    rules: {
      'wix-editor/no-instanceof-array': 1,
      'wix-editor/no-not-not': 1,
      'wix-editor/no-unneeded-match': 1,
      'wix-editor/prefer-filter': 1,
      'wix-editor/prefer-ternary': 1,
      'wix-editor/return-boolean': 1,
      'wix-editor/simplify-boolean-expression': 1,
    },
  },
  {
    ...unicorn.configs.recommended,
    rules: {
      'unicorn/prevent-abbreviations': [
        'warn',
        {
          replacements: {
            args: false,
          },
        },
      ],
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-objects': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
        },
      ],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    rules: {
      'consistent-return': 0,
      'max-lines': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-floating-promises': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/camelcase': 0,
      'import/max-dependencies': 0,
    },
  },
];
