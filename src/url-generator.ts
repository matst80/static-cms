import {
  compressStaticFile,
  getStoragePathForUrlList,
  getStoragePathForUrlTree,
} from "./file-utils";
import { StorageProvider } from "./types/db-provider";
import { makeTree } from "./url-tree";

export const urlGeneratorFactory = (db: StorageProvider) => {
  db.listenForUrlChange(async (url) => {
    console.log(url, "changed");
    const urls = await db.getUrls();
    compressStaticFile(getStoragePathForUrlList(), urls, false);
    const tree = makeTree(
      urls.map(({ url, title }) => ({ url, title }))
    );
    
    if (tree) {
      compressStaticFile(getStoragePathForUrlTree(), tree, false);
    }
  });
};
