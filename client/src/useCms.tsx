import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { CmsApi, cmsApiFactory } from "slask-cms";

type CmsApiContext = CmsApi & { setAuthorization: (token: string) => void };

const CmsContext = createContext<CmsApiContext | null>(null);

type CmsProviderProps = { baseUrl?: string } & PropsWithChildren;

export const CmsProvider = ({ children, baseUrl }: CmsProviderProps) => {
  const [token, setToken] = useState<string>();

  const apiContext = useMemo<CmsApiContext>(() => {
    const api = cmsApiFactory(
      (url, data) =>
        fetch(url, {
          ...data,
          headers: { ...data?.headers, authorization: token ?? "" },
        }),
      baseUrl
    );
    return { ...api, setAuthorization: setToken };
  }, [setToken, baseUrl]);
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
