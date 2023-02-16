import {
  compressStaticFile,
  getStoragePathForUrlList,
  getStoragePathFromModule,
} from "./file-utils";
import { StorageProvider } from "./types/db-provider";

export const urlGeneratorFactory = (db: StorageProvider) => {
  db.listenForUrlChange(async (url) => {
    console.log(url, "changed");
    const urls = await db.getUrls();
    compressStaticFile(getStoragePathForUrlList(), urls.sort(), false);
  });
};
