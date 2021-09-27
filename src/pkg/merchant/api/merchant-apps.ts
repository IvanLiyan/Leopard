/* Merchant Model */
import { PromoEndType } from "@merchant/model/external/erp-promo-program/ERPPromoProgramV2";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";
import { Locale } from "@toolkit/locales";

export type ListingState =
  | "CREATED_PENDING"
  | "APPROVED"
  | "UPDATED_PENDING"
  | "REJECTED"
  | "HIDDEN"
  | "DISABLED";

export type UpdateRequestState =
  | "PENDING"
  | "REJECTED"
  | "APPROVED"
  | "CANCELLED";

export type ChangedData = {
  readonly name?: string;
  readonly website?: string;
  readonly descriptions?: {};
  readonly intros?: {};
  readonly logo_source?: string;
  readonly supported_languages: ReadonlyArray<Locale>;
};

export type MerchantApp = {
  readonly name: string;
  readonly redirect_uri: string;
  readonly website: string;
  readonly descriptions: {};
  readonly intros: {};
  readonly support_email: string;
  readonly support_phone: string;
  readonly support_wechat: string;
  readonly logo_source: string;
  readonly client_id: string;
  readonly changed_data: ChangedData;
  readonly update_request_state_name: UpdateRequestState;
  readonly listing_state_name: ListingState;
  readonly supported_languages: ReadonlyArray<Locale>;
  readonly public: boolean;
};

export type PrivateMerchantApp = {
  readonly name: string;
  readonly redirect_uri: string;
  readonly client_id: string;
  readonly client_secrets: ReadonlyArray<ClientSecret>;
  readonly public: boolean;
};

export type ClientSecret = {
  readonly secret: string;
  readonly date_added: string;
};

export type CreateMerchantAppParams = {
  readonly name: string;
  readonly redirect_uri: string;
  readonly website: string;
  readonly descriptions?: string;
  readonly intros?: string;
  readonly support_email: string;
  readonly support_phone?: string;
  readonly support_wechat?: string;
  readonly logo_source?: string;
  readonly supported_languages: ReadonlyArray<Locale>;
};

export type CreateMerchantAppResponse = {
  readonly merchant_app: MerchantApp;
};

export const createMerchantApp = (
  args: CreateMerchantAppParams
): MerchantAPIRequest<CreateMerchantAppParams, CreateMerchantAppResponse> =>
  new MerchantAPIRequest("public-app/create", args);

export type UpdateMerchantAppParams = CreateMerchantAppParams & {
  readonly client_id: string;
};

export type UpdateMerchantAppResponse = {
  readonly merchant_app: MerchantApp;
};

export const updateMerchantApp = (
  args: UpdateMerchantAppParams
): MerchantAPIRequest<UpdateMerchantAppParams, UpdateMerchantAppResponse> =>
  new MerchantAPIRequest("public-app/update", args);

export type GetMerchantAppParams = {};

export type GetMerchantAppResponse = {
  readonly merchant_app: MerchantApp;
  readonly is_disabled: boolean;
};

export const getMerchantApp = (
  args: GetMerchantAppParams
): MerchantAPIRequest<GetMerchantAppParams, GetMerchantAppResponse> =>
  new MerchantAPIRequest("read-app", args);

export type DeleteMerchantAppParams = {
  readonly client_id: string;
};

export type DeleteMerchantAppResponse = {};

export const deleteMerchantApp = (
  args: DeleteMerchantAppParams
): MerchantAPIRequest<DeleteMerchantAppParams, DeleteMerchantAppResponse> =>
  new MerchantAPIRequest("delete-app", args);

export type MerchantAppListing = {
  readonly name: string;
  readonly website: string;
  readonly descriptions: {};
  readonly intros: { [locale in Locale]: string };
  readonly support_email: string;
  readonly logo_source: string;
  readonly client_id: string;
  readonly supported_languages: ReadonlyArray<Locale>;
  readonly active: boolean;
  readonly listing_state: number;
  readonly listing_state_name: ListingState;
};

export type AppCategory = "ERP" | "LOANS" | "INSURANCE";

export type GetMerchantAppListingParams = {
  readonly client_id?: string;
  readonly start?: number;
  readonly count?: number;
  readonly search_query?: string;
  readonly categories?: ReadonlyArray<AppCategory>;
  readonly languages?: ReadonlyArray<Locale>;
};

export type GetMerchantAppListingResponse = {
  results: {
    readonly feed_ended: boolean;
    readonly next_offset: number;
    readonly num_results: number;
    readonly rows: ReadonlyArray<MerchantAppListing>;
  };
};

export const getMerchantAppListing = (
  args: GetMerchantAppListingParams
): MerchantAPIRequest<
  GetMerchantAppListingParams,
  GetMerchantAppListingResponse
> => new MerchantAPIRequest("public-app/get-listings", args);

export type GetSingleAppListingParams = {
  readonly client_id: string;
};

export type GetSingleAppListingResponse = {
  readonly merchant_app: MerchantAppListing;
  readonly already_added: boolean;
};

export const getSingleAppListing = (
  args: GetSingleAppListingParams
): MerchantAPIRequest<GetSingleAppListingParams, GetSingleAppListingResponse> =>
  new MerchantAPIRequest("public-app/get-single-listing", args);

export type GetCategoriesParams = {};

export type GetCategoriesResponse = {
  readonly categories: ReadonlyArray<AppCategory>;
};

export const getCategories = (): MerchantAPIRequest<
  GetCategoriesParams,
  GetCategoriesResponse
> => new MerchantAPIRequest("public-app/get-categories", {});

export type AddClientSecretParams = {
  readonly client_id: string;
};

export type AddClientSecretResponse = {
  readonly client_secrets: ReadonlyArray<ClientSecret>;
};

export const addClientSecret = (
  args: AddClientSecretParams
): MerchantAPIRequest<AddClientSecretParams, AddClientSecretResponse> =>
  new MerchantAPIRequest("public-app/add-client-secret", args);

export type DeleteClientSecretParams = {
  readonly client_id: string;
  readonly secret: string;
};

export type DeleteClientSecretResponse = {
  readonly client_secrets: ReadonlyArray<ClientSecret>;
};

export const deleteClientSecret = (
  args: DeleteClientSecretParams
): MerchantAPIRequest<DeleteClientSecretParams, DeleteClientSecretResponse> =>
  new MerchantAPIRequest("public-app/delete-client-secret", args);

export type CancelUpdateRequestParams = {
  readonly client_id: string;
};

export type CancelUpdateRequestResponse = {};

export const cancelUpdateRequest = (
  args: CancelUpdateRequestParams
): MerchantAPIRequest<CancelUpdateRequestParams, CancelUpdateRequestResponse> =>
  new MerchantAPIRequest("public-app/cancel-update", args);

export type GetAuthorizedAppListingsParams = {};

export type ActionToScope = {
  read: ReadonlyArray<string>;
  write: ReadonlyArray<string>;
};

export type SingleAuthorizedAppResponse = {
  readonly scope: ReadonlyArray<string>;
  readonly app_details: MerchantAppListing;
  readonly action_to_scope: ActionToScope;
};

export type GetAuthorizedAppListingsResponse = ReadonlyArray<
  SingleAuthorizedAppResponse
>;

export const getAuthorizedAppListingsRequest = (
  args: GetAuthorizedAppListingsParams
): MerchantAPIRequest<
  GetAuthorizedAppListingsParams,
  GetAuthorizedAppListingsResponse
> => new MerchantAPIRequest("oauth/v3/authorized-apps", args);

export type RemoveAuthorizationParams = {
  readonly client_id: string;
};

export type RemoveAuthorizationResponse = {};

export const removeAuthorization = (
  args: RemoveAuthorizationParams
): MerchantAPIRequest<RemoveAuthorizationParams, RemoveAuthorizationResponse> =>
  new MerchantAPIRequest("remove-auth", args);

export type CreatePrivateAppParams = {
  readonly name: string;
  readonly redirect_uri: string;
};

export type CreatePrivateAppResponse = {
  readonly merchant_app: PrivateMerchantApp;
};

export const createPrivateApp = (
  args: CreatePrivateAppParams
): MerchantAPIRequest<CreatePrivateAppParams, CreatePrivateAppResponse> =>
  new MerchantAPIRequest("private-app/create", args);

export type GetPrivateAppParams = {};

export type GetPrivateAppResponse = {
  readonly merchant_app: PrivateMerchantApp;
};

export const getPrivateApp = (
  args: GetPrivateAppParams
): MerchantAPIRequest<GetPrivateAppParams, GetPrivateAppResponse> =>
  new MerchantAPIRequest("read-app", args);

export type UpdatePrivateAppParams = {
  readonly name: string;
  readonly redirect_uri: string;
  readonly client_id: string;
};

export type UpdatePrivateAppResponse = {
  readonly merchant_app: PrivateMerchantApp;
};

export const updatePrivateApp = (
  args: UpdatePrivateAppParams
): MerchantAPIRequest<UpdatePrivateAppParams, UpdatePrivateAppResponse> =>
  new MerchantAPIRequest("private-app/update", args);

export type GetSignUpAppParams = {};

export type GetSignUpAppResponse = ReadonlyArray<MerchantAppListing>;

export const getSignUpApps = (
  args: GetSignUpAppParams
): MerchantAPIRequest<GetSignUpAppParams, GetSignUpAppResponse> =>
  new MerchantAPIRequest("public-app/signup-apps", args);

export type GetReferralAppParams = {
  readonly referral_id: string;
};

export type GetReferralAppResponse = {
  readonly partner_app: MerchantAppListing;
  readonly promo_end_type: PromoEndType;
  readonly promo_fixed_duration_days: number;
  readonly promo_fixed_end_time: string;
};

export const getReferralApp = (
  args: GetReferralAppParams
): MerchantAPIRequest<GetReferralAppParams, GetReferralAppResponse> =>
  new MerchantAPIRequest("public-app/referral-partner-app", args);
