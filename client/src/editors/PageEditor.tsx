import { FormEventHandler, useEffect, useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { useCms } from "../useCms";
import { Schema } from "./editor-types";
import ObjectEditor from "./ObjectEditor";
import { PageModulesEditor } from "./PageModuleEditor";

const pageSchema: Schema<Page> = {
  id: {
    type: "string",
    title: "Unique id",
  },
  url: {
    type: "string",
    title: "Url",
  },
  seoTitle: {
    type: "string",
    title: "Title",
  },
  seoDescription: {
    type: "string",
    title: "Description",
  },
  modules: {
    type: PageModulesEditor,
    title: "Page modules",
  },
};

export default function PageEditor() {
  const loadedPage = useLoaderData() as Page;
  const [page, setPage] = useState<Page | undefined>();
  const { savePage } = useCms();
  useEffect(() => {
    setPage(loadedPage);
  }, [loadedPage]);

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
          <span>
            Created:{" "}
            {page.created
              ? new Date(page.created).toLocaleString()
              : "Not saved"}
            , Modified:{" "}
            {page.modified
              ? new Date(page.modified).toLocaleString()
              : "Not saved"}
          </span>

          <ObjectEditor onChange={setPage} data={page} schema={pageSchema} />

          {/* <Editor resolver={modules}>
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
          </Editor> */}

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
