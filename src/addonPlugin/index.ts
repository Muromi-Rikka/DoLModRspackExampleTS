import type { ModBootJsonAddonPlugin } from "./types.ts";
import { TweeReplacer } from "./twee-replacer.ts";

export const addonPlugin: ModBootJsonAddonPlugin[] = [
  TweeReplacer,
];
