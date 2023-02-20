import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { useCms } from "./useCms";

function App() {
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

  return (
    <div className="h-screen">
      <div className="flex h-full">
        <aside className="w-72 h-sceen border-r border-gray-400 p-6">
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
        </aside>

        <div className="h-full flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
