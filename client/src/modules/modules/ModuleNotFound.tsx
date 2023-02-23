import { BaseModule } from "services";

export default function ModuleNotFound({
  type,
  ...module
}: BaseModule & { type: string }) {
  return (
    <div>
      <strong>Module: {type} not found</strong>
      <code>
        <pre className="text-sm">{JSON.stringify(module, null, 2)}</pre>
      </code>
    </div>
  );
}
