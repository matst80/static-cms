import { CSSProperties } from "react";
import { BaseModule } from ".";

const removeEmpty = (data: object) =>
  Object.entries(data).reduce((all, [key, value]) => {
    if (!value?.length) {
      return all;
    }
    return { ...all, [key]: value };
  }, {});

export const getModuleStyle = ({
  settings,
}: {
  settings: BaseModule["settings"];
}): CSSProperties | undefined => {
  const { backgroundColor, color, detailTextColor } = settings;

  return removeEmpty({ color, backgroundColor, "--txt": detailTextColor });

  return undefined;
};
