import { unlink } from "fs/promises";
import { getVariants } from "./file-utils";
import { pageFactory } from "./page";
import { StorageProvider } from "./types/db-provider";
import { SectionHandler } from "./types/server";

export const pageHandlerFactory = (db: StorageProvider):SectionHandler => {
  const { storePages, updatePage } = pageFactory(db);
  
  return async ({
    method,
    body,
    fileStatus,
    path,
  }) => {
    switch (method) {
      case "DELETE": {
        const { exists, filePath } = await fileStatus;
        if (exists) {
          await getVariants(filePath).map(unlink);

          return { filePath, deleted: true };
        }
        return;
      }
      case "POST": {
        return await storePages({ ...(await body), url: path });
      }
      case "PUT": {
				const data = await body;
        const { exists } = await fileStatus;
        if (exists) {
          return await updatePage({ ...data, url: path });
        }
        return {notFound:path};
      }
    }
  };
};
