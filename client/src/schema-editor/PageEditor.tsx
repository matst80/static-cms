import { useEffect, useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { mutatePage } from "../useCms";
import { stop } from "../utils";
import { FieldEditor, Schema } from "./editor-types";
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
    defaultValue: [],
    title: "Page modules",
  },
};

export const PageObjectEditor: FieldEditor<Page> = ({ data, onChange }) => {
  if (!data) return null;
  return (
    <div>
      <span>
        Created:{" "}
        {data.created ? new Date(data.created).toLocaleString() : "Not saved"},
        Modified:{" "}
        {data.modified ? new Date(data.modified).toLocaleString() : "Not saved"}
      </span>
      <ObjectEditor onChange={onChange} data={data} schema={pageSchema} />
    </div>
  );
};

export default function PageEditor() {
  const loadedPage = useLoaderData() as Page;
  const [page, setPage] = useState<Page | undefined>(loadedPage);
  const { mutateAsync: savePage } = mutatePage();
  useEffect(() => {
    setPage(loadedPage);
  }, [loadedPage]);

  const handleSubmit = stop((e) => {
    console.log(e, page?.url);
    if (page?.url != null) {
      savePage(page);
    }
  });

  return (
    <div className="w-full p-6">
      {page ? (
        <Form method="post" id="page-form" onSubmit={handleSubmit}>
          <PageObjectEditor data={page} onChange={setPage} />
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
