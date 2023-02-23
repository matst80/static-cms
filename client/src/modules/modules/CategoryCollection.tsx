import { BaseModule } from ".";
import { ItemContent, LinkItemHeader } from "./ItemContent";
import { composeModuleClass } from "./Tiles";
const grayPlpListing = "plp category listing";
export default function CategoryCollection({ modules, settings }: BaseModule) {
  const { configuration } = settings;
  const isGray = configuration === grayPlpListing;
  const itemClassName = [
    "flex flex-col items-center",
    isGray ? "bg-gray-100 flex-1 p-4 blend-mul" : "flex-1",
  ].join(" ");

  return (
    <div className={composeModuleClass({ settings })}>
      <div className="flex gap-8 flex-wrap">
        {modules?.map((item) => (
          <ItemContent
            itemClassName={itemClassName}
            itemContent={LinkItemHeader}
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
