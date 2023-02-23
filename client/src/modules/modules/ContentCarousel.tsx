import { ButtonLinkContent, ItemContent } from "./ItemContent";
import { getModuleStyle } from "./getModuleStyle";
import { BaseModule } from ".";
import { getBlock } from "../../utils/getBlock";
import { composeModuleClass } from "./Tiles";

export default function ContentCarousel(item: ContentCarouselProps) {
  const { modules, props = {}, settings } = item;
  const { headline, detailText, detailTextJson } = props;
  const headerItem =
    headline && detailText ? (
      <div className="flex-shrink flex-auto p-12">
        <h2 className="text-2xl">{headline}</h2>
        {detailTextJson ? getBlock(detailTextJson) : <p>{detailText}</p>}
      </div>
    ) : null;
  return (
    <div
      className={composeModuleClass(
        item,
        headerItem ? "flex" : "p-12",
        "mx-auto"
      )}
      style={getModuleStyle({ settings })}
    >
      {headerItem}
      <div className="flex-grow overflow-x-auto">
        <div className="flex gap-8 flex-nowrap">
          {modules?.map((item) => {
            return (
              <ButtonLinkContent
                itemClassName="flex flex-col w-96 flex-shrink-0 items-left"
                key={item.id}
                {...item}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type ContentCarouselProps = BaseModule<{
  headline?: string;
  detailText?: string;
}>;
