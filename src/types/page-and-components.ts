export type Page = {
  id: string;
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  modules: PageModule[];
};

export type PageModule = {
  type: string;
  id: string;
  links?: Link[];
  pictures?: Picture[];
  settings: Settings;
  modules?: PageModule[];
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
