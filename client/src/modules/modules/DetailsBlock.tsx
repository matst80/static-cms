import { Block, Link } from "slask-cms";
import { getBlock } from "../../utils/getBlock";

export const CmsLink = ({
  href,
  caption,
  title,
  className,
}: Link & { className?: string }) => {
  <a className={className} href={href}>
    {caption ?? title}
  </a>;
};

type DetailsBlockProps = {
  detailTextJson?: Block;
  detailText?: string;
  links?: Link[];
};
export const DetailsBlock = ({
  detailTextJson,
  detailText,
  links,
}: DetailsBlockProps) => {
  if (!detailText && !detailTextJson && !links) return null;
  return (
    <>
      {detailTextJson ? getBlock(detailTextJson) : <p>{detailText}</p>}
      {links?.map((link) => (
        <a className="btn btn--trd my-8" key={link.href} href={link.href}>
          {link.caption ?? link.title}
        </a>
      ))}
    </>
  );
};
