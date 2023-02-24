import { FieldEditor } from "../editor-types";
import { getBlock } from "../../utils/getBlock";
import { useEffect, useRef, useState } from "react";
import { Block, Node } from "slask-cms";

type EditorState = {
  nodes: Block;
  selection: Selection | null;
};
const createEditorState = (content?: Block): EditorState => {
  return { nodes: content ?? { name: "div" }, selection: null };
};
type TextEditorProps = {
  state: EditorState;
  onChange: (data: EditorState) => void;
};

const parseNodes = (node: ChildNode | HTMLElement): Node | Block => {
  if (node.nodeType === 3) {
    return { data: node.textContent } as Node;
  }
  const elm = node as HTMLElement;
  console.log(elm.nodeType, elm.tagName, elm);
  return {
    name: elm.tagName?.toLowerCase(),
    children: Array.from(elm.childNodes).map(parseNodes),
  };
};

const TextEditor = ({ state, onChange }: TextEditorProps) => {
  const { nodes } = state;
  const editor = useRef<HTMLElement>();

  const initEditor = (parent: HTMLDivElement) => {
    const elm = parent?.childNodes[0] as HTMLElement;
    if (elm != editor.current && elm) {
      editor.current = elm;

      elm.contentEditable = "true";
      elm.addEventListener("input", (e) => {
        console.log("input");
        const blocks = parseNodes(elm);
        console.log(blocks, nodes);
      });
      elm.addEventListener("mouseup", (e) => {
        //console.log(e);
      });

      elm.ownerDocument.addEventListener("selectionchange", (e) => {
        const sel = window.getSelection();
        onChange({ nodes, selection: sel });
        if (sel?.getRangeAt && sel.rangeCount) {
          const node = sel.getRangeAt(0).commonAncestorContainer.parentNode;
          //console.log(node);
        }
      });
    }
  };
  return <div ref={initEditor}>{getBlock(nodes)}</div>;
};

export const RichTextEditor: FieldEditor<any> = ({ data, onChange }) => {
  const [state, setState] = useState(createEditorState(data));
  return (
    <div>
      <TextEditor state={state} onChange={setState} />
    </div>
  );
};
