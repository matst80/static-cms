import { CSSProperties } from "react";
import { Image } from "slask-cms";
import { BaseModule } from ".";
import { getModuleStyle } from "./getModuleStyle";

const getBackgroundStyle = (pictures?: Image[]) => {
  return pictures?.length
    ? {
        backgroundImage: `url(${pictures[0].src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }
    : {};
};

const PlpPlaceholder = () => {
  return (
    <div className="tiles animate-pulse flex overflow-x-hidden bg-white">
      <div className="tile">&nbsp;</div>
      <div className="tile">&nbsp;</div>
      <div className="tile">&nbsp;</div>
      <div className="tile">&nbsp;</div>
      <div className="tile">&nbsp;</div>
    </div>
  );
};

export default function ProductCarousel({
  props = {},
  images = [],
  settings,
  links = [],
}: ProductCarouselProps) {
  const { subHeadline, headline, factfinderFilter, factfinderParameter } =
    props;
  const style: CSSProperties = {
    ...getModuleStyle({ settings }),
    ...getBackgroundStyle(images),
  };
  const [link] = links;
  const linkElement = link ? (
    <a className="btn btn--trd my-6" href={link.href}>
      {link.caption}
    </a>
  ) : null;
  const hasLeftBox = style.backgroundImage || style.backgroundColor;
  return (
    <div className="p-14 pr-0" style={style}>
      {headline ? (
        <div className="flex mr-14">
          <h2 className="text-4xl flex-1">{headline}</h2>
          {subHeadline ? null : linkElement}
        </div>
      ) : null}
      <div className="flex flex-wrap md:flex-nowrap py-6">
        {hasLeftBox ? (
          <div className="p-12 pl-0 min-w-[20rem]">
            <h3 className="text-2xl">{subHeadline}</h3>
            {subHeadline ? linkElement : null}
          </div>
        ) : null}

        <pre>{factfinderFilter}</pre>
      </div>
    </div>
  );

  // const headerItem =
  //   headline && detailText ? (
  //     <div>
  //       {headline ? <h2 className="text-2xl">{headline}</h2> : null}
  //       {detailTextJson ? getBlock(detailTextJson) : null}
  //     </div>
  //   ) : null;
  // return (
  //   <div className="flex" style={getModuleStyle({ settings })}>
  //     {headerItem}
  //     <div className="w-full overflow-x-auto">
  //       <div className="flex flex-nowrap">{children}</div>
  //     </div>
  //   </div>
  // );
}

export type ProductCarouselProps = BaseModule<{
  subHeadline?: string;
  factfinderFilter?: string[];
  factfinderParameter?: string;
}>;
