import type { RspackOptions } from "@rspack/core";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { name, version } from "./package.json";
import { createZip } from "./utils/zip.util.ts";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];
const scriptFileDir = new Set([
  "scriptFileList",
  "scriptFileList_earlyload",
  "scriptFileList_inject_early",
  "scriptFileList_preload",
]);

function commonConfig(): RspackOptions {
  return {
    devtool: "inline-source-map",
    entry() {
      const entryDir = readdirSync("./src").filter(item => scriptFileDir.has(item));

      return Object.fromEntries(entryDir.flatMap(item =>
        readdirSync(path.resolve("./src", item))
          .filter(item => item.endsWith(".ts"))
          .map(_file => [
            path.join(item, path.parse(_file).name).replaceAll("\\", "/"),
            `./${path.join("./src", item, _file).replaceAll("\\", "/")}`,
          ]),
      ));
    },
    experiments: {
      css: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: "builtin:swc-loader",
              options: {
                env: { targets },
                jsc: {
                  parser: {
                    syntax: "ecmascript",
                  },
                },
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
                env: { targets },
                jsc: {
                  parser: {
                    syntax: "typescript",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: false,
    },
    output: {
      clean: true,
    },
    plugins: [

    ],
    resolve: {
      extensions: [".ts", ".js"],
    },
  };
}
function developmentServer() {
  if (existsSync("./game/index.html")) {
    return {
      devServer: {
        hot: false,
        liveReload: false,
        port: 5678,
        setupMiddlewares: (middlewares, developmentServer_) => {
          if (!developmentServer_) {
            throw new Error("@rspack/dev-server is not defined");
          }
          developmentServer_.app?.get("/modList.json", (_: never, response: any) => {
            console.log("get mod list");
            if (existsSync("./game/mods")) {
              const moduleList = readdirSync("./game/mods/").filter(item => item.endsWith(".zip")).map(item => `/mods/${item}`);
              response.send(JSON.stringify([
                ...moduleList,
                `/${name}-${version}.mod.zip`,
              ]));
            }
            else {
              response.send(JSON.stringify([
                `/${name}-${version}.mod.zip`,
              ]));
            }
          });
          const filename = `${name}-${version}.mod.zip`;

          developmentServer_.app?.get(`/${filename}`, (_: never, response: any) => {
            rspack(commonConfig(), async (_error, _stats) => {
              const zip = await createZip(process.cwd(), filename);
              response.send(zip.toBuffer());
            });
          });
          return middlewares;
        },
        static: "game",
      },
    } as RspackOptions;
  }
  return {};
}
export default defineConfig({
  ...commonConfig(),
  ...developmentServer(),
});
