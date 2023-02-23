import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Page, PageModule } from "slask-cms";
import Resolver, { getModuleSchema } from "../modules/Resolver";
import { mutatePage } from "../useCms";
import { stop } from "../utils";
import Editor, { useEditor } from "./Editor";
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

function ConnectedModulePreview(data: PageModule) {
  const { type, modules } = data;
  const connect = useEditor(data, getModuleSchema(type));
  return (
    <li>
      <span ref={connect}>{type}</span>
      <ModuleOverview modules={modules} />
    </li>
  );
}

function ModuleOverview({ modules }: { modules?: PageModule[] }) {
  if (!modules) return null;

  return (
    <ul className="pl-3">
      {modules.map((module) => (
        <ConnectedModulePreview key={module.id} {...module} />
      ))}
    </ul>
  );
}

export default function PagePreview() {
  const loadedPage = useLoaderData() as Page;
  const { mutateAsync: savePage } = mutatePage();
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
          <ModuleOverview modules={page.modules} />
        </Editor>
      ) : (
        <p>No modules</p>
      )}
      <div className="buttongroup">
        <Link to={`/page-edit/${page.url}`}>
          <button className="btn">Edit</button>
        </Link>
        <button className="btn" onClick={stop(() => savePage(page))}>
          Save
        </button>
      </div>
    </>
  );
}
