import { PageModule } from "./page-and-components";
import { StorageSections } from "./storage";

export type StorageProvider = {
  getId: (module: StorageSections) => Promise<string>;
  emitChange: (url: string) => Promise<number>;
  saveModule: (module: PageModule) => Promise<void>;
};
