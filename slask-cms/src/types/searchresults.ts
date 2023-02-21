export interface SearchResults<T = Record<string, unknown>> {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits<T>;
}

export interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface Hits<T> {
  total: Total;
  max_score: number;
  hits: Hit<T>[];
}

export interface Hit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  [key: string]: unknown;
  "@timestamp": string;
  _source: Source<T>;
}

export type Source<T> = T & {
  "@timestamp": string;
  [key: string]: unknown;
};

export interface Total {
  value: number;
}
