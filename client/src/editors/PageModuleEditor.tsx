import { PageModule } from "slask-cms";
import { getModuleSchema } from "../modules/Resolver";
import { FieldEditorProps } from "./editor-types";
import ObjectEditor from "./ObjectEditor";

export default function PageModuleEditor({
  data,
  onChange,
}: FieldEditorProps<PageModule>) {
  if (!data) {
    return null;
  }
  const { type } = data;
  const schema = getModuleSchema(type);

  return (
    <div>
      <ObjectEditor
        onChange={onChange}
        ignoredFields={["id"]}
        data={data}
        schema={schema}
      />
    </div>
  );
}
