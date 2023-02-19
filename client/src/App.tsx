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
  const { slug } = useLoaderData() as {
    slug: { url: string; title?: string }[];
  };
  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2">
            {slug?.map(({ url, title }) => (
              <Link
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                key={url}
                to={`/page/${url}`}
              >
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
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
