type Node = { url: string; title: string; children?: Node[] };
export const makeTree = (data: Node[]) => {
  const base: Node = { url: "/", title: "root", children: [] };

  for (const node of data) {
    const path = node.url.match(/\/[^\/]+/g);
    let curr = base;

    path?.forEach((e, i) => {
      const currPath = path.slice(0, i + 1).join("");
      const child = curr.children?.find((e) => e.url === currPath);

      if (child) {
        curr = child;
      } else {
        const n = {
          ...node,
          url: currPath,
        };
        if (curr.children) {
          curr.children.push(n);
        } else {
          curr.children = [n];
        }
        curr = curr.children![curr.children!.length - 1];
      }
    });
  }

  return base.children;
};
