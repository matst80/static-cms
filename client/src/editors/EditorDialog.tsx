import { useState } from "react";
import {
  Dialog,
  DialogProps,
  DialogButtons,
  ButtonFunction,
  curryButtons,
} from "./Dialog";

type Editor<T extends Record<string, unknown>> = (props: {
  data: T;
  onChange: (data: T | undefined) => void;
}) => JSX.Element | null;

export function EditorDialog<T extends Record<string, unknown>>({
  data,
  Editor,
  onChange,
  onClose,
  buttons,
  children,
  open,
}: EditorDialogProps<T>) {
  return (
    <Dialog open={open} onClose={onClose} buttons={buttons}>
      <Editor data={data} onChange={onChange} />
      {children}
    </Dialog>
  );
}
type EditorDialogProps<T extends Record<string, unknown>> = DialogProps & {
  data: T;
  ignoredFields?: (keyof T)[];
  onChange: (data: T | undefined) => void;
  Editor: Editor<T>;
};

export function useEditorDialog<T extends Record<string, unknown>>(
  initialValue: T,
  buttons: DialogButtons<T>,
  editor: Editor<T>
) {
  const [data, setData] = useState<T>(initialValue ?? ({} as T));
  const [open, setOpen] = useState<boolean>(false);
  const convertedButtons = curryButtons(buttons, (fn) => () => fn(data));

  const dialog = (
    <EditorDialog
      open={open}
      data={data}
      buttons={convertedButtons}
      onChange={(d) => {
        setData(d ?? initialValue);
      }}
      Editor={editor}
      onClose={() => setOpen(false)}
    ></EditorDialog>
  );
  return { setOpen, dialog };
}
