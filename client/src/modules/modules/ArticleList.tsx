import { BaseModule } from ".";
import { ButtonLinkContent } from "./ItemContent";
import { getGridClassName } from "./Tiles";

export default function ArticleList(data: BaseModule) {
  const { modules, settings, props } = data;
  const { columns = "3" } = settings;

  return (
    <div className={`w-full grid gap-8 ${getGridClassName(Number(columns))}`}>
      {modules?.map((item) => (
        <ButtonLinkContent
          itemClassName="items-center"
          key={item.id}
          {...item}
          {...props}
        />
      ))}
    </div>
  );
}
