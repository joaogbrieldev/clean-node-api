module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js", "*.json"],
  rules: {
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
      },
      {
        selector: "variable",
        modifiers: ["const"],
        format: ["camelCase", "UPPER_CASE"],
      },
      {
        selector: "variable",
        modifiers: ["const"],
        format: ["PascalCase"],
        filter: {
          regex: "Provider$",
          match: true,
        },
      },
      {
        selector: "variable",
        modifiers: ["const"],
        format: ["PascalCase"],
        filter: {
          regex: "Schema$",
          match: true,
        },
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
      {
        selector: "enum",
        format: ["PascalCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "typeParameter",
        format: ["PascalCase"],
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "variableLike",
        format: ["camelCase"],
      },
    ],
    "@typescript-eslint/typedef": [
      "error",
      {
        arrayDestructuring: false,
        arrowParameter: false,
        memberVariableDeclaration: true,
        objectDestructuring: false,
        parameter: true,
        propertyDeclaration: true,
        variableDeclaration: false,
        variableDeclarationIgnoreFunction: false,
      },
    ],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "import", next: "*" },
      { blankLine: "any", prev: "import", next: "import" },
    ],
    "lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
      },
    ],
  },
};
