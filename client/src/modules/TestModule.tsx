import { PageModuleData } from "slask-cms";
import { makeModuleSchema } from "./schemas";

type TestModule = PageModuleData<
  {
    text: string;
  },
  {
    padding?: number;
  }
>;

export default function TestModuleComponent({
  props = { text: "" },
  settings: { padding = 10 },
}: TestModule) {
  const { text } = props;
  return <div style={{ padding: `${padding}px` }}>{text}</div>;
}
TestModuleComponent.schema = makeModuleSchema<TestModule>(
  {
    text: { type: "string", title: "Text" },
  },
  {
    padding: { type: "string", title: "Padding" },
  }
);
