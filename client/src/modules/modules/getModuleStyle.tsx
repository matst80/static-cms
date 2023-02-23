import { BaseModule } from "services";
import { CSSProperties } from "react";

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
  const { style } = settings;
  if (style) {
    const { backgroundColor, color, detailTextColor } = style;
    return removeEmpty({ color, backgroundColor, "--txt": detailTextColor });
  }
  return undefined;
};
