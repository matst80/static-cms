import { Page } from "slask-cms";
import { SearchProvider } from "./types/search-provider";

type ZincOptions = {
  baseUrl: string;
  auth: string;
};

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
