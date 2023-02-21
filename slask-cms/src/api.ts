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

export const cmsApiFactory = (
  fetch: ParentFetch,
  baseUrl = "",
  showNotification?: (data: string | Error) => any
): CmsApi => {
  const jsonFetch = <T>(input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, init)
      .then((d) => asJson<T>(d))
      .catch((err) => {
        if (showNotification) return showNotification(err);
        return err;
      });

  const search = (
    section: string,
    term: string,
    {
      search_type,
      max_results,
      from,
      _source,
    }: SearchOptions = defaultSearchOptions
  ) =>
    jsonFetch<SearchResults>(`${baseUrl}/api/${section}/_search`, {
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
    });

  const showMessage =
    <T>(text: string) =>
    (d: T) => {
      if (showNotification && d != null) {
        showNotification(text);
      }
      return d;
    };
  return {
    getPage(url) {
      return jsonFetch<Page>(`${baseUrl}/page/${fixCmsUrl(url)}`);
    },
    getUrls(url = "") {
      return jsonFetch<{ url: string; title: string }[]>(
        `${baseUrl}/page/${fixCmsUrl(url)}_urls.json`
      );
    },
    getTree(url = "") {
      return jsonFetch<TreeNode[]>(
        `${baseUrl}/page/${fixCmsUrl(url)}_tree.json`
      );
    },
    savePage(url, page) {
      return jsonFetch<Page[]>(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "POST",
        body: JSON.stringify(page),
      }).then(showMessage(`Page saved: ${url}`));
    },
    deletePage(url) {
      return fetch(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "DELETE",
      })
        .then((d) => d.ok)
        .then(showMessage(`Page deleted: ${url}`));
    },
    updatePage(url, page) {
      return jsonFetch<Page>(`${baseUrl}/page/${fixCmsUrl(url)}`, {
        method: "PUT",
        body: JSON.stringify(page),
        headers: {},
      }).then(showMessage(`Page updated`));
    },
    getAssets(url) {
      return jsonFetch<AssetFile[]>(`${baseUrl}/assets/${fixCmsUrl(url)}/`, {
        headers: {
          accept: "application/json",
        },
      });
    },
    searchModule(term) {
      return search("module", term);
    },
    searchPage(term) {
      return search("page", term);
    },
  };
};
