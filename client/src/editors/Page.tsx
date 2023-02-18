import { Editor, Frame, Element } from "@craftjs/core";
import { FormEventHandler, useEffect, useState } from "react";
import { Form, useFetcher, useLoaderData } from "react-router-dom";
import { Page, PageModule } from "slask-cms";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import Resolver from "../components/Resolver";
import { SettingsPanel } from "../components/SettingsPanel";
import { Text } from "../components/Text";
import { Toolbox } from "../components/Toolbox";
import { Topbar } from "../components/TopBar";
import { useCms } from "../useCms";
import { changeHandlerFactory } from "../utils";
import PageModuleEditor from "./PageModule";

// const savePage = (page: any) =>
//   fetch("/page/" + page.url, {
//     method: "POST",
//     headers: { authorization: "Bearer a", "content-type": "application/json" },
//   }).then((d) => d.json());

export default function PageEditor() {
  const loadedPage = useLoaderData() as Page;
  const [page, setPage] = useState<Page | undefined>();
  const { savePage } = useCms();
  useEffect(() => {
    setPage(loadedPage);
  }, [loadedPage]);

  const changeHandler = changeHandlerFactory(page, setPage);
  const updateModule = changeHandler("modules");
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (page?.url) {
      savePage(page.url, page);
    }
  };
  return (
    <div className="flex flex-1">
      {page ? (
        <Form method="post" id="page-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              name="seoTitle"
              defaultValue={page.seoTitle}
              // onChange={changeHandler("seoTitle")}
            />
          </label>
          <label>
            <span>Description</span>
            <input
              name="seoDescription"
              defaultValue={page.seoDescription}
              // onChange={changeHandler("seoDescription")}
            />
          </label>

          <Editor
            resolver={{
              Card,
              Button,
              Text,
              Container,
              Resolver,
            }}
          >
            <div className="flex">
              <Frame>
                <Element is={Container} canvas>
                  {page.modules?.map((d) => (
                    <Resolver key={d.id} {...d} />
                  ))}
                </Element>
              </Frame>
              <SettingsPanel />
            </div>
            <Toolbox />
            <Topbar onChange={updateModule} />
          </Editor>

          <button type="submit">Save</button>
        </Form>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
