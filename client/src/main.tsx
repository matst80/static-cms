import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import "./index.css";
import { CmsProvider } from "./useCms";

import { QueryClient, QueryClientProvider } from "react-query";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import PageEditor from "./editors/Page";
import { cmsApiFactory } from "slask-cms";

const baseUrl = "https://cms.tornberg.me";

const { getUrls, getPage, updatePage } = cmsApiFactory(fetch, baseUrl);

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return getUrls().then((slug) => ({ slug }));
    },
    element: <App />,
    children: [
      {
        path: "/:slug",
        element: <PageEditor />,
        loader: ({ params: { slug } }) => getPage(slug ?? ""),
        action: async (props) => {
          const { request, params } = props;
          const { slug } = params;
          const formData = await request.formData();
          const updates = Object.fromEntries(formData);

          console.log(updates);
          await updatePage({ ...updates, url: slug });
          return redirect(`/${params.slug}`);
        },
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
