export const changeHandlerFactory =
  <T>(
    data: T | undefined,
    afterChange: (data: T) => void
  ) =>
  (field: keyof T) =>
  (value: T[typeof field]|React.ChangeEvent<HTMLInputElement>|undefined) => {
    if (!data) return;
    const v =
      (value as React.ChangeEvent<HTMLInputElement>).target?.value as T[typeof field] ?? value;
    afterChange({ ...data, [field]: v });
  };
