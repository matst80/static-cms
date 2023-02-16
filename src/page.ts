import {
  compressStaticFile,
  getStoragePathFromModule,
  getStoragePathFromPage,
} from "./file-utils";
import { StorageProvider } from "./types/db-provider";
import { PageModule, Page } from "slask-cms";

const appendModuleId =
  (idGenerator: () => string, fn: (module: PageModule) => Promise<unknown>[]) =>
  (module: PageModule) => {
    if (!module.id) {
      module.id = idGenerator();
    }
    return fn(module);
  };

const saveModulesFactory = (db: StorageProvider) => {
  const saveModules = (modules: PageModule[]): Promise<unknown>[] =>
    modules
      .map(
        appendModuleId(db.getId, (module) => [
          db.saveModule(module),
          compressStaticFile(getStoragePathFromModule(module), module),
          ...(module.modules ? saveModules(module.modules) : []),
        ])
      )
      .flat();

  return saveModules;
};

const prepairPage = (fn: (page: Page) => Promise<unknown>) => (page: Page) => {
  const now = Date.now();
  return fn({ ...page, created: page.created ?? now, modified: now });
};

export const pageFactory = (db: StorageProvider) => {
  const saveModules = saveModulesFactory(db);
  const storePages = (...pages: Page[]) =>
    Promise.all(
      pages.map(
        prepairPage((page) =>
          Promise.all([
            ...saveModules(page.modules),
            db.savePage(page),
            getStoragePathFromPage(page).then((path) =>
              compressStaticFile(path, page, true).then(() =>
                db.emitUrlChange(page.url)
              )
            ),
          ])
        )
      )
    );
  return { storePages };
};
