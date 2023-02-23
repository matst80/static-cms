import { BaseModule } from "services";
import { ButtonLinkContent } from "./ItemContent";
import { getGridClassName } from "./Tiles";

export default function ArticleList(data: BaseModule) {
  const { items, settings } = data;
  const { columns = "3" } = settings;

  return (
    <div className={`w-full grid gap-8 ${getGridClassName(Number(columns))}`}>
      {items?.map((item) => (
        <ButtonLinkContent
          itemClassName="items-center"
          key={item.id}
          {...item}
        />
      ))}
    </div>
  );
}
