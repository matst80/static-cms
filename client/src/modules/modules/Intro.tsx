import { BaseModule } from ".";
import { getBlock } from "../../utils/getBlock";
import { getModuleStyle } from "./getModuleStyle";

export default function Intro({ props = {}, settings }: IntroProps) {
  const { headline, detailTextJson } = props;
  return (
    <div style={getModuleStyle({ settings })}>
      <h2>{headline ?? ""}</h2>
      {detailTextJson ? getBlock(detailTextJson) : null}
    </div>
  );
}

type IntroProps = BaseModule<{
  headline?: string;
}>;
