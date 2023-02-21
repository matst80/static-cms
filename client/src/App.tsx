import { useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { PageObjectEditor } from "./editors/PageEditor";
import { useCms, useSearchPage } from "./useCms";
import { useEditorDialog } from "./editors/EditorDialog";

function CreatePageButton() {
  const { savePage } = useCms();
  const { dialog, setOpen } = useEditorDialog(
    defaultPageSettings,
    {
      "Create page": (page: Page) => {
        savePage(page.url, page);
        return true;
      },
    },
    PageObjectEditor
  );
  return (
    <>
      {dialog}
      <button className="btn" onClick={() => setOpen(true)}>
        Create page
      </button>
    </>
  );
}

const defaultPageSettings = {
  modules: [],
  url: "",
};

function App() {
  const [term, setTerm] = useState<string | undefined>(undefined);

  const urls = useLoaderData() as { url: string; title?: string }[];
  const { data } = useSearchPage(term);
  return (
    <div>
      <div className="flex">
        <aside className="w-72 border-r min-h-screen border-gray-400 p-6">
          <div className="sticky top-2">
            <ul className="space-y-2 flex-col">
              {urls?.map(({ url, title }) => (
                <li key={url}>
                  <Link to={`/page${url}`}>
                    {title?.length ? title : url}{" "}
                    <span className="pill">{url}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <CreatePageButton />
            <div className="pt-4">
              <input
                value={term ?? ""}
                placeholder="Search for page"
                onChange={(e) => setTerm(e.target.value)}
              />
              <ul>
                {data?.hits.hits.map(({ _id, _source }) => {
                  return (
                    <li key={_id}>
                      {_source.seoTitle}{" "}
                      <span className="pill">{_source.url}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        <div className="h-full flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
