// eslint.config.js
import { defineConfig } from "eslint/config"

import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    // Global ignores
    // DO NOT ADD OTHER KEYS HERE: ESLint's flat config will only treat this as a global ignore if there are no other keys here
    ignores: [],
  },
  eslint.configs.recommended,
  tseslint.config.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
])
