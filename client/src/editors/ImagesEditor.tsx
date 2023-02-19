import { Image } from "slask-cms";
import { FieldEditorProps } from "./editor-types";

export default function ImagesEditor({
  data,
  onChange,
}: FieldEditorProps<Image[]>) {
  return (
    <div className="flex">
      {data?.map(({ src, title }) => {
        return (
          <div>
            <img src={src} title={title} />
            <span>{title}</span>
          </div>
        );
      })}
    </div>
  );
}
