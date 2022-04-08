/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type MerchantStringLoadParams = {
  readonly group_id: string;
  readonly locale: string;
  readonly name?: string | null | undefined;
};

export type MerchantStringLoadResponse = {
  readonly strings: {
    [key: string]: string;
  };
};

export const loadString = (
  args: MerchantStringLoadParams
): MerchantAPIRequest<MerchantStringLoadParams, MerchantStringLoadResponse> =>
  new MerchantAPIRequest<MerchantStringLoadParams, MerchantStringLoadResponse>(
    "merchant-string-tool",
    args
  ).setOptions({
    failSilently: true,
  });
