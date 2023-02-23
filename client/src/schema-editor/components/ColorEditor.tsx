import { FieldEditor } from "../editor-types";

export const ColorEditor: FieldEditor<string> = ({ data, label, onChange }) => {
  return (
    <input
      value={data ? String(data) : ""}
      type={"color"}
      placeholder={label}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
