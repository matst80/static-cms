import { useState } from "react";
import { useQuery } from "react-query";
import { Page, PageModule } from "slask-cms";
import { mutatePage } from "./useCms";
import { stop } from "./utils";

const baseUrl = "/blueprint/servlet/service";

const locale = "elgiganten-se-sv";
const appMode = "b2c";

const getCoreMediaPage = (uri: string) =>
  fetch(`${baseUrl}/page/${locale}${uri}?targetGroup=${appMode}`, {})
    .then((d) => d.json())
    .then((d) => {
      console.log(d);
      return convertPage(d.page);
    });

export const fixRelativeImage = (uri: string | undefined) => {
  if (uri == null) return undefined;
  return uri
    .replace("https://elgiganten-se-ecomistst.elkjop.com", "")
    .replace("https://www.elgiganten.se", "");
};

const sizesMedia: Record<string, string> = {
  desktop: "(min-width: 1280px)",
  tablet: "(min-width: 768px)",
  mobile: "(max-width: 768px)",
};

const convertImageUri = ({ breakpoint, images, sizes }: any) => {
  const srcset = images
    .map(({ width, imageURL }: any) => {
      return `${fixRelativeImage(imageURL)} ${width}w`;
    })
    .join(", ");
  return { media: sizesMedia[breakpoint] ?? "", srcset, sizes };
};

export const convertPicture = ({
  uris,
  isExternalPicture,
  id,
  ...rest
}: any) => {
  const mainImages = uris.find((d) => d.breakpoint === "desktop");
  const sortedBySize = mainImages?.images.sort((a, b) => b.width - a.width);
  const src = fixRelativeImage(sortedBySize?.[0]?.imageURL) ?? "";
  const size: [width: number, height: number] = [
    sortedBySize?.[0].width ?? 0,
    sortedBySize?.[0].height ?? 0,
  ];
  if (isExternalPicture) {
    return {
      id,
      ...rest,
      size,
      src,
    };
  }
  return {
    id,
    ...rest,
    src,
    size,
    uris: uris.map(convertImageUri),
  };
};
const prefixes = [
  "elgiganten-se-sv",
  "elgiganten-dk-da",
  "gigantti-fi-fi",
  "elkjop-no-no",
];
const rootUrl = "/";
const notPrefix = (part: string) => !prefixes.includes(part);

export const convertInternalPathToHref = (path?: string[]) =>
  rootUrl + path?.filter(notPrefix).join("/") ?? "";

export const convertLink = ({ internal, external, ...rest }: any) => {
  const href = external
    ? external.url
    : convertInternalPathToHref(internal?.path);
  return { ...rest, href };
};

const isValidLink = (link: any) =>
  !!(link?.internal?.path || link?.external?.url);

const convertModule = ({
  id,
  moduleType,
  dyDisableDefaultResults,
  detailText,
  doctype,
  settings,
  pictures,
  validFrom,
  validTo,
  links,
  items,
  ...props
}: any): PageModule => {
  //console.log(props);
  const { style, ...other } = settings ?? {};
  return {
    id: id?.replace("contentbean:", ""),
    images: pictures?.map(convertPicture),
    props,
    links: links?.filter(isValidLink).map(convertLink),
    settings: {
      ...other,
      ...style,
      validFrom: validFrom ? new Date(validFrom).getTime() : undefined,
      validTo: validTo ? new Date(validTo).getTime() : undefined,
    },
    type: moduleType,
    modules: items?.map(convertModule),
  };
};

const convertPage = ({
  placements,
  seoTitle,
  seoDescription,
  teaserImage,
  teaserTextJson,
  teaserTitle,
  path,
  type,
  ...rest
}: any): Page => {
  console.log(rest);
  return {
    seoTitle,
    seoDescription,
    type,
    url: path?.slice(1).join("/") ?? "/",
    teaser: {
      image: teaserImage,
      text: teaserTextJson,
      title: teaserTitle,
    },
    modules: placements
      .filter((d: any) => d.modules?.length)
      ?.map((d: any) => d.modules.map(convertModule))
      .flat(),
  };
};

export default function Importer() {
  const { mutate } = mutatePage();
  const [url, setUrl] = useState<string>("/kundtjanst");
  const { data } = useQuery("cm" + url, () => getCoreMediaPage(url), {
    enabled: !!url.length,
    refetchInterval: 36000,
  });

  return (
    <div>
      <input value={url} onChange={(e) => setUrl(e.target.value)} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button
        className="btn"
        onClick={stop(() => (data ? mutate(data) : console.log("BAJS")))}
      >
        Save
      </button>
    </div>
  );
}
