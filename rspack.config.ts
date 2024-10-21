import { readdirSync } from "node:fs";
import { join, parse, resolve } from "node:path";
import { defineConfig } from "@rspack/cli";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];
const scriptFileDir = new Set([
  "scriptFileList_earlyload",
  "scriptFileList_inject_early",
  "scriptFileList_preload",
  "scriptFileList",
]);
export default defineConfig({
  entry() {
    const entryDir = readdirSync("./src").filter(item => scriptFileDir.has(item));

    return Object.fromEntries(entryDir.flatMap(item =>
      readdirSync(resolve("./src", item))
        .filter(item => item.endsWith(".ts"))
        .map(_file => [
          join(item, parse(_file).name).replaceAll("\\", "/"),
          `./${join("./src", item, _file).replaceAll("\\", "/")}`,
        ]),
    ));
  },
  output: {
    clean: true,
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "ecmascript",
                },
              },
              env: { targets },
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                },
              },
              env: { targets },
            },
          },
        ],
      },
    ],
  },
  plugins: [],
  optimization: {
    minimize: false,
    // minimizer: [
    //   new rspack.SwcJsMinimizerRspackPlugin(),
    //   new rspack.LightningCssMinimizerRspackPlugin({
    //     minimizerOptions: { targets },
    //   }),
    // ],
  },
  devtool: "inline-source-map",
  experiments: {
    css: true,
  },
});
