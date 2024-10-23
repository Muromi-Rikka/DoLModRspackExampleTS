import { name, version } from "../package.json";
import { createZip } from "./zip.util.ts";

// eslint-disable-next-line node/prefer-global/process
const modZip = createZip(process.cwd());

modZip.writeZip(`./dist/${name}-${version}.mod.zip`);
