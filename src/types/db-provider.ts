import { Page, PageModule } from "./page-and-components";

export type StorageProvider = {
  getId: () => string;
  emitUrlChange: (url: string) => Promise<unknown>;
  listenForUrlChange: (listener: (url: string) => Promise<unknown>) => void;
  getUrls: () => Promise<string[]>;
  saveModule: (module: PageModule) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
};
