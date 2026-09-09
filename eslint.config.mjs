import { renton } from "@renton/eslint-config";

export default renton({
  stylistic: {
    quotes: "double",
    semi: true,
  },
  typescript: true,
  jsonc: true,
  yaml: true,
  markdown: true,
  test: true,
  formatters: {
    markdown: "prettier",
  },
}, {
  ignores: [".superpowers/**"],
  rules: {
    "pnpm/yaml-enforce-settings": "off",
    "unicorn/filename-case": "off",
  },
});
