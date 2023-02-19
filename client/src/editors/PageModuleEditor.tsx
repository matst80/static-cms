import { PageModule } from "slask-cms";
import { getModuleSchema } from "../modules/Resolver";
import ObjectEditor from "./ObjectEditor";

type PageModuleEditorProps = {
  data: PageModule;
  onChange: (data: PageModule) => void;
};

export default function PageModuleEditor({
  data,
  onChange,
}: PageModuleEditorProps) {
  const { type } = data;
  return (
    <div>
      <ObjectEditor
        onChange={onChange}
        data={data}
        schema={getModuleSchema(type)}
      />
    </div>
  );
}
