/* Merchant Store */
import { NavigationSearchResult } from "@chrome/searchStore";

/* Toolkit */
import { MerchantAPIRequest } from "@core/toolkit/api";

export type GetNavigationCountsResponse = {
  readonly [key: string]: number;
};

export const getNavigationCounts = (): MerchantAPIRequest<
  Record<string, never>,
  GetNavigationCountsResponse
> => new MerchantAPIRequest("chrome/counts", {});

export type ObjectIDSearchRequest = {
  readonly oid: string;
  readonly current_path?: string | null | undefined;
};

export type ObjectIDSearchResponse = {
  readonly result: NavigationSearchResult | null | undefined;
};

export const objectSearch = (
  args: ObjectIDSearchRequest,
): MerchantAPIRequest<ObjectIDSearchRequest, ObjectIDSearchResponse> =>
  new MerchantAPIRequest("chrome/object-search", args);