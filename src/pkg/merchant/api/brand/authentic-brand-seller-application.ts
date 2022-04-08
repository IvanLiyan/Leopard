/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";
import {
  ABSBApplicationSellerType,
  ABSBBrandApplication,
} from "@toolkit/brand/branded-products/abs";

export type CreateAbsbApplicationParams = {
  readonly brand_id: string | null | undefined;
  readonly authorization_type: ABSBApplicationSellerType | null | undefined;
  readonly auth_docs_json_str: string | null | undefined;
  readonly brand_owner: string | null | undefined;
  readonly brand_rep: string | null | undefined;
  readonly brand_rep_title: string | null | undefined;
  readonly phone_number: string | null | undefined;
  readonly email: string | null | undefined;
  readonly regions: string | null | undefined;
};

export type CreateAbsbApplicationResponse = {
  readonly application_id: string;
};

export const createAbsbApplication = (
  args: CreateAbsbApplicationParams
): MerchantAPIRequest<
  CreateAbsbApplicationParams,
  CreateAbsbApplicationResponse
> =>
  new MerchantAPIRequest(
    "authentic-brand-seller-badge-application/create",
    args
  );

export type GetAbsbApplicationsResponse = {
  readonly brand_applications: ReadonlyArray<ABSBBrandApplication>;
  readonly is_verified: boolean;
};

export const getAbsbApplications = (): MerchantAPIRequest<
  {},
  GetAbsbApplicationsResponse
> => new MerchantAPIRequest("authentic-brand-seller-badge-application/get");
