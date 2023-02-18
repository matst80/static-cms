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

type TreeNode = { url: string; children: Node[] };

export type CmsApi = {
  getPage(url: string): Promise<Page>;
  getUrls(url?: string): Promise<{ url: string; title?: string }[]>;
  getTree(url?: string): Promise<TreeNode[]>;
  savePage(url: string, page: Page): Promise<any>;
  updatePage(url: string, page: Partial<Page>): Promise<any>;
};

export const cmsApiFactory = (fetch: ParentFetch, baseUrl = ""): CmsApi => {
  return {
    getPage(url) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`).then((d) =>
        asJson<Page>(d)
      );
    },
    getUrls(url = "") {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}_urls.json`).then((d) =>
        asJson<{ url: string; title: string }[]>(d)
      );
    },
    getTree(url = "") {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}_tree.json`).then((d) =>
        asJson<TreeNode[]>(d)
      );
    },
    savePage(url, page) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "POST",
        body: JSON.stringify(page),
      }).then((d) => asJson<Page>(d));
    },
    updatePage(url, page) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "PUT",
        body: JSON.stringify(page),
      }).then((d) => asJson<Page>(d));
    },
  };
};
