import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginCypress from 'eslint-plugin-cypress';

export default [
    {
      files: ["**/*.js"],
      languageOptions: {
          globals: {
              ...globals.browser,
              ...globals.node,
              myCustomGlobal: "readonly"
          }
      },
      settings: { react: { version: "detect" } },
    },
    pluginReactConfig,
    pluginJs.configs.recommended,
    {
        files: ["cypress/**/*.js"],  // Targeting Cypress test files
        extends: ["plugin:cypress/recommended"]
    }
  ];