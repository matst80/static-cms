import React from "react";
import { Button } from "./Button";

export const Toolbox = () => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div>
          <span>Drag to add</span>
        </div>
        <div>
          <Button>Button</Button>
        </div>
        <div>
          <Button>Text</Button>
        </div>
        <div>
          <Button>Container</Button>
        </div>
        <div>
          <Button>Card</Button>
        </div>
      </div>
    </div>
  );
};
