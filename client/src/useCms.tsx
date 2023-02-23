import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useMutation, useQuery } from "react-query";
import {
  CmsApi,
  cmsApiFactory,
  Page,
  PageModule,
  SearchResults,
} from "slask-cms";
import { QueryClient, QueryClientProvider } from "react-query";

type CmsApiContext = CmsApi;
const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <CmsContext.Provider value={apiContext}>{children}</CmsContext.Provider>
    </QueryClientProvider>
  );
};

export const useCms = (): CmsApi => {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error("useCms requires CmsProvider");
  }
  return ctx;
};

export const mutatePage = () => {
  const { savePage } = useCms();
  return useMutation(
    (page: Page) => savePage(page.url, page).then((d) => d[0]),
    {
      onSuccess() {
        setTimeout(() => {
          queryClient.invalidateQueries("cmspage");
        }, 200);
      },
    }
  );
};

export const usePage = (url = "") => {
  const { getPage, savePage } = useCms();
  const result = useQuery(["cmspage", "cms:" + url], () => getPage(url));
  return { ...result, savePage };
};

export const useUrls = (url = "") => {
  const { getUrls } = useCms();
  return useQuery(["cmspage", "cms-urls:" + url], () => getUrls(url));
};

export const useLastedited = () => {
  const { getLastEdited } = useCms();
  return useQuery(["cmspage", "cms-last"], () => getLastEdited());
};

export const useAssets = (url = "") => {
  const { getAssets } = useCms();
  return useQuery(["cmspage", "cms-assets:" + url], () => getAssets(url));
};

export const useSearchPage = (term?: string) => {
  const { searchPage } = useCms();
  return useQuery<string, unknown, SearchResults<Page>>(
    ["cmspage", "cms-query-page:" + term],
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

export const useFileUpload = () => {
  const { uploadAssets } = useCms();
  const [files, setFiles] = useState<FileList | null>(null);
  const startUpload = (assetType: "image" | "video" | "data" = "image") => {
    if (!files) {
      return Promise.reject("No files to upload");
    }
    uploadAssets(files, assetType);
  };
  return { files: files ? Array.from(files) : [], setFiles, startUpload };
};
