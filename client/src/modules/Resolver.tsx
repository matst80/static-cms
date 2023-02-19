import { PageModule, PageModuleData } from "slask-cms";
import { Schema } from "../editors/editor-types";
import { pageModuleSchema } from "./schemas";
import TestModule from "./TestModule";

const NotFound = ({ type }: any) => {
  return <div>not found {type}</div>;
};
NotFound.schema = pageModuleSchema;

export const modules = { NotFound, TestModule };

export default function Resolver({ type, ...module }: PageModule) {
  const Module = (modules as any)[type];
  return Module ? <Module {...module} /> : <NotFound type={type} />;
}

export const getModuleSchema = (type: string): Schema<PageModule> => {
  return ((modules as any)[type] ?? NotFound).schema;
};
