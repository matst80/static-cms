import { Page, PageModule } from "slask-cms";
import { SearchProvider } from "./types/search-provider";

type ZincOptions = {
  baseUrl: string;
  auth: string;
};

type IndexProperty = {
  type: "text" | "keyword" | "bool" | "numeric" | "date";
  format?: string;
  index?: boolean;
  store?: boolean;
  aggregatable?: boolean;
  highlightable?: boolean;
};

type IndexProperties<T extends Record<string, unknown>> = Partial<{
  [key in keyof T | string]: IndexProperty;
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
    }).then(async (d) => {
      if (!d.ok) {
        console.log(input, d.statusText);
        console.log(await d.text());
      }
      return d;
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
    moduleId: { type: "text", index: true, store: true, highlightable: true },
    text: { type: "text", index: true, store: true, highlightable: true },
  });
  createIndex<Page>("page", {
    url: { type: "text", index: true, store: true, highlightable: true },
    seoTitle: { type: "text", index: true, store: true, highlightable: true },
    created: {
      type: "numeric",
      store: true,
    },
    modified: {
      type: "numeric",
      store: true,
    },
    moduleIds: {
      type: "text",
      index: true,
      store: true,
      highlightable: true,
    },
    seoDescription: {
      type: "text",
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
      return indexDocument("page", data.url.split("/").join("-"), {
        ...data,
        moduleIds: data.modules.map((d) => d.id).join(","),
      });
    },
    indexModule(module) {
      if (!module || !module.id) return Promise.reject("Missing id");
      const { id, ...data } = module;
      return indexDocument("module", id, { ...data, moduleId: id });
    },
  };
};
