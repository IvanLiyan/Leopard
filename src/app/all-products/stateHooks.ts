/*
  this file contains hooks powering the state in the all products page
  this state is tracked via query params
  we store the hooks here to have one consolidated place to define the query
  params and to facilitate keeping them synced between files
*/
import {
  useIntQueryParam,
  useStringEnumQueryParam,
  useStringQueryParam,
  useStringSetQueryParam,
} from "@core/toolkit/url";
import {
  ListingEnabledUrlSelection,
  ListingStateUrlSelection,
  ProductBadge,
} from "./toolkit";
import { SortOrder } from "@ContextLogic/lego";
import { ProductSearchType, ProductSortField } from "@schema";

// the below hook powers the state for the select in the product search bar
export const useSearchType = (): [
  ProductSearchType,
  (value: ProductSearchType | null | undefined) => Promise<void>,
] => {
  const [searchType, setSearchType] =
    useStringEnumQueryParam<ProductSearchType>("search_type", "ID");

  return [searchType, setSearchType];
};

// the below hook powers the state for the text in the product search bar
export const useSearchTerm = (): [
  string,
  (value: string | null | undefined) => Promise<void>,
] => {
  const [searchTerm, setSearchTerm] = useStringQueryParam("search_term");

  return [searchTerm, setSearchTerm];
};

// the below powers the offset when querying data for the product table
export const useOffset = (): [
  number | null | undefined,
  (value: number | null | undefined) => Promise<void>,
] => {
  const [rawOffset, setOffset] = useIntQueryParam("offset");

  return [rawOffset, setOffset];
};

// the below powers the limit when querying data for the product table
export const useLimit = (): [
  number | null | undefined,
  (value: number | null | undefined) => Promise<void>,
] => {
  const [limit, setLimit] = useIntQueryParam("limit");

  return [limit, setLimit];
};

// the below hook powers the state for the "State" portion of the filter
export const useStateFilter = (): [
  ListingStateUrlSelection | undefined,
  (value: ListingStateUrlSelection | null | undefined) => Promise<void>,
] => {
  const [stateFilter, setStateFilter] = useStringEnumQueryParam<
    ListingStateUrlSelection | undefined
  >("state");

  return [stateFilter, setStateFilter];
};

// the below hook powers the state for the "Listing Enabled" portion of the filter
export const useEnabledFilter = (): [
  ListingEnabledUrlSelection | undefined,
  (value: ListingEnabledUrlSelection | null | undefined) => Promise<void>,
] => {
  const [enabledFilter, setEnabledFilter] = useStringEnumQueryParam<
    ListingEnabledUrlSelection | undefined
  >("enabled");

  return [enabledFilter, setEnabledFilter];
};

// the below hook powers the state for the "Badges" portion of the filter
export const useBadgesFilter = (): [
  ReadonlySet<ProductBadge> | null | undefined,
  (value: ReadonlySet<ProductBadge>) => Promise<void>,
] => {
  const [badgesFilter, setBadgesFilter] =
    useStringSetQueryParam<ProductBadge>("badges");

  return [badgesFilter, setBadgesFilter];
};

// the below hook powers the state for the product table's sort by functionality
export const useSortBy = (): [
  ProductSortField,
  (value: ProductSortField | null | undefined) => Promise<void>,
] => {
  const [sortBy, setSortBy] = useStringEnumQueryParam<ProductSortField>("sort");

  return [sortBy, setSortBy];
};

// the below hook powers the state for the product table's sort order functionality
export const useSortOrder = (): [
  SortOrder,
  (value: SortOrder | null | undefined) => Promise<void>,
] => {
  const [sortOrder, setSortOrder] = useStringEnumQueryParam<SortOrder>(
    "order",
    "not-applied",
  );

  return [sortOrder, setSortOrder];
};

// the below hook is a QOL function to simplify checking if filters are disabled
const areFiltersEnabled: { readonly [T in ProductSearchType]: boolean } = {
  NAME: true,
  SKU: false,
  ID: false,
  PARENTSKU: false,
};

export const useFiltersStatus = (): {
  readonly enabled: boolean;
  readonly disabled: boolean;
} => {
  const [searchTerm] = useSearchTerm();
  const [searchType] = useSearchType();

  // only disabling filters once the user has begun searching allows the user
  // to apply filters when not in the act of searching
  const disabled = searchTerm !== "" && !areFiltersEnabled[searchType];

  return {
    enabled: !disabled,
    disabled,
  };
};
