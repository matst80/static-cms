import React from "react";
import { Element, useEditor } from "@craftjs/core";

export const Toolbox = () => {
  const { connectors, query } = useEditor();
  return (
    <div>
      {/* <div style={{ display: "flex" }}>
        <div>
          <span>Drag to add</span>
        </div>
        <div>
          <button
            ref={(ref) =>
              connectors.create(ref, <Button text="Click me" size="small" />)
            }
          >
            Button
          </button>
        </div>
        <div>
          <button
            ref={(ref) => connectors.create(ref, <Text text="Click me" />)}
          >
            Text
          </button>
        </div>
        <div>
          <button
            ref={(ref) =>
              connectors.create(
                ref,
                <Element is={Container} padding={20} canvas />
              )
            }
          >
            Container
          </button>
        </div>
        <div>
          <button ref={(ref) => connectors.create(ref, <Card />)}>Card</button>
        </div>
      </div> */}
    </div>
  );
};
