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
    <>
      <aside>
        <div>
          <ul className="space-y-2">
            {urls?.map(({ url, title }) => (
              <Link className="lnk" key={url} to={`/page${url}`}>
                {title?.length ? title : url}
              </Link>
            ))}
          </ul>
        </div>
      </aside>
      {/* <form onSubmit={createNewPage}>
        {slug?.map(({ url, title }) => (
          <Link key={url} to={`/page/${url}`}>
            {title?.length ? title : url}
          </Link>
        ))}
        <input
          value={urlToCreate}
          onChange={(e) => setUrlToCreate(e.target.value)}
          placeholder="Create"
        />
        <div>
          <a href="/auth/">Login</a>
        </div>
      </form> */}
      <div className="p-4 sm:ml-64">
        <Outlet />
      </div>
    </>
  );
}

export default App;
