import { FieldEditor } from "./editor-types";

export const StringEditor: FieldEditor<unknown> = ({
  data,
  label,
  onChange,
}) => {
  return (
    <input
      value={data ? String(data) : ""}
      placeholder={label}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
