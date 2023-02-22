import { PageModule } from "slask-cms";
import PageModuleEditor from "../editors/PageModuleEditor";
import { stop } from "../utils";
import { useSelected } from "./Editor";

type InlineEditorProps<T> = {
  save: (data: T) => void;
};

export default function InlineEditor({ save }: InlineEditorProps<PageModule>) {
  const { schema, data, onChange } = useSelected<PageModule>();

  if (!schema || !data) return null;

  return (
    <>
      <PageModuleEditor data={data} onChange={onChange} />
      <button className="btn" onClick={stop(() => save(data))}>
        Save
      </button>
    </>
  );
}
