export type BaseData = { [key: string]: unknown };

export type Page = {
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  modules: PageModule[];
  created?: number;
  modified?: number;
};

export type AssetFile = {
  name: string;
  type: string;
  mtime: string;
  size: number;
};

export type PageModuleWithProps<
  T extends Record<string, unknown>,
  TSettings extends Settings = Settings
> = {
  type: string;
  id?: string;
  props?: T;
  links?: Link[];
  images?: Image[];
  settings: TSettings;
  modules?: PageModule[];
};

export type PageModule = PageModuleWithProps<Record<string, unknown>>;

export type Settings = {
  validTo?: number;
  validFrom?: number;
};

export type Link = {
  href: string;
  caption?: string;
  title?: string;
};

export type Image = {
  src: string;
  title: string;
};

export type ModuleProps<
  TProps extends Record<string, unknown>,
  TSettings extends Record<string, unknown> = Record<string, unknown>
> = TProps & {
  type: string;
  settings: Settings & TSettings;
  links?: Link[];
  images?: Image[];
  modules?: PageModule[];
};
