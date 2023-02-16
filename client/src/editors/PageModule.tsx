import { PageModule } from "slask-cms";

type PageModuleProps = {
  module: PageModule;
  onChange: (data: PageModule) => void;
};

export default function PageModuleComponent({
  module,
  onChange,
}: PageModuleProps) {
  const { modules, type } = module;
  const updateModule = (idx: number) => (data: any) => {
    if (modules) {
      modules[idx] = data;
      onChange({ ...module, modules });
    }
  };
  return (
    <div style={{ padding: "2rem" }}>
      <div>
        <label>
          <span>Type</span>
          <input
            value={type}
            onChange={(e) => onChange({ ...module, type: e.target.value })}
          ></input>
        </label>
      </div>
      {modules?.map((d: any, idx: number) => (
        <PageModuleComponent
          key={d.id}
          module={d}
          onChange={updateModule(idx)}
        />
      ))}
    </div>
  );
}
