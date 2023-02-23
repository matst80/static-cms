import { BaseModule } from ".";
import { ItemContent } from "./ItemContent";
import { composeModuleClass } from "./Tiles";

export default function HeroMedia(data: BaseModule) {
  const { modules, settings } = data;

  return (
    <div className={composeModuleClass(data, "overflow-x-hidden")}>
      <div className="flex flex-nowrap">
        {modules?.map((item) => (
          <ItemContent
            {...item}
            indentText={!settings.gutters}
            itemClassName="flex flex-shrink-0 w-full flex-col"
            key={item.id}
          />
        ))}
      </div>
    </div>
  );
}
