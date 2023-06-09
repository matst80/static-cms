import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import { CmsProvider } from "./useCms";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import {
  createHashRouter,
  LoaderFunction,
  RouterProvider,
} from "react-router-dom";
import { cmsApiFactory } from "slask-cms";
import PagePreview from "./components/PagePreview";
import ErrorPage from "./ErrorPage";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import PageEditor from "./schema-editor/PageEditor";
import Importer from "./Importer";
const baseUrl = "";

const { getPage } = cmsApiFactory(fetch, baseUrl);

const pageLoader: LoaderFunction = ({ params: { "*": url } }) => {
  return getPage(url ?? "");
};

const router = createHashRouter([
  {
    path: "/",
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
  {
    path: "/import",
    element: <Importer />,
  },
]);

const toastDefaults: ToastOptions = {
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  theme: "dark",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CookiesProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <CmsProvider
        baseUrl={baseUrl}
        showNotification={(message) => {
          if (typeof message === "string") {
            toast(message.toString(), {
              autoClose: 5000,
              hideProgressBar: false,
              ...toastDefaults,
            });
          } else {
            toast.error(message.toString(), {
              autoClose: 10000,
              hideProgressBar: true,
              ...toastDefaults,
            });
          }
        }}
      >
        <RouterProvider router={router} />
      </CmsProvider>
    </CookiesProvider>
  </React.StrictMode>
);
