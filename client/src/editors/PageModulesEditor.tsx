import { useState } from "react";
import { PageModule } from "slask-cms";
import { stop } from "../utils";
import { FieldEditorSchemaProps, FieldProps } from "./editor-types";
import PageModuleEditor from "./PageModuleEditor";

type PageModulesProps = FieldProps<PageModule[]>;

export function PageModulesEditor({ data = [], onChange }: PageModulesProps) {
  const [open, setOpen] = useState(false);
  const indexChange = (idx: number) => (module?: PageModule) => {
    if (module) {
      const modules = [...data];
      modules[idx] = module;
      onChange(modules);
    }
  };
  const remove = (id?: string) =>
    stop(() => {
      onChange([...data].filter((d) => d.id !== id));
    });
  const addModule = stop(() => {
    onChange([
      ...data,
      {
        id: Math.trunc(Math.random() * 10000000).toString(),
        type: "NotFound",
        modules: [],
        settings: {},
        props: {},
      },
    ]);
  });
  return (
    <div>
      <span>
        Modules: ({data?.length ?? 0}){" "}
        <button onClick={stop(() => setOpen(!open))}>Toggle</button>
      </span>
      {open && (
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
          <div className="toolbox">
            <button className="btn" onClick={stop(addModule)}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
