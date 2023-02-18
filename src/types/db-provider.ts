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
  getPage:(url:string)=>Promise<Page|undefined>
};
