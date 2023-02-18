import React, { useEffect } from "react";
import { SerializedNodes, useEditor } from "@craftjs/core";
import { PageModule } from "slask-cms";

export const ModuleChangeHandler = ({
  onChange,
}: {
  onChange: (data: PageModule[]) => void;
}) => {
  const { query, a } = useEditor((state) => ({
    a: state.indicator,
  }));

  useEffect(() => {
    const nodes = query.getSerializedNodes();
    if (nodes?.ROOT) {
      const modules = convertModules(nodes);
      onChange(modules);
    }
  }, [a]);
  return <></>;
};

const convertModule = (id: string, otherNodes: SerializedNodes): PageModule => {
  const { displayName, props, nodes } = otherNodes[id];
  if (displayName === "Resolver") {
    return props;
  }
  return {
    id,
    type: displayName,
    settings: {},
    props,
    modules: nodes.map((id) => convertModule(id, otherNodes)),
  };
};

const convertModules = (nodes: SerializedNodes): PageModule[] => {
  return convertModule("ROOT", nodes).modules!;
};
