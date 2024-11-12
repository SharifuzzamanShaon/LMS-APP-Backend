import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
export default [
  {
    // Language options including global variables and environments
    languageOptions: {
      globals: {
        ...globals.browser,
        require: "readonly", // Define `require` as a global variable
        module: "readonly", // Define `module` as a global variable
        exports: "readonly", // Define `exports` as a global variable
        Buffer: "readonly",
      }, // Adding browser globals
      ecmaVersion: "latest", // Specifying the ECMAScript version
      sourceType: "module", // Setting the source type as module
    },
  },
  // Including recommended settings from the pluginJs package
  pluginJs.configs.recommended,
  {
    // Custom rules can be added here
    extends: ["prettier"],
    rules: {
      // "no-console": "warn", // Warns on console statements
      "no-unused-vars": "warn", // Warns on unused variables
      "eqeqeq": ["error", "always"], // Enforces strict equality checks
      "no-multi-spaces": "error", // Disallows multiple spaces
      "no-trailing-spaces": "error", // Disallows trailing whitespace
      "space-before-function-paren": ["error", "never"], // No space before function parentheses
      "space-in-parens": ["error", "never"], // No space inside parentheses
      "space-infix-ops": "error", // Requires spaces around infix operators
      "prettier/prettier": ["error", { "endOfLine": "auto" }],   // Integrate Prettier for formatting
    },
    plugins: ["prettier"],
  },
];
