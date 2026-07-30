import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },

  // Jest test files
  {
    files: ["tests/**/*.js"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];