module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  plugins: ["@typescript-eslint/eslint-plugin", "eslint-plugin-tsdoc"],
  extends: ["plugin:@typescript-eslint/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    curly: ["error", "all"],
    semi: ["warn", "always"],
    "@typescript-eslint/semi": ["warn", "always"],
    quotes: "off",
    "@typescript-eslint/quotes": ["warn", "double"],
    "tsdoc/syntax": "warn",
    // Note: you must disable the base rule as it can report incorrect errors
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": ["off", "only-multiline"],
    "no-var-requires": "off",
  },
};
