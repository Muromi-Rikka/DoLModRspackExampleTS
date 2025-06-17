import { existsSync, mkdirSync } from "node:fs";
import { name, version } from "../package.json";
import { createZip } from "./zip.util.ts";

if (!existsSync("dist")) {
  mkdirSync("dist");
}

const filename = `${name}-${version}.mod.zip`;
// eslint-disable-next-line node/prefer-global/process
const modZip = createZip(process.cwd(), filename);

modZip.then((zip) => {
  zip.writeZip(`./dist/${filename}`);
});
