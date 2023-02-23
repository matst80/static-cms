import { useState } from "react";
import { Link } from "slask-cms";
import { stop } from "../utils";
import { Dialog } from "../components/Dialog";
import { FieldEditorProps } from "../schema-editor/editor-types";

export default function LinksEditor({
  data,
  onChange,
}: FieldEditorProps<Link[] | undefined>) {
  const [showBrowser, setShowBrowser] = useState<boolean>(false);

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

        <button className="btn" onClick={stop(() => setShowBrowser(true))}>
          Open browser
        </button>
      </div>
      <Dialog open={showBrowser} onClose={() => setShowBrowser(false)}>
        <span>här kommer det filer</span>
      </Dialog>
    </>
  );
}
