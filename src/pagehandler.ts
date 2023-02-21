import { readdir, unlink } from "fs/promises";
import { getPagesInDirectory, getVariants } from "./file-utils";
import { pageFactory } from "./page";
import { StorageProvider } from "./types/db-provider";
import { SearchProvider } from "./types/search-provider";
import { SectionHandler } from "./types/server";

export const pageHandlerFactory = (
  db: StorageProvider,
  search: SearchProvider
): SectionHandler => {
  const { storePages, updatePage } = pageFactory(db);

  return async ({ method, body, fileStatus, path }) => {
    switch (method) {
      case "GET": {
        console.log(path);
        if (path.endsWith("_urls")) {
          return getPagesInDirectory(path);
        }
        return { slask: 1 };
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
        const page = await body();
        await search.indexPage(page);
        return await storePages({ ...page, url: path });
      }
      case "PUT": {
        const data = await body();

        const { exists } = await fileStatus;
        if (exists) {
          await search.indexPage(data);
          return await updatePage({ ...data, url: path });
        }
        return { notFound: path };
      }
    }
  };
};
