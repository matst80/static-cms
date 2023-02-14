import { compressStaticFile, getStoragePathFromPage } from "./file-utils";
import { Page } from "./types/page-and-components";

export const storePages = async (...pages: Page[]) =>
  Promise.all(
    pages.map((page) =>
      getStoragePathFromPage(page).then((path) =>
        compressStaticFile(path, page, true)
      )
    )
  );
