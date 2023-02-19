import { SyntheticEvent } from "react"

export const changeHandlerFactory =
  <T,R>(
    data: T | undefined,
    afterChange: (data: T) => void
  ) =>
  (field: keyof T) =>
  (value: R) => {
    if (!data) return;
    const v =
      (value as React.ChangeEvent<HTMLInputElement>).target?.value as R ?? value;
    afterChange({ ...data, [field]: v });
  };

export function stop<T extends SyntheticEvent<any>>(fn: (d: T) => void) {
  return (e: T) => {
    e.preventDefault();
    e.stopPropagation();
    fn(e);
  };
}
