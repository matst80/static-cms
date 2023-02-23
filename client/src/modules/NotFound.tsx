import Resolver, { ModuleElement } from "./Resolver";
import { makeModuleSchema } from "./schemas";

const NotFound: ModuleElement<{ type: string }> = ({
  type,
  settings,
  modules,
  ...props
}) => {
  return (
    <div>
      not found {type}
      <pre>{JSON.stringify(props, null, 2)}</pre>
      {modules?.map((m) => (
        <Resolver key={m.id} {...m} />
      ))}
    </div>
  );
};
NotFound.schema = makeModuleSchema({});

export default NotFound;
