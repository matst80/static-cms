import { FormEventHandler, useEffect, useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { useCms } from "../useCms";
import { stop } from "../utils";
import { Schema } from "./editor-types";
import ObjectEditor from "./ObjectEditor";
import { PageModulesEditor } from "./PageModulesEditor";

const pageSchema: Schema<Page> = {
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
    hideTitle: true,
    title: "Page modules",
  },
};

export default function PageEditor() {
  const loadedPage = useLoaderData() as Page;
  const [page, setPage] = useState<Page | undefined>(loadedPage);
  const { savePage } = useCms();
  useEffect(() => {
    setPage(loadedPage);
  }, [loadedPage]);

  const handleSubmit = stop((e) => {
    console.log(e);
    if (page?.url) {
      savePage(page.url, page);
    }
  });

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
          <div className="toolbox">
            <button className="btn" type="submit">
              Save
            </button>
            <button className="btn" name="delete">
              Delete
            </button>
          </div>
        </Form>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
