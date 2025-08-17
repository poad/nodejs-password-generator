// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

import pluginPromise from 'eslint-plugin-promise'

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, './.gitignore');

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  {
    ignores: ['dist/'],
  },
  eslint.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    files: ['bin/**/*.ts','lib/**/*.ts'],
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/js': stylistic,
      '@stylistic/ts': stylistic,
    },
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single'],
    }
  },
);
