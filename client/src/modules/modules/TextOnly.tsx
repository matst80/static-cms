import { BaseModule } from ".";
import { getBlock } from "../../utils/getBlock";
import { composeModuleClass } from "./Tiles";

export default function TextOnly({ props = {}, settings }: BaseModule) {
  const { detailTextJson } = props;
  return (
    <div className={composeModuleClass({ settings })}>
      {detailTextJson ? getBlock(detailTextJson) : null}
    </div>
  );
}
