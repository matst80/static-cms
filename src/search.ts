import { Page, PageModule } from "slask-cms";
import { SearchProvider } from "./types/search-provider";

type ZincOptions = {
  baseUrl: string;
  auth: string;
};

type DateIndexProperty = IndexProperty & {
  type: "date";
  format: string;
  index: boolean;
  store: boolean;
  aggregatable: boolean;
};

type StringIndexProperty = IndexProperty & {
  type: "string" | "keyword";
  highlightable: boolean;
};

type IndexProperty = {
  index: boolean;
  store: boolean;
};

type IndexProperties<T extends Record<string, unknown>> = Partial<{
  [key in keyof T]: StringIndexProperty | DateIndexProperty;
}>;

export const zincSearchFactory = ({
  baseUrl,
  auth,
}: ZincOptions): SearchProvider => {
  const parentFetch = (input: string, init?: RequestInit | undefined) =>
    fetch(`${baseUrl}${input}`, {
      ...init,
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
    });

  const createIndex = <T extends Record<string, unknown>>(
    name: string,
    properties: IndexProperties<T>
  ) =>
    parentFetch(`/api/index/`, {
      method: "POST",
      body: JSON.stringify({
        name,
        storage_type: "disk",
        shard_num: 1,
        mappings: {
          properties,
        },
      }),
    });

  createIndex<PageModule>("module", {
    id: { type: "string", index: true, store: true, highlightable: true },
  });
  createIndex<Page>("page", {
    url: { type: "string", index: true, store: true, highlightable: true },
    seoTitle: { type: "string", index: true, store: true, highlightable: true },
    seoDescription: {
      type: "string",
      index: true,
      store: true,
      highlightable: false,
    },
  });

  const indexDocument = (
    index: string,
    id: string,
    data: Record<string, unknown>
  ) => {
    return parentFetch(`/api/${index}/_doc/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };
  return {
    indexPage(data) {
      return indexDocument("page", data.url, data);
    },
    indexModule(module) {
      if (!module || !module.id) return Promise.reject("Missing id");
      return indexDocument("module", module.id, module);
    },
  };
};
