import { FieldEditor } from "../schema-editor/editor-types";
import { getModules } from "./Resolver";

export const ModuleTypeSelector: FieldEditor<string> = ({ data, onChange }) => {
  const alt = getModules();
  return (
    <select value={data} onChange={(e) => onChange(e.target.value)}>
      {alt.map((name) => (
        <option key={name}>{name}</option>
      ))}
    </select>
  );
};
