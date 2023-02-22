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
              <label className="relative block">
                <svg
                  className="pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M15 3H5c-1.11 0-2 .89-2 2v5.82a6.505 6.505 0 019.1.08 6.525 6.525 0 010 9.2c-.36.35-.75.64-1.16.9H19c1.11 0 2-.89 2-2V9l-6-6m-1 7V4.5l5.5 5.5H14m-6.5 1C5 11 3 13 3 15.5c0 .88.25 1.71.69 2.4L.61 21 2 22.39l3.12-3.07c.69.43 1.51.68 2.38.68 2.5 0 4.5-2 4.5-4.5S10 11 7.5 11m0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>

                <input
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={term ?? ""}
                  placeholder="Search for page"
                  onChange={(e) => setTerm(e.target.value)}
                />
              </label>
              <ul>
                {data?.hits.hits.map(({ _id, _source }) => {
                  const { seoTitle, url } = _source;
                  return (
                    <li key={_id}>
                      <Link to={`/page/${url}`}>
                        {seoTitle} <span className="pill">{url}</span>
                      </Link>
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
