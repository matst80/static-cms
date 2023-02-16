import {
  compressStaticFile,
  getStoragePathFromModule,
  getStoragePathFromPage,
} from "./file-utils";
import { StorageProvider } from "./types/db-provider";
import { PageModule, Page } from "./types/page-and-components";

const saveModulesFactory = (db: StorageProvider) => {
  const saveModules = (modules: PageModule[]): Promise<unknown>[] =>
    modules
      .map((module) => [
        db.saveModule(module),
        compressStaticFile(getStoragePathFromModule(module), module),
        ...(module.modules ? saveModules(module.modules) : []),
      ])
      .flat();

  return saveModules;
};

export const pageFactory = (db: StorageProvider) => {
  const saveModules = saveModulesFactory(db);
  const storePages = (...pages: Page[]) =>
    Promise.all(
      pages.map((page) =>
        Promise.all([
          ...saveModules(page.modules),
          getStoragePathFromPage(page).then((path) =>
            compressStaticFile(path, page, true).then(() => {
              db.emitChange(page.url);
              return;
            })
          ),
        ])
      )
    );
  return { storePages };
};
