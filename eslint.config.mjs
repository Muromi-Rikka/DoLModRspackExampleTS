import { renton } from "@renton/eslint-config";

export default renton({
  formatters: {
    markdown: "prettier",
  },
  jsonc: true,
  markdown: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },
  test: true,
  typescript: true,
  yaml: true,
}, {
  ignores: [".superpowers/**", "utils/static/**"],
}, {
  rules: {
    "pnpm/yaml-enforce-settings": "off",
    "unicorn/filename-case": "off",
    "unicorn/name-replacements": "off",
  },
});
