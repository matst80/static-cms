import { Page, PageModule } from "./page-and-components";

export type StorageProvider = {
  getId: () => string;
  emitChange: (url: string) => Promise<number>;
  saveModule: (module: PageModule) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
};
