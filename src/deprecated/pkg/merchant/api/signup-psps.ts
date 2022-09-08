/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type SignUpPSPListing = {
  readonly psp_id: Uint8Array;
  readonly name: string;
  readonly logo_source: string;
  readonly rediect_url: string;
  readonly active: boolean;
};

export type GetSignUpPSPParams = {};

export type GetSignUpPSPResponse = {
  allowed_psp_list: ReadonlyArray<SignUpPSPListing>;
  is_merchant_allowed: boolean;
};

export const getSignUpPSPs = (
  args: GetSignUpPSPParams
): MerchantAPIRequest<GetSignUpPSPParams, GetSignUpPSPResponse> =>
  new MerchantAPIRequest("signup-psps", args);

export type GetSignupPayoneerResponse = {
  readonly sign_up_url: string;
  readonly is_already_registered: boolean;
};

export const signupPayoneer = (): MerchantAPIRequest<
  null,
  GetSignupPayoneerResponse
> => new MerchantAPIRequest("store-id-by-payoneer");
