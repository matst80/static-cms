export type BaseData = { [key: string]: unknown };

export type Page = {
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  modules: PageModule[];
  created?: number;
  modified?: number;
  type?: string;
  teaser?: {
    image?: string;
    text?: Block;
    title?: string;
  };
  [key: string]: unknown;
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
  [key: string]: unknown;
};

export type Link = {
  href: string;
  caption?: string;
  title?: string;
};

export type ExternalPicture = BasePicture;
export type BasePicture = {
  size?: [width: number, height: number];
  src: string;
  responsiveViewType?: string;
  alt?: string;
  name: string;
};

export type InternalPicture = BasePicture & {
  uris: {
    media: string;
    srcset: string;
    sizes: string;
  }[];
};

export type Image = ExternalPicture | InternalPicture;

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

export type NodeAttribute = {
  name: string;
  value: unknown;
};

export type Block = Node & {
  name: string;
  children?: Node[];
  attributes?: NodeAttribute[];
};

export type Node = {
  _type: string;
  data?: string;
  links?: Link[];
  name?: unknown;
};
