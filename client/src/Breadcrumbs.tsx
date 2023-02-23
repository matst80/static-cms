import { useState } from "react";
import { useLocation } from "react-router-dom";
import PageLink from "./components/PageLink";
import { CreatePageButton } from "./CreatePageButton";
import { useUrls } from "./useCms";
import { stop, usePopup } from "./utils";

type PathPartProps = {
  showArrow: boolean;
  path: string[];
  file: string;
};
function PathPart({ showArrow, path, file }: PathPartProps) {
  const { open, setOpen, ref } = usePopup();
  const { data } = useUrls(path.join("/") + "/");
  return (
    <div className="flex items-center relative cursor-pointer">
      <div className="btnlike" onClick={stop(() => setOpen(!open))}>
        {file.length ? file : "/"}
      </div>
      {showArrow && (
        <svg
          fill="currentColor"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          className="ml-2"
        >
          <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753l5.48-4.796a1 1 0 000-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 001.659.753z" />
        </svg>
      )}

      {open ? (
        <div
          ref={ref}
          className="absolute translate-y-1/2 mt-12 bg-white rounded-md shadow-lg z-10 p-4 w-64 border border-gray-300"
        >
          <ul>
            {data?.map(({ url, title }) => (
              <PageLink key={url} url={url} title={title} />
            ))}
          </ul>
          <CreatePageButton path={path.join("/")} />
        </div>
      ) : null}
    </div>
  );
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").slice(2);

  return (
    <div className="flex gap-2">
      {parts.map((part, i, arr) => {
        return (
          <PathPart
            key={part}
            path={arr.slice(0, i)}
            file={part}
            showArrow={i != arr.length - 1}
          />
        );
      })}
    </div>
  );
}
