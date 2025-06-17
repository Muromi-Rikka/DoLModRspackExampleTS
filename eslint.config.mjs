import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    semi: true,
    quotes: "double",
  },
  jsonc: true,
  ignores: ["./utils/static/*.js"],
}, {
  files: ["**/*.ts"],
  rules: {
    "no-console": "off",
  },
});
