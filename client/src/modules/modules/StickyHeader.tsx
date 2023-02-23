import { Link } from "react-router-dom";
import { BaseModule } from ".";
import { getModuleStyle } from "./getModuleStyle";

export default function StickyHeader(props: StickyProps) {
  const { links, props: { headline } = {} } = props;

  return (
    <div
      style={getModuleStyle(props)}
      className="sticky top-0 flex text-center items-center lg:px-20 py-4 justify-center gap-6"
    >
      <h3 className="text-2xl">{headline ?? ""}</h3>
      {links?.map((d) => (
        <Link className="btn" key={d.href} to={d.href}>
          {d.caption || d.title}
        </Link>
      ))}
    </div>
  );
}

type StickyProps = BaseModule;
