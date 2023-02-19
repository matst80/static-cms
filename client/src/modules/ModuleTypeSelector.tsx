import { FieldEditor } from "../editors/editor-types";
import { modules } from "./Resolver";

export const ModuleTypeSelector: FieldEditor<string> = ({ data, onChange }) => {
  const alt = Object.keys(modules);
  return (
    <select value={data} onChange={(e) => onChange(e.target.value)}>
      {alt.map((name) => (
        <option key={name}>{name}</option>
      ))}
    </select>
  );
};
