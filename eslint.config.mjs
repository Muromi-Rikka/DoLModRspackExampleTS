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
    "unicorn/filename-case": "off", // src/scriptFileList_preload 等目录名由 DoL 加载器约定固定
    "unicorn/name-replacements": "off", // Dir→Direction、util→utility 属误报（rspack.config.ts / utils/zip.util.ts）
  },
});
