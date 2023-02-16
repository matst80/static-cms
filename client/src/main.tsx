import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { CmsApi, cmsApiFactory } from "slask-cms";
import App from "./App";
import "./index.css";
import { CmsProvider } from "./useCms";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CmsProvider>
      <App />
    </CmsProvider>
  </React.StrictMode>
);
