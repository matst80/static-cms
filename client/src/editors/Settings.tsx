import { Settings } from "slask-cms";
import { changeHandlerFactory } from "../utils";

type SettingsProps = {
  settings: Settings;
  onChange: (data: Settings) => void;
};

export default function SettingsComponent({
  settings,
  onChange,
}: SettingsProps) {
  const { validFrom, validTo, ...other } = settings;
  const changeHandler = changeHandlerFactory(settings, onChange);
  return (
    <div>
      {Object.entries(other).map(([key, value]) => (
        <div key={key}>
          <label>
            <span>{key}</span>
            <input value={String(value)} onChange={changeHandler(key)} />
          </label>
        </div>
      ))}
    </div>
  );
}
