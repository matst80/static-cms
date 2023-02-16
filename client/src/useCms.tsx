import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { CmsApi, cmsApiFactory } from "slask-cms";

type CmsApiContext = CmsApi;

const CmsContext = createContext<CmsApiContext | null>(null);

type CmsProviderProps = { baseUrl?: string } & PropsWithChildren;

export const CmsProvider = ({ children, baseUrl }: CmsProviderProps) => {
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
      baseUrl
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
