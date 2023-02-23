import React from "react";
import { BaseModule } from ".";
// import { BaseModule } from "services";
// import { composeModuleClass } from "../Placements";
import { ItemContent } from "./ItemContent";

export const getGridClassName = (columns: number) => {
  switch (columns) {
    case 1:
      return "";
    case 2:
      return "grid grid-cols-2 gap-8";
    case 3:
      return "grid grid-cols-3 gap-8";
    case 4:
      return "grid grid-cols-4 gap-8";
    case 5:
      return "grid grid-cols-5 gap-8";
    default:
      return "grid grid-cols-6 gap-8";
  }
};

export const composeModuleClass = (p: any, ...ret: string[]) => {
  return ret.join(" ") ?? "";
};

export default function Tiles(data: BaseModule) {
  const { modules, settings } = data;
  const { columns = "6" } = settings;
  const cols = Number(columns);
  const cls = composeModuleClass(data, getGridClassName(cols));
  // console.log(settings, viewType);
  return (
    <div className={cls}>
      {modules?.map(({ props, ...item }) => (
        <ItemContent
          itemClassName={"items-center"}
          key={item.id}
          {...item}
          {...props}
        />
      ))}
    </div>
  );
}
