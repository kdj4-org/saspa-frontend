module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  rules: {
    "linebreak-style": ["error", "windows"],
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
