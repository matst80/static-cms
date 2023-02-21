import { AssetFile, Page } from "types/page-and-components";
import { SearchResults } from "types/searchresults";

export type ParentFetch = (
  input: RequestInfo | URL,
  init?: (RequestInit & { next?: { revalidate?: number } }) | undefined
) => Promise<Response>;

export const fixCmsUrl = (url: string) => {
  if (!url || url === "/") return "";
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
  savePage(url: string, page: Page): Promise<Page[]>;
  deletePage(url: string): Promise<boolean>;
  updatePage(url: string, page: Partial<Page>): Promise<Page>;
  getAssets(url: string): Promise<AssetFile[]>;
  searchPage(term: string): Promise<SearchResults>;
  searchModule(term: string): Promise<SearchResults>;
};

type SearchTypes =
  | "fuzzy"
  | "matchphrase"
  | "term"
  | "matchall"
  | "match"
  | "prefix"
  | "wildcard"
  | "querystring";

type SearchOptions = {
  search_type: SearchTypes;
  max_results: number;
  from: number;
  _source: string[];
};
const defaultSearchOptions: SearchOptions = {
  max_results: 20,
  search_type: "wildcard",
  from: 0,
  _source: [],
};

export const cmsApiFactory = (fetch: ParentFetch, baseUrl = ""): CmsApi => {
  const search = (
    section: string,
    term: string,
    {
      search_type,
      max_results,
      from,
      _source,
    }: SearchOptions = defaultSearchOptions
  ) => {
    return fetch(`${baseUrl}/api/${section}/_search`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        search_type,
        max_results,
        from,
        sort_fields: ["-@timestamp"],
        query: {
          term,
        },
        _source,
      }),
    }).then((d) => asJson<SearchResults>(d));
  };
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
      }).then((d) => asJson<Page[]>(d));
    },
    deletePage(url) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "DELETE",
      }).then((d) => d.ok);
    },
    updatePage(url, page) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "PUT",
        body: JSON.stringify(page),
        headers: {},
      }).then((d) => asJson<Page>(d));
    },
    getAssets(url) {
      return fetch(`${baseUrl}/assets/${fixCmsUrl(url)}/`, {
        headers: {
          accept: "application/json",
        },
      }).then((d) => asJson<AssetFile[]>(d));
    },
    searchModule(term) {
      return search("module", term);
    },
    searchPage(term) {
      return search("page", term);
    },
  };
};
