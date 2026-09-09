export interface DependenceInfo {
  modName: string;
  version: string;
}

export interface IBoot {
  additionBinaryFile: any[];
  additionFile: string[];
  addonPlugin: ModuleBootJsonAddonPlugin[];
  dependenceInfo: DependenceInfo[];
  imgFileList: string[];
  name: string;
  replacePatchList: any[];
  scriptFileList: string[];
  scriptFileList_earlyload: string[];
  scriptFileList_inject_early: string[];
  scriptFileList_preload: string[];
  styleFileList: any[];
  tweeFileList: any[];
  version: string;
}

export interface ModuleBootJsonAddonPlugin {
  addonName: string;
  modName: string;
  modVersion: string;
  params?: any[] | { [key: string]: any };
}
