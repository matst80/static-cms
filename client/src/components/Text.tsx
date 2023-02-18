import { useNode } from "@craftjs/core"
import React from "react";

export const Text = ({text, fontSize}:any) => {
  const { connectors: {connect, drag} } = useNode();
	return (
      <div ref={ref => connect(drag(ref as HTMLElement))}>
         <p style={{fontSize}}>{text}</p>
      </div>
  )
}