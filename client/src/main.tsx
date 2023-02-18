import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import "./index.css";
import "flowbite";
import { CmsProvider } from "./useCms";

import { QueryClient, QueryClientProvider } from "react-query";
import { createHashRouter, redirect, RouterProvider } from "react-router-dom";
import PageEditor from "./editors/Page";
import { cmsApiFactory, PageModule } from "slask-cms";
import PagePreview from "./components/PagePreview";

const baseUrl = "";

const { getUrls, getPage } = cmsApiFactory(fetch, baseUrl);

const pageLoader = ({ params: { slug } }: any) => getPage(slug ?? "");

const router = createHashRouter([
  {
    path: "/",
    loader: () => {
      return getUrls().then((slug) => ({ slug }));
    },
    element: <App />,
    children: [
      {
        path: "/page/:slug",
        element: <PagePreview />,
        loader: pageLoader,
        // action: async ({ request, params: { slug } }) => {
        //   const formData = await request.formData();
        //   const updates = Object.fromEntries(formData);

        //   console.log(updates);
        //   await updatePage(slug!, updates);
        //   return redirect(`/${slug}`);
        // },
      },
      {
        path: "/page/:slug/edit",
        element: <PageEditor />,
        loader: pageLoader,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.body).render(
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
