import { ModuleProps } from "slask-cms";
import { ColorEditor } from "../editors/StringEditor";
import Resolver from "./Resolver";
import { makeModuleSchema } from "./schemas";

type Props = {
  text: string;
};

type Settings = {
  padding: number;
  backgroundColor: string;
};

export default function TestModule({
  text = "",
  modules,
  settings: { padding = 10, backgroundColor },
}: ModuleProps<Props, Settings>) {
  return (
    <div style={{ padding: `${padding}px`, backgroundColor }}>
      <p>{text}</p>
      {modules?.map((module) => (
        <Resolver key={module.id} {...module} />
      ))}
    </div>
  );
}

TestModule.schema = makeModuleSchema<Props, Settings>(
  {
    text: { type: "string", title: "Text" },
  },
  {
    padding: { type: "string", title: "Padding" },
    backgroundColor: { type: ColorEditor, title: "Background color" },
  }
);
