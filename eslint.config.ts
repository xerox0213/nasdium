import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Base
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,

  // Vue
  pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ["**/pages/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },

  // Prettier
  eslintConfigPrettier,
]);
