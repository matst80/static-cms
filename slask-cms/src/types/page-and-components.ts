export type BaseData = { [key: string]: unknown };

export type Page = {
  id: string;
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  modules: PageModule[];
  created?: number;
  modified?: number;
};

export type PageModuleWithProps<T extends Record<string,unknown>, TSettings extends Settings = Settings> = {
    type: string;
    id?: string;
    props?: T
    links?: Link[];
    pictures?: Picture[];
    settings: TSettings;
    modules?: PageModule[];
}

export type PageModule = PageModuleWithProps<Record<string,unknown>>;

export type Settings = {
  validTo?: number;
  validFrom?: number;
};

export type Link = {
  href: string;
  caption?: string;
  title?: string;
};

export type Picture = {
  src: string;
};

export type ModuleProps<
  TProps extends Record<string, unknown>,
  TSettings extends Settings = Settings
> = TProps & {
  settings: TSettings;
  modules?: PageModule[];
};
