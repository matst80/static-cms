import { Block, PageModule, PageModuleWithProps } from "slask-cms";
import Accordion from "./Accordion";
import ArticleList from "./ArticleList";
import CategoryCarousel from "./CategoryCarousel";
import CategoryCollection from "./CategoryCollection";
import ContentCarousel from "./ContentCarousel";
import HeroMedia from "./HeroMedia";
import HeroMediaSpots from "./HeroMediaSpots";
import Intro from "./Intro";
import MediaText from "./MediaText";
import ProductCarousel from "./ProductCarousel";
import SearchResults from "./SearchResults";
import StickyHeader from "./StickyHeader";
import TagCloud from "./TagCloud";
import TextOnly from "./TextOnly";
import Tiles from "./Tiles";
import { UglyHtml } from "./UglyHtml";

export type CmsModuleProps<T = Record<string, unknown>> = T & {
  headline?: string;
  html?: string;
  detailTextJson?: Block;
};

export type CmsSettings = {
  backgroundColor?: string;
  color?: string;
  gutters?: boolean;
  configuration?: string;
  detailTextColor?: string;
  columns?: string;
};

export type BaseModule<T = Record<string, unknown>> = PageModuleWithProps<
  CmsModuleProps<T>,
  CmsSettings
>;

export const cmsModules = {
  "category-carousel": CategoryCarousel,
  "hero-media-spots": HeroMediaSpots,
  tiles: Tiles,
  html: UglyHtml,
  "content-carousel": ContentCarousel,
  "hero-media": HeroMedia,
  "category-collection": CategoryCollection,
  "product-carousel": ProductCarousel,
  "media-text": MediaText,
  "sticky-header": StickyHeader,
  intro: Intro,
  "text-only": TextOnly,
  "tag-cloud": TagCloud,
  "article-list": ArticleList,
  "search-result": SearchResults,
  accordion: Accordion,
};

type CmsModuleKeys = keyof typeof cmsModules;

export const hasCmsModule = (type: CmsModuleKeys | string): boolean => {
  return !!(cmsModules as Record<string, unknown>)[type];
};

export default function renderModule<T extends PageModule>(
  type: CmsModuleKeys | string,
  data: T
): JSX.Element | null {
  if (!type) {
    return null;
  }
  // if (data.factfinderFilter) {
  //   console.log("has factfinder", type);
  // }
  return hasCmsModule(type)
    ? cmsModules[type as CmsModuleKeys](data as any)
    : null;
}
