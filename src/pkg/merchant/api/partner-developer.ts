/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

type CodeSample = {
  readonly title: string;
  readonly lang: string;
  readonly source: string;
};

type GetCodeSamplesParams = {};

type GetCodeSamplesResponse = {
  readonly code_samples: ReadonlyArray<CodeSample>;
};

export const getCodeSamples = (
  args: GetCodeSamplesParams
): MerchantAPIRequest<GetCodeSamplesParams, GetCodeSamplesResponse> =>
  new MerchantAPIRequest("partner-developer/code-samples", args);

type PromotedPartner = {
  readonly website: string;
  readonly logo_source: string;
};

type GetPromotedPartnersParams = {};

type GetPromotedPartnersResponse = {
  readonly promoted_partners: ReadonlyArray<PromotedPartner>;
};

export const getPromotedPartners = (
  args: GetPromotedPartnersParams
): MerchantAPIRequest<GetPromotedPartnersParams, GetPromotedPartnersResponse> =>
  new MerchantAPIRequest("partner-developer/promoted-partners", args);
