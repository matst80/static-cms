import { PageModuleData } from "slask-cms";
import { makeModuleSchema } from "./schemas";

type TestModuleProps = PageModuleData<
  {
    text: string;
  },
  {
    padding?: number;
  }
>;

export default function TestModule({
  props = { text: "" },
  settings: { padding = 10 },
}: TestModuleProps) {
  const { text } = props;
  return <div style={{ padding: `${padding}px` }}>{text}</div>;
}

TestModule.schema = makeModuleSchema<TestModuleProps>(
  {
    text: { type: "string", title: "Text" },
  },
  {
    padding: { type: "string", title: "Padding" },
  }
);
