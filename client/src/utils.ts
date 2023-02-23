import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const changeHandlerFactory =
  <T, R>(data: T, afterChange: (data: T) => void) =>
  (field: keyof NonNullable<T>) =>
  (value: R) => {
    afterChange({ ...data, [field]: value });
  };

export function stop<T extends SyntheticEvent>(fn: (d: T) => void) {
  return (e: T) => {
    e.preventDefault();
    e.stopPropagation();
    fn(e);
  };
}

const stopProp = (e: MouseEvent) => {
  e.stopPropagation();
};

export function usePopup() {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<any>();
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  useEffect(() => {
    if (ref.current) {
      const elm = ref.current;
      elm.addEventListener("click", stopProp);
      globalThis.document.body.addEventListener("click", close);
      return () => {
        globalThis.document.body.removeEventListener("click", close);
        elm?.removeEventListener("click", stopProp);
      };
    }
    globalThis.document.body.addEventListener("click", close);
    return () => {
      globalThis.document.body.removeEventListener("click", close);
    };
  }, [ref]);
  return { open, setOpen, ref };
}
