export type Page = {
  id: string;
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  modules: Module[];
};

export type Module = {
  type: string;
  id: string;
  links?: Link[];
  pictures?: Picture[];
  settings: Settings;
  modules?: Module[];
};

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
