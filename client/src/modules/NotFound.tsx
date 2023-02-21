import { ModuleElement } from "./Resolver";
import { makeModuleSchema } from "./schemas";

const NotFound: ModuleElement<{ type: string }> = ({ type }) => {
  return <div>not found {type}</div>;
};
NotFound.schema = makeModuleSchema({});

export default NotFound;
