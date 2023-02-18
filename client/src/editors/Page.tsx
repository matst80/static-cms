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
              <div>
                <Toolbox />

                <SettingsPanel />
              </div>
            </div>

            <ModuleChangeHandler onChange={changeHandler("modules")} />
          </Editor>

          <button
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="submit"
          >
            Save
          </button>
          <button
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="submit"
          >
            Delete
          </button>
        </Form>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
