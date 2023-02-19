import { Link } from "slask-cms";
import { FieldEditorProps } from "./editor-types";

export default function LinksEditor({
  data,
  onChange,
}: FieldEditorProps<Link[]>) {
  return (
    <div>
      {data?.map(({ href, caption, title }) => {
        return (
          <a className="btn" href={href} title={title}>
            {caption ?? title}
          </a>
        );
      })}
    </div>
  );
}
