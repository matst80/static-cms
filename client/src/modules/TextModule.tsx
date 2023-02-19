import { PageModuleData } from "slask-cms";
import { makeModuleSchema } from "./schemas";

type TextModuleProps = PageModuleData<{
  text: string;
}>;

export default function TextModule({ props = { text: "" } }: TextModuleProps) {
  const { text } = props;
  return <p>{text}</p>;
}

TextModule.schema = makeModuleSchema<TextModuleProps>({
  text: { type: "string", title: "Text" },
});
