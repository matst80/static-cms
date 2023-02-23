import { BaseModule } from ".";

export default function SearchResult(props: SearchResultProps) {
  return null;
}

export type SearchResultProps = BaseModule<{
  subHeadline?: string;
  factfinderFilter?: string[];
  factfinderParameter?: string;
}>;
