import { BaseModule, CmsModuleProps } from ".";

import { PropsWithChildren } from "react";
import { Pictures } from "./PicturesProps";
import { DetailsBlock } from "./DetailsBlock";
import { Link } from "react-router-dom";
import { ModuleProps } from "slask-cms";

export type ItemHeaderProps = ModuleProps<CmsModuleProps> & {
  imageClassName?: string;
  indentText?: boolean;
  showImage?: boolean;
};

export function ItemHeader({
  images = [],
  showImage = true,
  imageClassName = "object-cover",
  indentText,
  headline,
  detailTextJson,
}: ItemHeaderProps) {
  const hasHeadline = headline?.length;
  const hasTextContent = hasHeadline || !!detailTextJson;

  return (
    <>
      {showImage && <Pictures pictures={images} className={imageClassName} />}
      {hasTextContent ? (
        <div className={indentText ? "pt-10 px-20" : "pt-10"}>
          {hasHeadline && <h2>{headline}</h2>}
          <DetailsBlock detailTextJson={detailTextJson} />
        </div>
      ) : null}
    </>
  );
}

export function LinkItemHeader({
  id,
  props = {},
  links = [],
  images,
  showImage = true,
  headline,
  imageClassName = "object-cover",
}: ContentSettingsProps) {
  const [link] = links;
  return (
    <>
      {showImage && <Pictures pictures={images} className={imageClassName} />}
      <span className="mt-6 font-body font-bold text-blue-400 text-center text-sm">
        {link?.caption ?? link?.title ?? headline ?? null}
      </span>
    </>
  );
}

export type ContentSettingsProps = ModuleProps<CmsModuleProps> & {
  itemClassName: string;
  imageClassName?: string;
  indentText?: boolean;
  showImage?: boolean;
};

export function ButtonLinkContent(
  item: ContentSettingsProps & {
    itemContent?: (data: ContentSettingsProps) => JSX.Element;
  }
) {
  const {
    //id,
    itemContent,
    itemClassName,
    modules: items,
  } = item;
  // const {

  //   moduleType,
  //   //links = [],
  // } = props ?? {};
  // if (items && hasCmsModule(moduleType)) {
  //   return <ModuleChooser {...item} moduleType={moduleType} />;
  // }
  //const [link] = links;
  const content = itemContent ? itemContent(item) : ItemHeader(item);
  return (
    <div className={itemClassName}>
      {content}
      {/* {link ? (
        <Link className="btn btn--trd" href={link.href ?? ""} key={id}>
          {link.caption ?? link.title}
        </Link>
      ) : null} */}
    </div>
  );
}

export function ConditionalLink({
  links = [],
  className,
  children,
  id,
}: ModuleProps<CmsModuleProps> & PropsWithChildren & { className: string }) {
  const [link] = links;
  return link ? (
    <Link className={className} to={link.href}>
      {children ?? link.caption}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function ItemContent(
  item: ContentSettingsProps & {
    itemContent?: (data: ContentSettingsProps) => JSX.Element;
  }
) {
  const { itemContent, itemClassName } = item; //moduleType, modules
  // if (modules && hasCmsModule(moduleType)) {
  //   return renderModule(moduleType, item);
  // }

  const content = itemContent ? itemContent(item) : ItemHeader(item);
  return (
    <ConditionalLink {...item} className={itemClassName}>
      {content ?? <p>missing stuff</p>}
    </ConditionalLink>
  );
}
