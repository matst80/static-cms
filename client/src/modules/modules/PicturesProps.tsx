import { Image } from "slask-cms";
import { CmsImage } from "./CmsImage";

type PicturesProps = {
  pictures?: (Image & { id?: string })[];
  className?: string;
};

export function Pictures({ pictures, className }: PicturesProps) {
  return (
    (
      <>
        {pictures?.map(({ id, ...pic }) => (
          <CmsImage className={className} key={id} {...pic} />
        ))}
      </>
    ) ?? null
  );
}
