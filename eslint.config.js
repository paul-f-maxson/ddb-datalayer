import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import ts from "@typescript-eslint/eslint-plugin"
import functional from "eslint-plugin-functional"
import eslintConfigPrettier from "eslint-config-prettier"
import imprt from "eslint-plugin-import"

const ignores = [".yarn/**/*", ".pnp.*"]

export default [
  { ...js.configs.recommended, ignores },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      functional,
      import: imprt,
      "@typescript-eslint": ts,
      ts,
    },
    rules: {
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs["recommended"].rules,

      "ts/return-await": 2,
    },
  },
  { ...eslintConfigPrettier, ignores },
]
