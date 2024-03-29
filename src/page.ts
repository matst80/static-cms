import {
  compressStaticFile,
  getStoragePathFromPage,
  getStoragePathFromUrl,
} from "./file-utils";
import { StorageProvider } from "./types/db-provider";
import { PageModule, Page } from "slask-cms";

const appendModuleId =
  (idGenerator: () => string, fn: (module: PageModule) => Promise<unknown>[]) =>
  (module: PageModule) => {
    if (!module.id) {
      module.id = idGenerator();
    }
    if (!module.settings) {
      module.settings = {};
    }
    return fn(module);
  };

const saveModulesFactory = (db: StorageProvider) => {
  const saveModules = (modules: PageModule[]): Promise<unknown>[] =>
    modules
      .map(
        appendModuleId(db.getId, (module) => [
          db.saveModule(module),
          // compressStaticFile(getStoragePathFromModule(module), module),
          ...(module.modules ? saveModules(module.modules) : []),
        ])
      )
      .flat();

  return saveModules;
};

type PageUpdate = {
  url: string;
} & Partial<Page>;

const preparePage =
  <T extends PageUpdate>(fn: (page: T) => Promise<T>) =>
  (page: T) => {
    const now = Date.now();
    return fn({ ...page, created: page.created ?? now, modified: now });
  };

export const pageFactory = (db: StorageProvider) => {
  const savePage = (page: Page): Promise<Page> =>
    Promise.all([
      ...(page.modules ? saveModules(page.modules) : []),
      db.savePage(page),
      getStoragePathFromPage(page).then((path) =>
        compressStaticFile(path, page, true).then(() => {
          const { url, seoTitle, modified } = page;
          db.emitUrlChange({ url, title: seoTitle ?? "", modified });
          return page;
        })
      ),
    ]).then((result) => result.pop() as Page);

  const saveModules = saveModulesFactory(db);
  const updatePage = ({ url, ...page }: PageUpdate) =>
    getStoragePathFromUrl(url, "page")
      .then((path) => db.getPage(path))
      .then((original) => savePage({ ...original!, ...page, url }));

  const storePages = (...pages: Page[]) =>
    Promise.all(pages.map(preparePage(savePage)));
  return { storePages, updatePage };
};
