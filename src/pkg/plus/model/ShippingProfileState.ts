import { observable, computed, action } from "mobx";
import gql from "graphql-tag";
import _ from "lodash";
import {
  Country,
  PaymentCurrencyCode,
  ShippingProfileSchema,
  WishExpressCountryDetails,
  DestinationShippingProfileSchema,
  ShippingProfileUpsertInput,
  ShippingProfileMutationsUpsertShippingProfileArgs,
  DestinationShippingProfileInput,
  UpsertShippingProfile,
} from "@schema/types";
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";

const UPSERT_SHIPPING_PROFILE = gql`
  mutation ShippingProfileState_UpsertShippingProfile(
    $input: ShippingProfileUpsertInput!
  ) {
    shippingProfileCollection {
      upsertShippingProfile(input: $input) {
        ok
        message
      }
    }
  }
`;

type UpsertShippingProfileResponseType = {
  readonly shippingProfileCollection: {
    readonly upsertShippingProfile: Pick<
      UpsertShippingProfile,
      "ok" | "message"
    >;
  };
};

export type PickedDestinationShippingProfileSchema = Pick<
  DestinationShippingProfileSchema,
  "destination" | "maxHoursToDoor"
>;

export type PickedShippingProfileSchema = Pick<
  ShippingProfileSchema,
  "id" | "name" | "linkedProductCount"
> & {
  readonly shippingDetailsPerDestination?: ReadonlyArray<PickedDestinationShippingProfileSchema> | null;
};

export type PickedCountryWeShipTo = Pick<
  Country,
  "code" | "name" | "gmvRank" | "isInEurope"
> & {
  readonly wishExpress: Pick<
    WishExpressCountryDetails,
    "supportsWishExpress" | "expectedTimeToDoor"
  >;
};

export const MAX_OPTIONS_PER_COUNTRY = 2;

export class ShippingProfileDestinationState {
  internalId = _.uniqueId();

  @observable
  country: PickedCountryWeShipTo | undefined;

  @observable
  rate: number | undefined;

  @observable
  maxDeliveryDays: number | undefined;

  @observable
  initialData: PickedDestinationShippingProfileSchema | undefined;

  constructor(args: {
    readonly country?: PickedCountryWeShipTo | undefined;
    readonly initialData?: PickedDestinationShippingProfileSchema;
  }) {
    const { country, initialData } = args;
    this.country = country;
    this.initialData = initialData;
  }

  @computed
  get isSaved(): boolean {
    return this.initialData != null;
  }

  @action
  setRate(value: number | undefined) {
    this.rate = value;
  }

  @action
  setMaxDeliveryDays(value: number | undefined) {
    this.maxDeliveryDays = value;
  }
}

type DraftDestinationPrefill = "top-countries" | "top-eu" | "all";

export default class ShippingProfileState {
  @observable
  name: string | undefined;

  @observable
  isSubmitting = false;

  @observable
  primaryCurrency: PaymentCurrencyCode;

  @observable
  forceValidation = false;

  @observable
  destinations: ReadonlyArray<ShippingProfileDestinationState> = [];

  @observable
  draftDestinations: ReadonlyArray<ShippingProfileDestinationState> = [];

  initialData: PickedShippingProfileSchema | undefined;

  private countriesWeShipTo: ReadonlyArray<PickedCountryWeShipTo>;

  constructor(args: {
    readonly initialData?: PickedShippingProfileSchema;
    readonly primaryCurrency: PaymentCurrencyCode;
    readonly countriesWeShipTo: ReadonlyArray<PickedCountryWeShipTo>;
  }) {
    const { countriesWeShipTo, initialData, primaryCurrency } = args;
    this.initialData = initialData;
    this.name = initialData?.name;
    this.primaryCurrency = primaryCurrency;
    this.countriesWeShipTo = countriesWeShipTo;
    const destinations: ReadonlyArray<PickedDestinationShippingProfileSchema> =
      initialData?.shippingDetailsPerDestination ?? [];
    this.destinations = destinations.map(
      (destination) =>
        new ShippingProfileDestinationState({ initialData: destination }),
    );
  }

  @action
  createDraftDestination(prefill?: DraftDestinationPrefill) {
    const { draftDestinations } = this;
    let newDestinations: ReadonlyArray<ShippingProfileDestinationState> = [];
    const countriesWeShipTo = _.sortBy(
      this.countriesWeShipTo.filter(
        ({ code }) =>
          this.getDestinationOptionCount(code) < MAX_OPTIONS_PER_COUNTRY,
      ),
      ({ gmvRank }) => gmvRank ?? Number.MAX_SAFE_INTEGER,
    );

    switch (prefill) {
      case "top-countries":
        newDestinations = [
          ...newDestinations,
          ...countriesWeShipTo
            .filter(({ gmvRank }) => gmvRank != null && gmvRank <= 10)
            .map((country) => new ShippingProfileDestinationState({ country })),
        ];
        break;
      case "top-eu":
        newDestinations = [
          ...newDestinations,
          ...countriesWeShipTo
            .filter(
              ({ isInEurope, gmvRank }) =>
                isInEurope && gmvRank != null && gmvRank <= 20,
            )
            .map((country) => new ShippingProfileDestinationState({ country })),
        ];
        break;
      case "all":
        newDestinations = [
          ...newDestinations,
          ...countriesWeShipTo.map(
            (country) => new ShippingProfileDestinationState({ country }),
          ),
        ];
        break;
      default:
        newDestinations = [
          ...newDestinations,
          new ShippingProfileDestinationState({}),
        ];
    }
    this.draftDestinations = [...draftDestinations, ...newDestinations];
  }

  @computed
  get summary(): string | undefined {
    const { destinations, draftDestinations } = this;
    const countries = [...destinations, ...draftDestinations]
      .map(({ country }) => country)
      .filter(
        (country) => country != null,
      ) as ReadonlyArray<PickedCountryWeShipTo>;

    const sortedCountries = _.sortBy(countries, ({ gmvRank }) => gmvRank);
    if (sortedCountries.length == 0) {
      return;
    }

    const firstCountry = sortedCountries[0];
    return firstCountry.name;
  }

  @computed
  get canSave(): boolean {
    return false;
  }

  @computed
  get allDestinations(): ReadonlyArray<ShippingProfileDestinationState> {
    const { destinations, draftDestinations } = this;
    return [...destinations, ...draftDestinations];
  }

  @computed
  get linkedProductCount(): number {
    const { initialData } = this;
    return initialData?.linkedProductCount ?? 0;
  }

  @computed
  get id(): string | undefined {
    const { initialData } = this;
    return initialData?.id;
  }

  getDestinationOptionCount(countryCode: Country["code"]): number {
    const { allDestinations } = this;
    return allDestinations.filter(({ country }) => country?.code == countryCode)
      .length;
  }

  @computed
  get availableCountryOptions(): ReadonlyArray<PickedCountryWeShipTo> {
    const { countriesWeShipTo } = this;

    const getCountryOptionName = (
      { name }: PickedCountryWeShipTo,
      existingOptionCount: number,
    ): string => {
      if (existingOptionCount == 0) {
        return name;
      }
      return `${name} (${existingOptionCount + 1})`;
    };

    const countryData: ReadonlyArray<[PickedCountryWeShipTo, number]> =
      countriesWeShipTo.map((country) => [
        country,
        this.getDestinationOptionCount(country.code),
      ]);

    return countryData
      .filter(([, optionCount]) => optionCount < MAX_OPTIONS_PER_COUNTRY)
      .map(([country, optionCount]) => ({
        ...country,
        name: getCountryOptionName(country, optionCount),
      }));
  }

  async submit() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();

    const { id, name, primaryCurrency, destinations } = this;

    const shippingDetailsPerDestination: ReadonlyArray<DestinationShippingProfileInput> =
      destinations.map(({ country, rate, initialData, isSaved }) => ({
        destination: country?.code,
        rate: {
          amount: rate || 0, // rate should always be defined at this point
          currencyCode: primaryCurrency,
        },
        maxHoursToDoor: initialData?.maxHoursToDoor,
        enabled: isSaved,
      }));

    const mutationInput: ShippingProfileUpsertInput = {
      id,
      name,
      shippingDetailsPerDestination,
    };

    const { data } = await client.mutate<
      UpsertShippingProfileResponseType,
      ShippingProfileMutationsUpsertShippingProfileArgs
    >({
      mutation: UPSERT_SHIPPING_PROFILE,
      variables: { input: mutationInput },
    });
    const ok = data?.shippingProfileCollection.upsertShippingProfile.ok;
    const message =
      data?.shippingProfileCollection.upsertShippingProfile.message;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }
  }
}
