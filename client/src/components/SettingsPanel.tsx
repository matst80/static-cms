import { useEditor } from "@craftjs/core";
import React from "react";

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        isDeletable: query.node(currentNodeId).isDeletable(),
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
      };
    }

    return {
      selected,
    };
  });
  return (
    <div>
      <h2>Settings</h2>
      {selected?.settings && React.createElement(selected.settings)}
    </div>
  );
};
