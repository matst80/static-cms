import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import {
  CmsApi,
  cmsApiFactory,
  Page,
  PageModule,
  SearchResults,
} from "slask-cms";

type CmsApiContext = CmsApi;

const CmsContext = createContext<CmsApiContext | null>(null);

type CmsProviderProps = {
  baseUrl?: string;
  showNotification?: (message: string | Error) => any;
} & PropsWithChildren;

export const CmsProvider = ({
  children,
  baseUrl,
  showNotification,
}: CmsProviderProps) => {
  const [cookies] = useCookies(["cms-token"]);
  const token = cookies["cms-token"];
  const apiContext = useMemo<CmsApiContext>(() => {
    const api = cmsApiFactory(
      (url, data) =>
        fetch(url, {
          ...data,
          headers: token
            ? { ...data?.headers, authorization: `bearer ${token}` }
            : data?.headers,
        }),
      baseUrl,
      showNotification
    );
    return api;
  }, [token, baseUrl]);
  return (
    <CmsContext.Provider value={apiContext}>{children}</CmsContext.Provider>
  );
};

export const useCms = (): CmsApi => {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error("useCms requires CmsProvider");
  }
  return ctx;
};

export const usePage = (url = "") => {
  const { getPage, savePage } = useCms();
  const result = useQuery("cms:" + url, () => getPage(url));
  return { ...result, savePage };
};

export const useUrls = (url = "") => {
  const { getUrls } = useCms();
  return useQuery("cms-urls:" + url, () => getUrls(url));
};

export const useAssets = (url = "") => {
  const { getAssets } = useCms();
  return useQuery("cms-assets:" + url, () => getAssets(url));
};

export const useSearchPage = (term?: string) => {
  const { searchPage } = useCms();
  return useQuery<string, unknown, SearchResults<Page>>(
    "cms-query-page:" + term,
    () => searchPage(term ?? ""),
    {
      enabled: !!term?.length,
    }
  );
};

export const useSearchModule = (term?: string) => {
  const { searchModule } = useCms();
  return useQuery<string, unknown, SearchResults<PageModule>>(
    "cms-query-module:" + term,
    () => searchModule(term ?? ""),
    {
      enabled: !!term?.length,
    }
  );
};
