import { FieldEditor } from "../editor-types";

const DatePicker: FieldEditor<
  number | undefined,
  { min?: number; max?: number }
> = ({ data, onChange, min, max }) => {
  const iso = (n?: number) =>
    n ? new Date(n).toISOString().substring(0, 16) : undefined;
  return (
    <input
      type="datetime-local"
      value={iso(data) ?? ""}
      min={iso(min)}
      max={iso(max)}
      onChange={(e) => onChange(new Date(e.target.value).getTime())}
    />
  );
};

export default DatePicker;
