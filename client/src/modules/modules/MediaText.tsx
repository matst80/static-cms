import { BaseModule } from ".";
import { DetailsBlock } from "./DetailsBlock";
import { ConditionalLink, ItemHeader } from "./ItemContent";
import { Pictures } from "./PicturesProps";
import { composeModuleClass } from "./Tiles";

export default function MediaText({ modules, props, ...rest }: MediaTextProps) {
  const children = modules?.map((item) => {
    const { id, links = [], images } = item;
    const [link] = links;
    return (
      <ConditionalLink
        {...item}
        className="flex flex-col items-center"
        key={id}
      >
        <span className="flex flex-1">
          <Pictures pictures={images} className="object-cover" />
        </span>
        <span className="mt-6 flex-1 font-body font-bold text-blue-400 text-center text-sm">
          {link ? link.caption ?? link.title : <DetailsBlock {...item} />}
        </span>
      </ConditionalLink>
    );
  });
  console.log(rest);
  return (
    <div className={composeModuleClass(rest, "overflow-x-hidden")}>
      <div className="flex gap-8 flex-nowrap items-center">
        {children?.length ? (
          children
        ) : (
          <ItemHeader {...rest} {...props} imageClassName="cover" />
        )}
      </div>
    </div>
  );
}

export type MediaTextProps = BaseModule;
