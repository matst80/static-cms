import { Editor, Frame, Element } from "@craftjs/core";
import { useEffect, useState } from "react";
import { Page, PageModule } from "slask-cms";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { SettingsPanel } from "../components/SettingsPanel";
import { Text } from "../components/Text";
import { Topbar } from "../components/TopBar";
import { useCms } from "../useCms";
import { changeHandlerFactory } from "../utils";
import PageModuleEditor from "./PageModule";

// const savePage = (page: any) =>
//   fetch("/page/" + page.url, {
//     method: "POST",
//     headers: { authorization: "Bearer a", "content-type": "application/json" },
//   }).then((d) => d.json());

export default function PageEditor({ url }: any) {
  const [page, setPage] = useState<Page | undefined>();
  const { getPage, savePage } = useCms();
  useEffect(() => {
    getPage(url).then(setPage);
  }, [url, getPage]);
  const changeHandler = changeHandlerFactory(page, setPage);
  const updateModule = changeHandler("modules");
  const moduleChange = (idx: number) => (data: PageModule) => {
    if (!page) return;
    const modules = [...page.modules];
    modules[idx] = data;
    updateModule(modules);
  };
  return (
    <div>
      {page ? (
        <div>
          <label>
            <span>Title</span>
            <input
              value={page.seoTitle ?? ""}
              onChange={changeHandler("seoTitle")}
            />
          </label>
          <label>
            <span>Description</span>
            <input
              value={page.seoDescription ?? ""}
              onChange={changeHandler("seoDescription")}
            />
          </label>

          <button onClick={() => savePage(url, page)}>Save</button>
          <Editor
            resolver={{ Card, Button, Text, Container, PageModuleEditor }}
          >
            <Frame>
              <Element
                is={Container}
                padding={5}
                background="transparent"
                canvas
              >
                {page.modules?.map((d: any, i: number) => (
                  <PageModuleEditor
                    key={d.id}
                    module={d}
                    onChange={moduleChange(i)}
                  />
                ))}
              </Element>
            </Frame>
            <SettingsPanel />
            <Topbar />
          </Editor>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
