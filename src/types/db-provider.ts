import { StorageSections } from "./storage";

export type StorageProvider = {
  getId: (module: StorageSections) => Promise<string>;
};
