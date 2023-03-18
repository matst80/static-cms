export const Header = "header";
export const Settings = "settings";
export const Module = "module";
export const Page = "page";
export const Assets = "assets";
export const Translations = "translations";
export const storageSections = [
  Header,
  Settings,
  Module,
  Assets,
  Page,
  Translations,
] as const;
export type StorageSections =
  | typeof Header
  | typeof Settings
  | typeof Module
  | typeof Assets
  | typeof Translations
  | typeof Page;
