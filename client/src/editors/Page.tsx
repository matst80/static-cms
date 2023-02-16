import { useEffect, useState } from "react";
import { useCms } from "../useCms";
import PageModule from "./PageModule";

// const savePage = (page: any) =>
//   fetch("/page/" + page.url, {
//     method: "POST",
//     headers: { authorization: "Bearer a", "content-type": "application/json" },
//   }).then((d) => d.json());

export default function Page({ url }: any) {
  const [page, setPage] = useState<any>();
  const { getPage, savePage } = useCms();
  useEffect(() => {
    getPage(url).then(setPage);
  }, [url, getPage]);
  const updateModule = (idx: number) => (data: any) => {
    const modules = [...page.modules];
    modules[idx] = data;
    setPage({ ...page, modules });
  };
  return (
    <div>
      {page ? (
        <div>
          <input
            value={page.seoTitle ?? ""}
            onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
          />
          {page.modules?.map((d: any, i: number) => (
            <PageModule key={d.id} module={d} onChange={updateModule(i)} />
          ))}
          <button onClick={() => savePage(url, page)}>Save</button>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
