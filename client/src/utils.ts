export const changeHandlerFactory =
  <T extends Record<string, unknown>, R extends unknown>(
    data: T | undefined,
    afterChange: (data: T) => void
  ) =>
  (field: keyof T) =>
  (value: R | React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    const v =
      (value as React.ChangeEvent<HTMLInputElement>).target?.value ?? value;
    afterChange({ ...data, [field]: v });
  };
