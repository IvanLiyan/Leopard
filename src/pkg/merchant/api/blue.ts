/* Toolkit */
import { CountryCode, Locale } from "@schema/types";
import { MerchantAPIRequest } from "@toolkit/api";
import countries from "@toolkit/countries";

export type GetCommerceStoreParams = {
  readonly storeId: string;
  readonly start: number;
  readonly count: number;
  readonly search_type: string;
  readonly query: string;
};

export type CommerceStore = {
  readonly id: string;
  readonly door_image: string;
  readonly store_name: string;
  readonly street_address1: string;
  readonly street_address2: string;
  readonly city: string;
  readonly address_state: string;
  readonly zipcode: string;
  readonly country: string;
  readonly address_str: string;
  readonly fusion_eligible: boolean;
  readonly state_text: string;
  readonly state: number;
  readonly store_type: string;
  readonly store_category: string;
  readonly store_rating: string;
  readonly disable_from: "N/A" | string;
  readonly disable_to: "N/A" | string;
  readonly suspend_from: "N/A" | string;
  readonly comment_messages: ReadonlyArray<{
    readonly sender_username: string;
    readonly time: string;
    readonly message: string;
  }>;
  readonly admin_comments: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly inventory: number;
  readonly paypal: string;
  readonly store_special_hours_list: ReadonlyArray<[string, string]>;
  readonly welcome_tracking_id: string | null | undefined;
  readonly welcome_kit_carrier_id: number;
  readonly reached_fusion_cap: string;
  readonly payment_policy_str: string;
  readonly payment_currency: string;
  readonly contact_name: string;
  readonly contact_email: string;
  readonly phone_number: string;
  readonly approver: string;
  readonly time_of_approval: string;
  readonly welcome_delivered_time_str: string;
  readonly first_shipment_id: string | null | undefined;
  readonly first_shipment_status: string | null | undefined;
  readonly referral_code: string;
  readonly wish_user_referral_code: string;
  readonly referred_code: string;
  readonly auto_address_allowed: boolean;
  readonly auto_disable_allowed: boolean;
  readonly lat: string;
  readonly long: string;
};

export type CommerceStoreResponse = {
  readonly results: {
    readonly feed_ended: boolean;
    readonly num_results: number;
    readonly rows: ReadonlyArray<CommerceStore>;
  };
};

export const getCommerceStore = (
  args: GetCommerceStoreParams
): MerchantAPIRequest<GetCommerceStoreParams, CommerceStoreResponse> =>
  new MerchantAPIRequest("blue/admin/list-stores", args);

export type PlacesAutocompleteInputParams = {
  readonly countryCode: CountryCode;
  readonly place: string;
  readonly sessionToken: string;
  readonly types: ReadonlyArray<string>;
  readonly locale: Locale;
};

export type PlacesAutocompleteParams = {
  readonly input: string;
  readonly language: string;
  readonly "types[]": ReadonlyArray<string>;
  readonly sessiontoken: string;
};

export type AutocompleteSubstringMatch = {
  readonly length: number;
  readonly offset: number;
};

export type AutocompletePrediction = {
  readonly description: string;
  readonly distance_meters: number;
  readonly id: string;
  readonly matched_substrings: ReadonlyArray<AutocompleteSubstringMatch>;
  readonly place_id: string;
  readonly reference: string;
  readonly terms: ReadonlyArray<{
    readonly offset: number;
    readonly value: string;
  }>;
  readonly types: ReadonlyArray<string>;
  readonly structured_formatting: {
    readonly main_text: string;
    readonly main_text_matched_substrings: ReadonlyArray<AutocompleteSubstringMatch>;
    readonly secondary_text: string;
    readonly secondary_text_matched_substrings: ReadonlyArray<AutocompleteSubstringMatch>;
  };
};

export type PlacesAutocompleteResponse = {
  readonly status: string;
  readonly predictions: ReadonlyArray<AutocompletePrediction>;
};

export const getStoreAddressAutocomplete = (
  args: PlacesAutocompleteInputParams
): MerchantAPIRequest<PlacesAutocompleteParams, PlacesAutocompleteResponse> => {
  const { countryCode, place, sessionToken, types, locale } = args;
  const countryName = countries[countryCode];
  const inputArgs: PlacesAutocompleteParams = {
    input: `${countryName}, ${place}`,
    language: locale,
    "types[]": types,
    sessiontoken: sessionToken,
  };

  return new MerchantAPIRequest("blue/places/autocomplete", inputArgs);
};

export type BasicPlaceDetailsFieldType =
  | "address_component"
  | "adr_address"
  | "business_status"
  | "formatted_address"
  | "geometry"
  | "icon"
  | "name"
  | "photo"
  | "place_id"
  | "plus_code"
  | "type"
  | "url"
  | "utc_offset"
  | "vicinity";

export type ContactPlaceDetailsFieldType =
  | "formatted_phone_number"
  | "international_phone_number"
  | "opening_hours"
  | "website";

export type AtmospherePlaceDetailsFieldType =
  | "price_level"
  | "rating"
  | "review"
  | "user_ratings_total";

export type PlaceDetailsFieldType =
  | BasicPlaceDetailsFieldType
  | ContactPlaceDetailsFieldType
  | AtmospherePlaceDetailsFieldType;

export type PlaceDefaultsInputParams = {
  readonly sessionToken: string;
  readonly placeId: string;
  readonly fields: ReadonlyArray<PlaceDetailsFieldType>;
};

export type PlaceDefaultParams = {
  readonly place_id: string;
  readonly sessiontoken: string;
  readonly fields: ReadonlyArray<PlaceDetailsFieldType>;
};

export type PlaceAddressComponent = {
  readonly long_name: string;
  readonly short_name: string;
  readonly types: ReadonlyArray<string>;
};

export type PlaceDetailsResult = {
  readonly address_components: ReadonlyArray<PlaceAddressComponent>;
  readonly international_phone_number: string;
  readonly formatted_phone_number: string;
  readonly name: string;
  readonly place_id: string;
};

export type PlaceDetailsHtmlAttributions = ReadonlyArray<string>;

export type PlaceDetailsResponse = {
  readonly status: string;
  readonly result: PlaceDetailsResult;
  readonly html_attributions: PlaceDetailsHtmlAttributions;
};

export const getPlaceDetails = (
  args: PlaceDefaultsInputParams
): MerchantAPIRequest<PlaceDefaultParams, PlaceDetailsResponse> => {
  const { sessionToken, placeId, fields } = args;

  const inputArgs: PlaceDefaultParams = {
    place_id: placeId,
    sessiontoken: sessionToken,
    fields,
  };

  return new MerchantAPIRequest("blue/places/details", inputArgs);
};
