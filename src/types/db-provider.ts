import { Page, PageModule } from "slask-cms";

export type StorageProvider = {
  getId: () => string;
  emitUrlChange: (url: string) => Promise<unknown>;
  listenForUrlChange: (listener: (url: string) => Promise<unknown>) => void;
  getUrls: () => Promise<string[]>;
  saveModule: (module: PageModule) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
};
