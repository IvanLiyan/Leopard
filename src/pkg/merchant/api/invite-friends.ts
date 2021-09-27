/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type InviteParams = {
  readonly email: string;
};

export type InviteResp = {};

export const invite = (
  args: InviteParams
): MerchantAPIRequest<InviteParams, InviteResp> =>
  new MerchantAPIRequest("merchant-invite-friend", args);

export type FetchReferralLinkParams = {};

export type FetchReferralLinkResp = {
  readonly referralLink: string;
};

export const fetchReferralLink = (
  args: FetchReferralLinkParams
): MerchantAPIRequest<FetchReferralLinkParams, FetchReferralLinkResp> =>
  new MerchantAPIRequest("fetch-merchant-referral-link", args);
