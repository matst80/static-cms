export const Header = "header";
export const Settings = "settings";
export const Module = "module";
export const Page = "page";
export const Assets = "assets";
export const storageSections = [Header, Settings, Module, Assets, Page] as const;
export type StorageSections =
  | typeof Header
  | typeof Settings
  | typeof Module
  | typeof Assets
  | typeof Page;

