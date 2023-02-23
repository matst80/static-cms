import { Page, PageModule } from "slask-cms";

type UrlData = {
  url: string;
  title: string;
};

export type StorageProvider = {
  getId: () => string;
  emitUrlChange: (data: UrlData) => Promise<unknown>;
  listenForUrlChange: (listener: (data: UrlData) => Promise<unknown>) => void;
  getUrls: () => Promise<UrlData[]>;
  saveModule: (module: PageModule) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
  getTitle: (url: string) => Promise<string | undefined>;
  getPage: (url: string) => Promise<Page | undefined>;
};
