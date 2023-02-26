import { FieldEditor } from "../editor-types";
import { getBlock } from "../../utils/getBlock";
import { useEffect, useRef, useState } from "react";
import { Block, Node } from "slask-cms";
import { surroundSelection } from "./utils/selection";

type EditorState = {
  nodes: Block;
  selectedNode: ParentNode | null;
  selection: Selection | null;
};
const createEditorState = (content?: Block): EditorState => {
  return {
    nodes: content ?? { name: "div", _type: "block" },
    selection: null,
    selectedNode: null,
  };
};
type TextEditorProps = {
  state: EditorState;
  onChange: (data: EditorState) => void;
};

const parseNodes = (node: ChildNode | HTMLElement): Node | Block => {
  if (node.nodeType === 3) {
    return { _type: "text", data: node.textContent } as Node;
  }
  const elm = node as HTMLElement;
  console.log(elm.nodeType, elm.tagName, elm);
  return {
    _type: "block",
    name: elm.tagName?.toLowerCase(),
    children: Array.from(elm.childNodes).map(parseNodes),
  };
};

const toggle = (tagName: string, selection: Selection | null) => {
  const elm = document.createElement(tagName);
  const range = selection?.getRangeAt(0);
  if (selection && range) {
    const selParent = selection.anchorNode?.parentElement;
    const selectedElem =
      selParent?.nodeType == 1 && selParent?.children.length < 2
        ? selParent
        : null;
    console.log(selection.anchorNode, selParent, selectedElem);
    if (selectedElem?.tagName === elm.tagName) {
      selectedElem.replaceWith(...selectedElem.childNodes);
    } else {
      range.surroundContents(elm);
      //selection.collapse(elm);
      selection.removeAllRanges();
      //range.selectNode(elm);

      selection.addRange(range);
      range.collapse();
    }
  }
};

const TextBlockEditor = ({ state, onChange }: TextEditorProps) => {
  const { nodes } = state;
  const editor = useRef<HTMLElement>();

  const initEditor = (parent: HTMLDivElement) => {
    const elm = parent?.childNodes[0] as HTMLElement;
    if (elm != editor.current && elm) {
      editor.current = elm;

      elm.contentEditable = "true";
      elm.addEventListener("input", (e: Event) => {
        console.log("input");
        const blocks = parseNodes(elm);
        console.log(blocks, nodes);
      });
      elm.addEventListener("mouseup", (e: Event) => {
        //console.log(e);
      });

      elm.ownerDocument.addEventListener("selectionchange", (e) => {
        const sel = window.getSelection();
        console.log("selection change");
        let node = state.selectedNode;
        if (sel?.getRangeAt && sel.rangeCount) {
          node = sel.getRangeAt(0).commonAncestorContainer.parentNode;
        }
        onChange({ nodes, selection: sel, selectedNode: node });
      });
    }
  };
  return (
    <div>
      <div>
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();

            const { selection } = state;
            toggle("strong", selection);
            //editor.current?.focus();
            return false;
          }}
        >
          bold
        </button>
      </div>
      <div ref={initEditor}>{getBlock(nodes)}</div>
    </div>
  );
};

export const RichTextEditor: FieldEditor<Block | undefined> = ({
  data,
  onChange,
}) => {
  const [state, setState] = useState(createEditorState(data));
  useEffect(() => {
    if (data && state.nodes != data) {
      setState({ ...state, nodes: data });
    }
  }, [data]);
  return (
    <div>
      <TextBlockEditor state={state} onChange={setState} />
    </div>
  );
};
