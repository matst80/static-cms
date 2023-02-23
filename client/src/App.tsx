import { Link, Outlet } from "react-router-dom";
import { useLastedited } from "./useCms";
import { Breadcrumbs } from "./Breadcrumbs";
import { PageSearch } from "./PageSearch";
import PageLink from "./components/PageLink";

function App() {
  const { data: urls } = useLastedited();

  return (
    <>
      <div className="border-b border-gray-400 p-4 flex">
        <div className="pr-6 mr-6 border-r border-gray-300 flex-1">
          <Breadcrumbs />
        </div>
        <div>
          <PageSearch />
        </div>
      </div>
      <div className="flex">
        <aside className="w-72 border-r min-h-screen border-gray-400 p-6">
          <div className="sticky top-2">
            <ul className="space-y-2 flex-col">
              {urls?.map((pageLink) => (
                <PageLink key={pageLink.url} {...pageLink} />
              ))}
            </ul>
          </div>
        </aside>

        <div className="h-full flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
