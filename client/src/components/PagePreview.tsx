import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Page, PageModule } from "slask-cms";
import Resolver from "../modules/Resolver";
import Editor from "./Editor";
import InlineEditor from "./InlineEditor";

const replaceModuleContent = (
  update: PageModule,
  data?: PageModule[]
): undefined | PageModule[] => {
  if (!data) return undefined;
  return data.map((current) => {
    if (current.id === update.id) {
      return { ...update };
    }
    return {
      ...current,
      modules: replaceModuleContent(update, current.modules),
    };
  });
};

export default function PagePreview() {
  const loadedPage = useLoaderData() as Page;
  const [page, setPage] = useState<Page>(loadedPage);
  useEffect(() => {
    setPage(loadedPage);
  }, [loadedPage]);
  const updateModule = (module: PageModule) =>
    setPage({
      ...page,
      modules: replaceModuleContent(module, page.modules) ?? [],
    });

  return (
    <>
      {page.modules?.length ? (
        <Editor>
          {page.modules.map((module) => (
            <Resolver key={module.id} {...module} />
          ))}

          <div className="w-96 border-l border-gray-400 h-full p-6 fixed right-0 top-0 bg-white overflow-y-auto">
            <InlineEditor save={updateModule} />
          </div>
        </Editor>
      ) : (
        <p>No modules</p>
      )}
      <Link className="btn" to={`/page-edit/${page.url}`}>
        Edit
      </Link>
    </>
  );
}
