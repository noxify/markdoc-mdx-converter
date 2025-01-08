/// <reference types="./types/eslint.d.ts" />

import * as path from "node:path"
import { includeIgnoreFile } from "@eslint/compat"
import eslint from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import packageJson from "eslint-plugin-package-json/configs/recommended"
import tseslint from "typescript-eslint"

export default tseslint.config(
  // Ignore files not tracked by VCS and any config files
  includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),
  {
    // Globally ignored files
    ignores: ["**/*.config.*"],
  },
  {
    ...packageJson,
    rules: {
      ...packageJson.rules,
      "package-json/valid-package-def": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      "no-console": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [2, { checksVoidReturn: { attributes: false } }],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "@typescript-eslint/only-throw-error": "off",
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { project: true } },
  },
)
