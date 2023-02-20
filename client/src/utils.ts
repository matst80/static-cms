import { SyntheticEvent } from "react"

export const changeHandlerFactory =
  <T,R>(
    data: T,
    afterChange: (data: T) => void
  ) =>
  (field: keyof NonNullable<T>) =>
  (value: R) => {
    afterChange({ ...data, [field]: value });
  };

export function stop<T extends SyntheticEvent<any>>(fn: (d: T) => void) {
  return (e: T) => {
    e.preventDefault();
    e.stopPropagation();
    fn(e);
  };
}
