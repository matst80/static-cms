import { Image, InternalPicture } from "slask-cms";

export const CmsImage = (data: Image & { className?: string }) => {
  if (!data) return null;
  const { className = "object-cover", src, alt, size } = data;
  if (!(data as any).uris) {
    return (
      <img
        className={className}
        src={"https://elgiganten.se" + src}
        alt={alt}
        width={size?.[0]}
        height={size?.[1]}
      />
    );
  }

  return (
    <picture>
      {(data as InternalPicture).uris?.map(({ srcset, media, sizes }) => {
        return (
          <source
            key={media + srcset}
            media={media}
            srcSet={
              "https://elgiganten.se/" +
              srcset.replaceAll(" /", "https://elgiganten.se/")
            }
            sizes={sizes}
          />
        );
      })}
      <img
        className={className}
        alt={alt}
        src={"https://elgiganten.se" + src}
        width={size?.[0]}
        height={size?.[1]}
      />
    </picture>
  );
};
