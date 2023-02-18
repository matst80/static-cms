import React from "react";
import { useEditor } from "@craftjs/core";

export const Topbar = () => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div>
      <button
        onClick={() => {
          console.log(JSON.parse(query.serialize()));
        }}
      >
        Serialize JSON to console
      </button>
    </div>
  );
};
