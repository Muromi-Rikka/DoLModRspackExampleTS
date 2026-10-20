import { existsSync, mkdirSync } from "node:fs";
import { name, version } from "../package.json";
import { createZip } from "./zip.util.ts";

if (!existsSync("dist")) {
  mkdirSync("dist");
}

const filename = `${name}-${version}.mod.zip`;

const moduleZip = createZip(process.cwd(), filename);

void (async () => {
  const zip = await moduleZip;
  zip.writeZip(`./dist/${filename}`);
})();
