import { PageModule } from "slask-cms";
import { getModuleSchema } from "../modules/Resolver";
import ObjectEditor from "./ObjectEditor";

type PageModulesProps = {
  data: PageModule[];
  onChange: (data: PageModule[]) => void;
};

export function PageModulesEditor({ data, onChange }: PageModulesProps) {
  const indexChange = (idx: number) => (module: PageModule) => {
    const modules = [...data];
    modules[idx] = module;
    onChange(modules);
  };
  const addModule = () => {
    onChange([
      ...data,
      {
        id: Math.trunc(Math.random() * 10000000).toString(),
        type: "test",
        settings: {},
        props: {},
      },
    ]);
  };
  return (
    <div>
      <span>Modules:</span>
      {data.map((module, idx) => (
        <PageModuleEditor
          key={module.id}
          data={module}
          onChange={indexChange(idx)}
        />
      ))}
      <button onClick={addModule}>Add</button>
    </div>
  );
}

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
