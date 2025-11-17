import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: false,
  allConfig: false,
});

const config = [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'camuverse-web/**',
      'src/camuverse-app/**',
      'tmp_Camuverse_repo/**',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
];

export default config;
