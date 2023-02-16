import { useEffect, useState } from "react";
import { Page, PageModule } from "slask-cms";
import { useCms } from "../useCms";
import { changeHandlerFactory } from "../utils";
import PageModuleEditor from "./PageModule";

// const savePage = (page: any) =>
//   fetch("/page/" + page.url, {
//     method: "POST",
//     headers: { authorization: "Bearer a", "content-type": "application/json" },
//   }).then((d) => d.json());

export default function PageEditor({ url }: any) {
  const [page, setPage] = useState<Page | undefined>();
  const { getPage, savePage } = useCms();
  useEffect(() => {
    getPage(url).then(setPage);
  }, [url, getPage]);
  const changeHandler = changeHandlerFactory(page, setPage);
  const updateModule = changeHandler("modules");
  const moduleChange = (idx: number) => (data: PageModule) => {
    if (!page) return;
    const modules = [...page.modules];
    modules[idx] = data;
    updateModule(modules);
  };
  return (
    <div>
      {page ? (
        <div>
          <label>
            <span>Title</span>
            <input
              value={page.seoTitle ?? ""}
              onChange={changeHandler("seoTitle")}
            />
          </label>
          <label>
            <span>Description</span>
            <input
              value={page.seoDescription ?? ""}
              onChange={changeHandler("seoDescription")}
            />
          </label>
          {page.modules?.map((d: any, i: number) => (
            <PageModuleEditor
              key={d.id}
              module={d}
              onChange={moduleChange(i)}
            />
          ))}
          <button onClick={() => savePage(url, page)}>Save</button>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
