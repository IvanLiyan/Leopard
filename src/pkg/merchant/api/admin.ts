/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type Merchant = {
  readonly id: string;
  readonly state: "pending" | "approved";
  readonly merchant_name: string;
  readonly merchant_id: string;
};

type GetMerchantsArgs = {
  readonly start: number;
  readonly count: number;
  readonly query: string;
  readonly sort: string;
  readonly order: "asc" | "desc";
  readonly submerchants: boolean;
  readonly search_type: string | typeof undefined;
  readonly get_channel_partners: boolean;
  readonly as_su: boolean;
};

type GetMerchantsResponse = {
  readonly next_offset: number;
  readonly merchants: ReadonlyArray<Merchant>;
};

export const getMerchants = (
  args: GetMerchantsArgs
): MerchantAPIRequest<GetMerchantsArgs, GetMerchantsResponse> =>
  new MerchantAPIRequest("merchants/get", args);
