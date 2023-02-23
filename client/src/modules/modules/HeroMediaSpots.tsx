import { BaseModule } from ".";
import { CmsImage } from "./CmsImage";
import { ItemContent } from "./ItemContent";

const Swipe = (props: BaseModule & { className: string }) => {
  const { images = [], links = [], className } = props;
  const [link] = links;
  const [pic] = images;
  return link ? (
    <a className={className} {...link}>
      <CmsImage className={className} {...pic} />
    </a>
  ) : (
    <CmsImage className={className} {...pic} />
  );
  // const children = pictures?.map(({ id, responsiveViewType, ...pic }) => (
  // 	<CmsImage className="object-fill" key={id} {...pic} />
  // ))

  // return <div className={className}>{children}</div>
};

const BannerSpots = (data: BaseModule) => {
  const { modules: [main, quad] = [], settings } = data;
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6 banner-spots">
      <div className="overflow-hidden flex-grow">
        <div className="flex flex-nowrap">
          {main.modules?.map((item) => (
            <Swipe key={item.id} {...item} className="w-full flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="lg:grid lg:grid-rows-2 lg:grid-cols-2 lg:gap-6">
        {quad.modules?.map((item) => (
          <Swipe key={item.id} {...item} className="object-contain" />
        ))}
      </div>
    </div>
  );
};

export default function HeroMediaSpots(data: BaseModule) {
  const { modules, settings } = data;
  // if (modules?.length === 2 && viewType === "hero-banner-spots") {
  //   return BannerSpots(data);
  // }

  return (
    <div className={"w-full overflow-x-auto"}>
      <div className="flex flex-nowrap">
        {modules?.map((item) => (
          <ItemContent
            itemClassName="flex flex-col modules-center"
            imageClassName="object-cover"
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
