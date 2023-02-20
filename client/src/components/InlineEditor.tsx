import { PageModule } from "slask-cms";
import ObjectEditor from "../editors/ObjectEditor";
import { useSelected } from "./Editor";

export default function InlineEditor(props: any) {
  const { Module, data, onChange } = useSelected<PageModule>();

  if (!Module) return null;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <ObjectEditor data={data} schema={Module.schema} onChange={onChange} />
      </div>
    </div>
  );
}
