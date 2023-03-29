module.exports = {
  extends: ["airbnb", "airbnb-typescript"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    project: ["./tsconfig.json"],
  },
};
