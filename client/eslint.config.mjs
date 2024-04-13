import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


// export default [
//   {
//     languageOptions: { globals: globals.browser }},
//     pluginJs.configs.recommended,
//     pluginReactConfig,
// ];

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
    },
    pluginReactConfig,
    pluginJs.configs.recommended,
  ];