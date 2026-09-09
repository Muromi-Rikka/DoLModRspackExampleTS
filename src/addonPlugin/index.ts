import type { ModBootJsonAddonPlugin as ModuleBootJsonAddonPlugin } from "../types/boot.types.ts";
import { TweeReplacer } from "./twee-replacer.ts";

export const addonPlugin: ModuleBootJsonAddonPlugin[] = [
  TweeReplacer,
];
