import { NavigationNode } from "@toolkit/chrome";

export const InternalUrlPrefix = "merchant://";

type ResultType =
  | "page"
  | "admin_page"
  | "recent_page"
  | "merchant"
  | "frequent_page"
  | "order"
  | "product"
  | "fine_display_item"
  | "warning"
  | "zendesk"
  | "tracking_dispute";

const TypeNameMap: { [key in ResultType]: string } = {
  page: i`Pages`,
  admin_page: i`Wish Operations`,
  order: i`Orders`,
  product: i`Products`,
  fine_display_item: i`Penalties`,
  warning: i`Infractions`,
  zendesk: i`FAQ`,
  tracking_dispute: i`Tracking Disputes`,
  recent_page: i`Recently Visited`,
  frequent_page: i`Most Visited`,
  merchant: i`Merchants`,
};

type FlattenedNode = {
  readonly node: NavigationNode;
  readonly parents: ReadonlyArray<NavigationNode>;
};

export type WeightedNode = FlattenedNode & {
  readonly weight: number;
};

type SearchResultPayloadType = WeightedNode | undefined;

export type NavigationSearchResult = {
  readonly url: string;
  readonly type: ResultType;
  readonly title: string;
  readonly description?: null | string;
  readonly image_url?: null | string;
  readonly keywords?: ReadonlyArray<string>;
  readonly breadcrumbs?: ReadonlyArray<string>;
  readonly search_phrase?: string;
  readonly open_in_new_tab?: boolean;
  readonly nuggets?: ReadonlyArray<string | null>;
  readonly weight?: number;
  readonly payload?: SearchResultPayloadType;
};

export type SearchResultGroup = {
  readonly title: string;
  readonly type: ResultType;
  readonly results: ReadonlyArray<NavigationSearchResult>;
};

type HistoryState = {
  readonly pathOnly: string;
  readonly fullPath: string;
};
