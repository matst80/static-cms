import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { PageModule } from "slask-cms";
import { FieldEditorProps, Schema } from "../editors/editor-types";

type EditingContext<T> = {
  state: EditingState;
  setState: (data: EditingState) => void;
  onChange: (data: T) => void;
};

type EditingState = {
  selected?: {
    schema: Schema<HasId>;
    data: HasId;
  };
};

export type HasId = {
  id?: string;
  [key: string]: unknown;
};

type EditorElement = HTMLElement & {
  _cmsinit: number;
};

const EditorContext = createContext<EditingContext<PageModule[]> | null>(null);

export function useEditor<T extends HasId, TSchema extends HasId>(
  data: T,
  schema: Schema<TSchema>
) {
  const ctx = useContext(EditorContext);
  const selectListener = (e: Event) => {
    e.stopPropagation();
    ctx?.setState({
      ...ctx.state,
      selected: { data, schema: schema as Schema<HasId> },
    });
  };

  return (ref: HTMLElement | null) => {
    if (!ref) return;
    const elm = ref as EditorElement;
    if (!elm._cmsinit) {
      elm._cmsinit = 1;

      elm.addEventListener("click", selectListener);
    }
  };
}

export function useSelected<T extends HasId>() {
  const ctx = useContext(EditorContext);
  const result = useMemo(() => {
    const onChange = (data: T | undefined) => {
      ctx?.setState({
        ...ctx.state,
        selected: { ...ctx.state.selected, data } as any,
      });
    };
    const { data, schema } = ctx?.state.selected ?? {};
    return {
      data: data as T,
      schema: schema as Schema<T>,
      onChange,
    };
  }, [ctx]);
  return result;
}

export default function Editor({ children }: PropsWithChildren) {
  const [state, setState] = useState<EditingState>({});
  const ctx = useMemo(() => {
    return { state, setState, onChange: console.log };
  }, [state, setState]);
  return (
    <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
  );
}
