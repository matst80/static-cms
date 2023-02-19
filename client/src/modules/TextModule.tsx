import { ModuleProps } from "slask-cms";
import { makeModuleSchema } from "./schemas";

type TextProps = {
  header: string;
  text: string;
};

export default function TextModule({
  text = "",
  header,
}: ModuleProps<TextProps>) {
  return (
    <div>
      {header != null && <h2>{header}</h2>}
      <p>{text}</p>
    </div>
  );
}

TextModule.schema = makeModuleSchema<TextProps>({
  header: { type: "string", title: "Header" },
  text: { type: "string", title: "Text" },
});
