import { Editor, Frame, Element } from "@craftjs/core";
import { FormEventHandler, useEffect, useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { Container } from "../components/Container";
import Resolver, { modules } from "../modules/Resolver";
import { SettingsPanel } from "../components/SettingsPanel";
import { Toolbox } from "../components/Toolbox";
import { ModuleChangeHandler } from "../components/ModuleChangeHandler";
import { useCms } from "../useCms";
import { changeHandlerFactory } from "../utils";

export default function PageEditor() {
  const loadedPage = useLoaderData() as Page;
  const [page, setPage] = useState<Page | undefined>();
  const { savePage } = useCms();
  useEffect(() => {
    setPage(loadedPage);
  }, [loadedPage]);

  const changeHandler = changeHandlerFactory(page, setPage);
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

          <Editor resolver={modules}>
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
            <ModuleChangeHandler onChange={changeHandler("modules")} />
          </Editor>

          <button type="submit">Save</button>
        </Form>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
