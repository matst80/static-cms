import { Page, PageModule } from "slask-cms";

export type SearchProvider = {
  indexPage: (data: Page) => Promise<Response>;
  indexModule: (module: PageModule) => Promise<Response>;
  //indexAsset:(path:string)=>Promise
};
