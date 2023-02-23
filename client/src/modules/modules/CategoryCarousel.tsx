import { BaseModule } from ".";
import { ItemContent, LinkItemHeader } from "./ItemContent";

export default function CategoryCarousel({ modules }: CategoryCarouselProps) {
  // const children = items?.map((item) => {
  //   const { id, links, pictures } = item;
  //   if (!links?.length) {
  //     return null;
  //   }
  //   const [link] = links;
  //   return (
  //     <Link
  //       className="flex flex-col w-52 items-center"
  //       href={link?.href ?? ""}
  //       key={id}
  //     >
  //       {pictures?.map(({ id, ...pic }) => (
  //         <CmsImage className="object-cover w-20 h-20" key={id} {...pic} />
  //       ))}
  //       <span className="mt-6 font-body font-bold text-blue-400 text-center text-sm">
  //         {link.caption ?? link.title}
  //       </span>
  //     </Link>
  //   );
  // });
  return (
    <div className="flex flex-nowrap overflow-x-auto justify-center">
      <div className="flex">
        {modules?.map((item) => (
          <ItemContent
            itemClassName="flex flex-col w-52 items-center"
            itemContent={LinkItemHeader}
            imageClassName="object-cover w-20 h-20"
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export type CategoryCarouselProps = BaseModule;
