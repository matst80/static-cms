import { PageModuleData, Settings } from "slask-cms";
import { Schema } from "../editors/editor-types";
import { makeModuleSchema, pageModuleSchema } from "./schemas";

type TestModuleProps = {
  text: string;
};

type TestModuleSettings = Settings & {
  padding?: number;
};

type TestModule = PageModuleData<TestModuleProps, TestModuleSettings>;

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
