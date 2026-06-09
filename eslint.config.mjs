// eslint.config.js
import { defineConfig } from "eslint/config";

import jseslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import sortExports from "eslint-plugin-sort-exports";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    // Global ignores
    // DO NOT ADD OTHER KEYS HERE: ESLint's flat config will only treat this as a global ignore if there are no other keys here
    ignores: [],
  },
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    plugins: {
      import: importPlugin,
      "sort-exports": sortExports,
      "unused-imports": unusedImports,
    },
    rules: {
      ...importPlugin.configs.typescript.rules,
      semi: "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
]);
