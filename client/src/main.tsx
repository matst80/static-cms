import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import "./index.css";
import { CmsProvider } from "./useCms";

import { QueryClient, QueryClientProvider } from "react-query";
import {
  createHashRouter,
  LoaderFunction,
  RouterProvider,
} from "react-router-dom";
import PageEditor from "./editors/PageEditor";
import { cmsApiFactory } from "slask-cms";
import PagePreview from "./components/PagePreview";
import ErrorPage from "./ErrorPage";

const baseUrl = "";

const { getUrls, getPage } = cmsApiFactory(fetch, baseUrl);

const pageLoader: LoaderFunction = ({ params: { "*": url } }) => {
  return getPage(url ?? "");
};

const router = createHashRouter([
  {
    path: "/",
    loader: () => getUrls(),
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/page/*",
        element: <PagePreview />,
        loader: pageLoader,
      },
      {
        path: "/page-edit/*",
        element: <PageEditor />,
        loader: pageLoader,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <CmsProvider baseUrl={baseUrl}>
          <RouterProvider router={router} />
        </CmsProvider>
      </QueryClientProvider>
    </CookiesProvider>
  </React.StrictMode>
);
