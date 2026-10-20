import { walkSync } from "@nodelib/fs.walk";
import AdmZip from "adm-zip";
import { Buffer } from "node:buffer";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import type { IBoot } from "../src/types/boot.types.ts";
import { cryptoConfig } from "../config/crypto.ts";
import { name, version } from "../package.json";
import { addonPlugin } from "../src/addonPlugin";
import { dependenceInfo } from "../src/dependenceInfo";
import { encryptModuleZipFile } from "./encrypt.util.ts";

export async function createZip(_cwd: string, filename: string) {
  const scriptFileDir = new Set([
    "scriptFileList",
    "scriptFileList_earlyload",
    "scriptFileList_inject_early",
    "scriptFileList_preload",
  ]);
  const distDir = path.resolve(_cwd, "dist");
  const srcDir = path.resolve(_cwd, "src");
  const moduleZip = new AdmZip();
  const fileList = Object.fromEntries(readdirSync(distDir)
    .filter(item => scriptFileDir.has(item))
    .map((key) => {
      const scriptList = readdirSync(path.resolve(distDir, key)).filter(item => item.endsWith(".js")).map(_file => [key, _file].join("/"));
      if (scriptList.length > 0) {
        moduleZip.addLocalFolder(path.resolve(distDir, key), key);
      }
      return [
        key,
        scriptList,
      ];
    }));
  const result: IBoot = {
    name,
    version,
    ...fileList,
    ...getSourceFileList("additionFile", srcDir, moduleZip),
    ...getSourceFileList("styleFileList", srcDir, moduleZip),
    ...getSourceFileList("tweeFileList", srcDir, moduleZip),
    ...getSourceFileList("imgFileList", srcDir, moduleZip),
    ...getSourceFileList("replacePatchList", srcDir, moduleZip),
    ...getSourceFileList("additionBinaryFile", srcDir, moduleZip),
    addonPlugin,
    dependenceInfo,
  } as IBoot;
  result.imgFileList.push(...loadOriginImage(srcDir, moduleZip));
  moduleZip.addFile("boot.json", Buffer.from(JSON.stringify(result, null, 2), "utf8"));
  if (cryptoConfig.enabled) {
    const cryptoZip = new AdmZip();
    cryptoZip.addLocalFile(path.resolve(__dirname, "static/earlyload.js"));
    cryptoZip.addLocalFile(path.resolve(__dirname, "static/SimpleCryptWrapper.js"));
    cryptoZip.addFile(cryptoConfig.passwordHintFile, Buffer.from(cryptoConfig.passwordHint));
    const encryptModuleData = await encryptModuleZipFile(moduleZip.toBuffer(), cryptoConfig.password, filename);
    const cryptoBootFile = {
      name,
      version,
      ...getSourceFileList("additionFile", srcDir, cryptoZip),
      additionBinaryFile: [
        encryptModuleData.crypt.name,
        encryptModuleData.salt.name,
        encryptModuleData.nonce.name,
      ],
      additionFile: [],
      dependenceInfo: [
        {
          modName: "ModLoader",
          version: "^2.5.1",
        },
        {
          modName: "SweetAlert2Mod",
          version: "^1.0.0",
        },
      ],
      imgFileList: [],
      replacePatchList: [],
      scriptFileList: [],
      scriptFileList_earlyload: [
        "earlyload.js",
      ],
      scriptFileList_inject_early: [
        "SimpleCryptWrapper.js",
      ],
      scriptFileList_preload: [],
      styleFileList: [],
      tweeFileList: [],
    };
    (cryptoBootFile as any).additionFile.push(cryptoConfig.passwordHintFile);
    cryptoZip.addFile(encryptModuleData.crypt.name, Buffer.from(encryptModuleData.crypt.data));
    cryptoZip.addFile(encryptModuleData.salt.name, Buffer.from(encryptModuleData.salt.data));
    cryptoZip.addFile(encryptModuleData.nonce.name, Buffer.from(encryptModuleData.nonce.data));
    cryptoZip.addFile("boot.json", Buffer.from(JSON.stringify(cryptoBootFile, null, 2), "utf8"));
    return cryptoZip;
  }
  return moduleZip;
}

function getSourceFileList(filePath: string, srcDir: string, moduleZip: AdmZip) {
  const sourceFilePath = path.resolve(srcDir, filePath);
  if (!existsSync(sourceFilePath)) {
    return Object.fromEntries(
      [[
        filePath,
        [],
      ]],
    );
  }
  const sourceScriptList = readdirSync(sourceFilePath).filter(item => item !== ".gitkeep");
  if (sourceScriptList.length > 0) {
    moduleZip.addLocalFolder(sourceFilePath, filePath, (filename) => {
      return !filename.endsWith(".gitkeep");
    });
  }

  return Object.fromEntries([
    [
      filePath,
      walkSync(
        sourceFilePath,
        {
          basePath: filePath,
          pathSegmentSeparator: "/",
        },
      )
        .filter(item => item.name !== ".gitkeep" && item.dirent.isFile())
        .map(item => item.path),
    ],
  ]);
}

function loadOriginImage(srcDir: string, moduleZip: AdmZip) {
  const originImagePath = path.resolve(srcDir, "originImage");
  if (!existsSync(originImagePath)) {
    return [];
  }
  const originList = readdirSync(originImagePath)
    .filter(item => item !== ".gitkeep")
    .map(item => path.resolve(originImagePath, item));
  if (originList.length > 0) {
    for (const item of originList) {
      const itemStat = statSync(item);
      if (itemStat.isDirectory()) {
        moduleZip.addLocalFolder(item, path.relative(originImagePath, item));
      }
      else if (itemStat.isFile()) {
        moduleZip.addLocalFile(item);
      }
    }
    return walkSync(
      originImagePath,
      {
        basePath: "",
        pathSegmentSeparator: "/",
      },
    )
      .filter(item => item.name !== ".gitkeep" && item.dirent.isFile())
      .map(item => item.path);
  }
  return [];
}
