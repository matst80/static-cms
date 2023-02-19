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

export type PageModuleWithProps<T extends object> = {
    type: string;
    id?: string;
    props?: T
    links?: Link[];
    pictures?: Picture[];
    settings: Settings;
    modules?: PageModule[];
}

export type PageModule = PageModuleWithProps<Record<string,unknown>>;

export type Settings = {
  validTo?: number;
  validFrom?: number;
  [key: string]: unknown;
};

export type Link = {
  href: string;
  caption?: string;
  title?: string;
};

export type Picture = {
  src: string;
};
