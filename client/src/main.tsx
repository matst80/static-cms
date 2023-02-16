import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import "./index.css";
import { CmsProvider } from "./useCms";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <CmsProvider baseUrl="https://cms.tornberg.me">
          <App />
        </CmsProvider>
      </QueryClientProvider>
    </CookiesProvider>
  </React.StrictMode>
);
