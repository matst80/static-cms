import { Link } from "react-router-dom";
import { BaseModule } from ".";
import { composeModuleClass } from "./Tiles";

export default function TagCloud(props: TagCloudProps) {
  const { props: { headline } = {}, modules } = props;
  return (
    <div className={composeModuleClass(props)}>
      <h3>{headline}</h3>
      <div className="flex py-4 flex-wrap">
        {modules
          ?.filter(({ links }) => links?.length)
          .map(({ links: [link] = [] }) => {
            return (
              <Link
                key={link.href}
                className="btn mx-2 mb-4 btn--trd"
                to={link.href ?? ""}
              >
                {link.title ?? link.caption}
              </Link>
            );
          })}
      </div>
    </div>
  );
}

type TagCloudProps = BaseModule;
