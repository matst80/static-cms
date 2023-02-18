import { Element } from "@craftjs/core";
import { PageModule } from "slask-cms";
import { Container } from "../components/Container";
import { changeHandlerFactory } from "../utils";
import Settings from "./Settings";

type PageModuleProps = {
  module: PageModule;
  onChange: (data: PageModule) => void;
};

export default function PageModuleComponent({
  module,
  onChange,
}: PageModuleProps) {
  const { modules, type, settings } = module;

  const changeHandler = changeHandlerFactory(module, onChange);
  const modulesChanged = changeHandler("modules");

  const updateModule = (idx: number) => (data: any) => {
    if (modules) {
      modules[idx] = data;
      modulesChanged(modules);
    }
  };

  return (
    <div>
      <div>
        <label>
          <span>Type</span>
          <input value={type} onChange={changeHandler("type")}></input>
        </label>
        <Settings settings={settings} onChange={changeHandler("settings")} />
      </div>
      <Element
        id={module.id}
        is={Container}
        padding={5}
        background="transparent"
        canvas
      >
        {modules?.map((d: any, idx: number) => (
          <PageModuleComponent
            key={d.id}
            module={d}
            onChange={updateModule(idx)}
          />
        ))}
      </Element>
    </div>
  );
}
