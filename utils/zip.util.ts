import { Buffer } from "node:buffer";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import * as AdmZip from "adm-zip";
import { name, version } from "../package.json";
import { addonPlugin } from "../src/addonPlugin";
import { dependenceInfo } from "../src/dependenceInfo";

function getSrcFileList(filePath: string, srcDir: string, modZip: AdmZip) {
  const srcFilePath = resolve(srcDir, filePath);
  if (!existsSync(srcFilePath)) {
    return Object.fromEntries(
      [[
        filePath,
        [],
      ]],
    );
  }
  const srcScriptList = readdirSync(srcFilePath).filter(item => item !== ".gitignore");
  if (srcScriptList.length) {
    modZip.addLocalFolder(srcFilePath, filePath, (filename) => {
      return !filename.endsWith(".gitignore");
    });
  }
  return Object.fromEntries(
    [[
      filePath,
      srcScriptList
        .map(item => [filePath, item].join("/")),
    ]],
  );
}
export function createZip(_cwd: string) {
  const scriptFileDir = new Set([
    "scriptFileList_earlyload",
    "scriptFileList_inject_early",
    "scriptFileList_preload",
    "scriptFileList",
  ]);
  const distDir = resolve(_cwd, "dist");
  const srcDir = resolve(_cwd, "src");
  const modZip = new AdmZip();
  const fileList = Object.fromEntries(readdirSync(distDir)
    .filter(item => scriptFileDir.has(item))
    .map((key) => {
      const scriptList = readdirSync(resolve(distDir, key)).filter(item => item.endsWith(".js")).map(_file => [key, _file].join("/"));
      if (scriptList.length) {
        modZip.addLocalFolder(resolve(distDir, key), key);
      }
      return [
        key,
        scriptList,
      ];
    }));
  const result = {
    name,
    version,
    ...fileList,
    ...getSrcFileList("additionFile", srcDir, modZip),
    ...getSrcFileList("styleFileList", srcDir, modZip),
    ...getSrcFileList("tweeFileList", srcDir, modZip),
    ...getSrcFileList("imgFileList", srcDir, modZip),
    ...getSrcFileList("replacePatchList", srcDir, modZip),
    ...getSrcFileList("additionBinaryFile", srcDir, modZip),
    addonPlugin,
    dependenceInfo,
  };
  modZip.addFile("boot.json", Buffer.from(JSON.stringify(result, null, 2), "utf-8"));
  return modZip;
}