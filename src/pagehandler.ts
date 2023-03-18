import { unlink } from "fs/promises";
import { Page } from "slask-cms";
import { getPagesInDirectory, getVariants } from "./file-utils";
import { pageFactory } from "./page";
import { StorageProvider } from "./types/db-provider";
import { SearchProvider } from "./types/search-provider";
import { SectionHandler } from "./types/server";

const sanitizePage = (page: Partial<Page>, url: string): Page => {
  return {
    ...page,
    url,
    modules: page.modules ?? [],
  } as Page;
};

export const pageHandlerFactory = (
  db: StorageProvider,
  search: SearchProvider
): SectionHandler => {
  const { storePages, updatePage } = pageFactory(db);

  const appendMetadata = (urls: string[]) =>
    Promise.all(urls.map((url) => db.getMetadata(url)));

  return async ({ method, body, fileStatus, path }) => {
    switch (method) {
      case "GET": {
        if (path.endsWith("_urls")) {
          return getPagesInDirectory(path).then(appendMetadata);
        }
        return [];
      }
      case "DELETE": {
        const { exists, filePath } = await fileStatus;
        if (exists) {
          await getVariants(filePath).map(unlink);

          return { filePath, deleted: true };
        }
        return;
      }
      case "POST": {
        const page = sanitizePage(await body(), path);
        await search.indexPage(page);
        return await storePages(page);
      }
      case "PUT": {
        const page = sanitizePage(await body(), path);

        const { exists } = await fileStatus;
        if (exists) {
          await search.indexPage(page);
          return await updatePage(page);
        }
        return { notFound: path };
      }
    }
  };
};
