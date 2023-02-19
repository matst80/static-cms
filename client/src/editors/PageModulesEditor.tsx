import { PageModule } from "slask-cms";
import { modules } from "../modules/Resolver";
import PageModuleEditor from "./PageModuleEditor";

type PageModulesProps = {
  data: PageModule[] | undefined;
  onChange: (data: PageModule[]) => void;
};

export function PageModulesEditor({ data = [], onChange }: PageModulesProps) {
  const indexChange = (idx: number) => (module: PageModule) => {
    const modules = [...data];
    modules[idx] = module;
    onChange(modules);
  };
  const remove = (id?: string) => () => {
    onChange([...data].filter((d) => d.id !== id));
  };
  const addModule = () => {
    onChange([
      ...data,
      {
        id: Math.trunc(Math.random() * 10000000).toString(),
        type: "NotFound",
        settings: {},
        props: {},
      },
    ]);
  };
  return (
    <div>
      <span>Modules:</span>
      <div className="pl-4">
        {data.map((module, idx) => (
          <div key={module.id} className="relative">
            <button
              onClick={remove(module.id)}
              className="btn absolute right-0 top-0"
            >
              Delete
            </button>
            <PageModuleEditor data={module} onChange={indexChange(idx)} />
          </div>
        ))}
      </div>
      <button onClick={addModule}>Add</button>
    </div>
  );
}
