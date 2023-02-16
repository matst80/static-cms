import { Page } from "types/page-and-components";

export type ParentFetch = (
  input: RequestInfo | URL,
  init?: (RequestInit & { next?: { revalidate?: number } }) | undefined
) => Promise<Response>;

export const fixCmsUrl = (url: string) => {
  if (!url || url === "/" || url === "") return "";
  return url.startsWith("/") ? url.substring(1) : url;
};

const asJson = <T>(d: Response) => {
  if (d.ok) {
    return d.json() as Promise<T>;
  }
  throw Error(d.statusText);
};

export type CmsApi = {
  getPage(url: string): Promise<Page>;
  getUrls(url?: string): Promise<string[]>;
  savePage(url: string, page: Page): Promise<any>;
};

export const cmsApiFactory = (fetch: ParentFetch, baseUrl = ""): CmsApi => {
  return {
    getPage(url) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`).then((d) =>
        asJson<Page>(d)
      );
    },
    getUrls(url = "") {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}urls.json`).then((d) =>
        asJson<string[]>(d)
      );
    },
    savePage(url, page): Promise<any> {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "POST",
        body: JSON.stringify(page),
      }).then((d) => asJson<Page>(d));
    },
  };
};
