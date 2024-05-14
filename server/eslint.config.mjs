import globals from "globals";
import pluginJs from "@eslint/js";


// export default [
//   {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
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
  // pluginJs.configs.recommended,
];