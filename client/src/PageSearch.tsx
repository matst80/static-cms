import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchPage } from "./useCms";
import { usePopup } from "./utils";

export function PageSearch() {
  const [term, setTerm] = useState<string | undefined>(undefined);
  const { data } = useSearchPage(term);
  const { open, setOpen, ref } = usePopup();
  useEffect(() => {
    setOpen(!!term?.length);
  }, [term]);
  return (
    <div className="relative" ref={ref}>
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
          onFocus={() => setOpen(true)}
          className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
          value={term ?? ""}
          placeholder="Search for page"
          onChange={(e) => setTerm(e.target.value)}
        />
      </label>
      <div>
        {data && open ? (
          <ul className="absolute bg-white rounded-md shadow-lg z-10 p-4 mt-1 w-64 border border-gray-300">
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
        ) : null}
      </div>
    </div>
  );
}
