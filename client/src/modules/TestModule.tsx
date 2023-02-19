import { ModuleProps } from "slask-cms";
import Resolver from "./Resolver";
import { makeModuleSchema } from "./schemas";

type Props = {
  text: string;
};

type Settings = {
  padding: number;
};

export default function TestModule({
  text = "",
  modules,
  settings: { padding = 10 },
}: ModuleProps<Props, Settings>) {
  return (
    <div style={{ padding: `${padding}px` }}>
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
  }
);
