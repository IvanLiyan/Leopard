/* Merchant Store */
import { NavigationSearchResult } from "@next-toolkit/chrome/search";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetNavigationCountsResponse = {
  readonly [key: string]: number;
};

export const getNavigationCounts = (): MerchantAPIRequest<
  {},
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
