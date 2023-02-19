import { FieldEditor } from "../editors/editor-types";

const DatePicker: FieldEditor<number | undefined> = ({ data, onChange }) => {
  return (
    <input
      type="datetime-local"
      value={data ? new Date(data).toISOString().substring(0, 16) : ""}
      onChange={(e) => onChange(new Date(e.target.value).getTime())}
    />
  );
};

export default DatePicker;
