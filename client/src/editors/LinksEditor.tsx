import { PropsWithChildren, useState } from "react";
import { Link } from "slask-cms";
import { stop } from "../utils";
import { FieldEditorProps } from "./editor-types";

type DialogProps = {
  open: boolean;
  onClose: () => void;
} & PropsWithChildren;
const Dialog = ({ open, children, onClose }: DialogProps) => {
  return open ? (
    <div
      onClick={onClose}
      className="fixed inset-0 z-20 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={stop(() => console.log)}
        className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light antialiased shadow-2xl"
      >
        <div className="p-6">{children}</div>
        <div className="flex shrink-0 flex-wrap items-center justify-end p-4">
          <button onClick={stop(onClose)}>Close</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default function LinksEditor({
  data,
  onChange,
}: FieldEditorProps<Link[]>) {
  const [showBrowser, setShowBrowser] = useState<boolean>(false);
  console.log(showBrowser);
  return (
    <>
      <div>
        {data?.map(({ href, caption, title }) => {
          return (
            <a className="btn" href={href} title={title}>
              {caption ?? title}
            </a>
          );
        })}

        <button onClick={stop(() => setShowBrowser(true))}>Open browser</button>
      </div>
      <Dialog open={showBrowser} onClose={() => setShowBrowser(false)}>
        <span>här kommer det filer</span>
      </Dialog>
    </>
  );
}
