import { action, computed, observable } from "mobx";
import gql from "graphql-tag";

/* Schema Types */
import {
  AuthenticationMutationsStoreSignupArgs,
  CountryCode,
  StoreSignupInput,
  StoreSignupAutocompleteInput,
  StoreSignupMutation,
} from "@schema/types";

/* Toolkit */
import { PickedCountriesType } from "@toolkit/store-signup";
import { call } from "@toolkit/api";

/* Merchant Stores */
import ApolloStore from "@merchant/stores/ApolloStore";
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import { CountryType } from "@merchant/component/core/CountrySelect";
import { StoreSignupSinglePageInitialData } from "@toolkit/store-signup";

/* Lego */
import {
  CNZipcodeOnlyValidator,
  RequiredValidator,
  USZipcodeOnlyValidator,
} from "@toolkit/validators";
import {
  PlaceDetailsHtmlAttributions,
  PlaceDetailsResult,
} from "@merchant/api/blue";

const STORE_SIGNUP_MUTATION = gql`
  mutation SignupForm_StoreSignupMutation($input: StoreSignupInput!) {
    authentication {
      storeSignup(input: $input) {
        ok
        message
      }
    }
  }
`;

type AuthenticationResponseType = {
  readonly authentication: {
    readonly storeSignup: Pick<StoreSignupMutation, "ok" | "message">;
  };
};

export type SignupPhoneNumber = {
  readonly country: CountryCode;
  readonly areaCode?: string;
  readonly phoneNumber?: string;
};

export default class StoreSignupSinglePageState {
  @observable
  emailAddress: string | null | undefined;

  @observable
  isEmailAddressValid: boolean = false;

  @observable
  password: string | null | undefined;

  @observable
  isPasswordValid: boolean = false;

  @observable
  firstName: string | null | undefined;

  @observable
  isFirstNameValid: boolean = false;

  @observable
  lastName: string | null | undefined;

  @observable
  isLastNameValid: boolean = false;

  @observable
  storeName: string | null | undefined;

  @observable
  isStoreNameValid: boolean = false;

  @observable
  phoneNumber: SignupPhoneNumber;

  @observable
  isPhoneNumberValid: boolean = false;

  @observable
  storeAddressLine1: string | null | undefined;

  @observable
  isStoreAddressLine1Valid: boolean = false;

  @observable
  storeAddressLine2: string | null | undefined;

  @observable
  city: string | null | undefined;

  @observable
  isCityValid: boolean = false;

  @observable
  countryOrRegion: CountryCode | null;

  @observable
  hasSelectedCountryOrRegion: boolean = false;

  @observable
  stateOrProvince: string | null | undefined;

  @observable
  hasSelectedStateOrProvince: boolean = false;

  @observable
  zipOrPostalCode: string | null | undefined;

  @observable
  isZipOrPostalCodeValid: boolean = false;

  @observable
  hasRetailStorefront: string | null = null;

  @observable
  hasSelectedHasRetailStoreFront: boolean = false;

  @observable
  storeCategory: string | null = null;

  @observable
  referralCode: string | null | undefined;

  @observable
  forceValidation: boolean = false;

  @observable
  forceAddressValidation: boolean = false;

  @observable
  isSaving: boolean = false;

  @observable
  autocompleteWaitForInput: boolean = false;

  didAutocomplete: boolean = false;
  didAutocompleteStoreName: boolean = false;
  autocompletePlaceId?: string;
  autocompleteResult?: PlaceDetailsResult;
  autocompleteHtmlAttributions?: PlaceDetailsHtmlAttributions;
  storeCategories: ReadonlyArray<string>;
  countriesWeShipTo: PickedCountriesType;

  constructor({
    currentCountry,
    authentication: { storeCategories, countriesWeShipTo },
  }: StoreSignupSinglePageInitialData) {
    this.storeCategories = storeCategories;
    this.countriesWeShipTo = countriesWeShipTo;

    const defaultCountry: CountryCode = currentCountry
      ? currentCountry.code
      : "US";

    this.phoneNumber = {
      country: defaultCountry,
    };

    this.countryOrRegion = defaultCountry;
  }

  @computed
  get isHasRetailStorefrontValid() {
    return this.hasRetailStorefront != null;
  }

  @computed
  get isCountryOrRegionValid() {
    return this.countryOrRegion != null;
  }

  @computed
  get isStateOrProvinceValid() {
    return (
      this.stateOrProvince != null && this.stateOrProvince.trim().length > 0
    );
  }

  @computed
  get canSave() {
    return (
      this.isEmailAddressValid &&
      this.isPasswordValid &&
      this.isFirstNameValid &&
      this.isLastNameValid &&
      this.isStoreNameValid &&
      this.isPhoneNumberValid &&
      this.isStoreAddressLine1Valid &&
      this.isCityValid &&
      this.isCountryOrRegionValid &&
      this.isStateOrProvinceValid &&
      this.isZipOrPostalCodeValid &&
      this.isHasRetailStorefrontValid
    );
  }

  @computed
  get countryOptions(): ReadonlyArray<CountryType> {
    return this.countriesWeShipTo.map(({ code, name }) => ({
      cc: code,
      name,
    })) as ReadonlyArray<CountryType>;
  }

  @computed
  get hasRetailStorefrontOptions() {
    return [
      {
        value: "true",
        text: i`Yes`,
      },
      {
        value: "false",
        text: i`No`,
      },
    ];
  }

  @computed
  get storeCategoryOptions() {
    return this.storeCategories
      ? this.storeCategories.map((category, index) => ({
          value: index.toString(),
          text: category || "",
        }))
      : [];
  }

  @computed
  get zipcodeValidators() {
    if (this.countryOrRegion === "US") {
      return [new RequiredValidator(), new USZipcodeOnlyValidator()];
    } else if (this.countryOrRegion === "CN") {
      return [new RequiredValidator(), new CNZipcodeOnlyValidator()];
    }

    return [new RequiredValidator()];
  }

  @action
  setForceValidation = () => {
    this.forceValidation = true;
    this.hasSelectedHasRetailStoreFront = true;
    this.hasSelectedCountryOrRegion = true;
    this.hasSelectedStateOrProvince = true;
  };

  @action
  setForceAddressValidation = () => {
    this.forceAddressValidation = true;
    this.hasSelectedCountryOrRegion = true;
    this.hasSelectedStateOrProvince = true;
  };

  @action
  onSubmit = async () => {
    const {
      emailAddress,
      password,
      firstName,
      lastName,
      storeName,
      phoneNumber,
      storeAddressLine1,
      storeAddressLine2,
      city,
      countryOrRegion,
      stateOrProvince,
      zipOrPostalCode,
      hasRetailStorefront,
      storeCategory,
      countriesWeShipTo,
      referralCode,
      canSave,
      autocompleteHtmlAttributions,
      autocompletePlaceId,
      autocompleteResult,
      didAutocompleteStoreName,
    } = this;

    if (!canSave) {
      this.setForceValidation();
      return;
    }

    this.isSaving = true;

    const countryName = countriesWeShipTo.find(
      ({ code }) => code == countryOrRegion
    )?.name;

    if (
      emailAddress == null ||
      password == null ||
      firstName == null ||
      lastName == null ||
      storeName == null ||
      phoneNumber == null ||
      phoneNumber.phoneNumber == null ||
      storeAddressLine1 == null ||
      city == null ||
      countryName == null ||
      stateOrProvince == null ||
      zipOrPostalCode == null ||
      hasRetailStorefront == null
    ) {
      this.isSaving = false;
      return;
    }

    const autocomplete: StoreSignupAutocompleteInput = {
      attributions: autocompleteHtmlAttributions,
      placeId: autocompletePlaceId,
      detailsResult: JSON.stringify(autocompleteResult),
      storeNameValidated: didAutocompleteStoreName,
    };

    const input: StoreSignupInput = {
      emailAddress,
      password,
      firstName,
      lastName,
      storeName,
      phoneNumber: `+${phoneNumber.areaCode} ${phoneNumber.phoneNumber.trim()}`,
      storeAddressLine1,
      storeAddressLine2,
      city,
      countryName,
      stateOrProvince,
      zipOrPostalCode,
      hasRetailStorefront: hasRetailStorefront == "true",
      storeCategory:
        storeCategory == null ? storeCategory : parseInt(storeCategory),
      referralCode,
      autocomplete,
    };

    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const { data } = await client.mutate<
      AuthenticationResponseType,
      AuthenticationMutationsStoreSignupArgs
    >({
      mutation: STORE_SIGNUP_MUTATION,
      variables: { input },
    });
    const ok = data?.authentication.storeSignup.ok;
    const message = data?.authentication.storeSignup.message;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      this.isSaving = false;
      return;
    }

    navigationStore.navigate("/");
  };

  getPrePopulatedFormUrl = () => {
    const STORE_TYPE = {
      HOME: 0,
      RETAIL: 1,
    } as const;
    const params: {
      readonly [key: string]: string | number | undefined | null;
    } = {
      // Will be used by agents calling local stores and filling in the
      // form for them.
      utm_source: "local_call",
      email: this.emailAddress,
      place_id: this.autocompletePlaceId,
      first_name: this.firstName,
      last_name: this.lastName,
      phone_number: this.phoneNumber.phoneNumber,
      store_category_index: this.storeCategory,
      store_name: this.storeName,
      store_type:
        this.hasRetailStorefront === "yes"
          ? STORE_TYPE.RETAIL
          : STORE_TYPE.HOME,
      address1: this.storeAddressLine1,
      address2: this.storeAddressLine2,
      city: this.city,
      zipcode: this.zipOrPostalCode,
      state: this.stateOrProvince,
      country: this.countryOrRegion,
      // We will map codes that start with "internal" to start with "local"
      // for when we send out the form to prospective local users.
      code: this.referralCode?.replace("internal", "local"),
    };

    const addParameters: { [key: string]: string } = {};
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== "" &&
        params[key] !== undefined
      ) {
        addParameters[key] = encodeURIComponent(String(params[key]));
      }
    });
    const paramStr = Object.entries(addParameters)
      .filter(([, value]) => value !== null && value !== undefined)
      .map((addParameter) => addParameter.join("="))
      .join("&");
    return `${paramStr ? "?" : ""}${paramStr}`;
  };

  @action
  onSendEmail = async () => {
    const { emailAddress, storeName, getPrePopulatedFormUrl } = this;
    const { locale } = LocalizationStore.instance();
    await call("blue/send-signup-email", {
      store_name: storeName,
      email_address: emailAddress,
      locale,
      prefilled_form_url: getPrePopulatedFormUrl(),
    });
    const navigationStore = NavigationStore.instance();
    navigationStore.reload();
  };
}
