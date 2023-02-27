import { Page, PageModule } from "slask-cms";

type UrlData = {
  url: string;
  title: string;
  modified?: number;
};

export type StorageProvider = {
  getId: () => string;
  emitUrlChange: (data: UrlData) => Promise<unknown>;
  listenForUrlChange: (listener: (data: UrlData) => Promise<unknown>) => void;
  getUrls: () => Promise<UrlData[]>;
  saveModule: (module: PageModule) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
  getMetadata: (url: string) => Promise<UrlData | undefined>;
  getPage: (url: string) => Promise<Page | undefined>;
};
