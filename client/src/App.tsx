import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { useCms, useSearchPage } from "./useCms";

function App() {
  const [term, setTerm] = useState<string | undefined>(undefined);
  const { savePage } = useCms();
  const [urlToCreate, setUrlToCreate] = useState("");
  const createNewPage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (urlToCreate && urlToCreate.length) {
      savePage(urlToCreate, {
        modules: [
          {
            type: "hero",
          },
        ],
      }).then(() => setUrlToCreate(""));
    }
  };
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
                  <Link to={`/page${url}`}>{title?.length ? title : url}</Link>
                </li>
              ))}
            </ul>
            <form onSubmit={createNewPage}>
              <input
                value={urlToCreate}
                onChange={(e) => setUrlToCreate(e.target.value)}
                placeholder="Create"
              />
              <div>
                <a href="/auth/">Login</a>
              </div>
            </form>
            <div className="pt-4">
              <input
                value={term ?? ""}
                onChange={(e) => setTerm(e.target.value)}
              />
              <ul>
                {data?.hits.hits.map((item) => {
                  return (
                    <li key={item._id}>
                      <pre>
                        {item._source.seoTitle} ({item._source.url})
                      </pre>
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
