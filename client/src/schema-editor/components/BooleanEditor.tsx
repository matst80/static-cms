import { FieldEditor } from "../editor-types";

// eslint-disable-next-line @typescript-eslint/ban-types

export const BooleanEditor: FieldEditor<Boolean> = ({
  data,
  label,
  onChange,
}) => {
  return (
    <input
      value={"true"}
      type="checkbox"
      placeholder={label}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
};
