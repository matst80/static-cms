export default function PageModule({ modules, onChange, ...rest }: any) {
  const updateModule = (idx: number) => (data: any) => {
    modules[idx] = data;
    onChange(modules);
  };
  return (
    <div style={{ padding: "2rem" }}>
      <pre>{JSON.stringify(rest, null, 2)}</pre>
      {modules?.map((d: any, idx: number) => (
        <PageModule key={d.id} {...d} onChange={updateModule(idx)} />
      ))}
    </div>
  );
}
