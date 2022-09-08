/* External Libraries */
import { observable, computed } from "mobx";
import find from "lodash/find";
import sortBy from "lodash/sortBy";

/* Lego Components */
import { Option } from "@ContextLogic/lego";

/* Merchant Stores */
import ApolloStore from "@stores/ApolloStore";

/* Type Imports */
import {
  PickedCountry,
  GetShippingProviderPoliciesRequestType,
  GetShippingProviderPoliciesResponseType,
  GET_SHIPPING_PROVIDER_POLICIES,
  PickedShippingProviderPolicy,
  PickedShippingProvider,
} from "@merchant/api/documentation/qualified-carriers";
import { CountryCode } from "@schema/types";

export default class QualifiedCarriersState {
  @observable
  isLoading: boolean = false;

  @observable
  countries: ReadonlyArray<PickedCountry> | null | undefined;

  @observable
  euVatCountries: ReadonlyArray<CountryCode> | null | undefined;

  @observable
  destinationCountry: CountryCode | null | undefined = null;

  @observable
  originCountry: string | null | undefined = null;

  @observable
  orderValue: string | null | undefined = null;

  @observable
  search: string | null | undefined = null;

  @observable
  canSuggest: boolean = false;

  @observable
  note: string | null | undefined = undefined;

  @observable
  wishpostChannels: ReadonlyArray<string> | null | undefined = undefined;

  @observable
  defaultShippingProviderPolicies: ReadonlyArray<PickedShippingProviderPolicy>;

  @observable
  shippingProviderPolicies:
    | ReadonlyArray<PickedShippingProviderPolicy>
    | undefined = undefined;

  @observable
  originCountries: ReadonlySet<string> = new Set();

  @observable
  orderValues: ReadonlySet<string> = new Set();

  @observable
  selectedPolicy: PickedShippingProviderPolicy | undefined;

  constructor(params: {
    countries: ReadonlyArray<PickedCountry> | null | undefined;
    euVatCountries: ReadonlyArray<PickedCountry> | null | undefined;
    shippingProviderPolicies: ReadonlyArray<PickedShippingProviderPolicy>;
  }) {
    this.countries = sortBy(params.countries || [], ({ name }) => name);
    this.euVatCountries = (params.euVatCountries || []).map(({ code }) => code);
    this.defaultShippingProviderPolicies =
      params.shippingProviderPolicies || [];
    this.updateSelectedPolicy();
  }

  @computed
  get countriesOptions(): ReadonlyArray<Option<CountryCode>> {
    return (this.countries || []).map(({ code, name }) => {
      return { value: code, text: name };
    });
  }

  @computed
  get originCountryOptions(): ReadonlyArray<Option<string>> {
    return (Array.from(this.originCountries) || []).map((origin: string) => {
      return { value: origin, text: origin };
    });
  }

  @computed
  get orderValueOptions(): ReadonlyArray<Option<string>> {
    //Go through list of policies to find conditions based on the destination AND origin.
    // i.e the ordervalue options are dynamic based on the chosen destination and origin.
    const filteredConditions: Set<string> = new Set();
    this.shippingProviderPolicies?.forEach(
      (policy: PickedShippingProviderPolicy) => {
        if (policy.origin == this.originCountry && policy.condition != null) {
          filteredConditions.add(policy.condition);
        }
      }
    );
    return (Array.from(filteredConditions) || []).map((condition: string) => {
      return { value: condition, text: condition };
    });
  }

  @computed
  get qualifiedCarriersData(): ReadonlyArray<PickedShippingProvider> {
    const filtered = (this.selectedPolicy?.shippingProviders || []).filter(
      ({ isQualified }) => isQualified === true
    );
    const sorted = sortBy(filtered || [], ({ name }) => name);
    if (this.search != null && this.search.length > 0) {
      return sorted.filter(({ name }) =>
        name.toLowerCase().includes(this.search?.toLowerCase() || "")
      );
    }
    return sorted;
  }

  updateSelectedPolicy = () => {
    const selected =
      this.destinationCountry == null || this.shippingProviderPolicies == null
        ? this.defaultShippingProviderPolicies[0]
        : find(this.shippingProviderPolicies, {
            origin: this.originCountry,
            condition: this.orderValue,
          });
    this.selectedPolicy = selected;
    this.note = selected?.note;
    this.wishpostChannels = selected?.wishpostChannels;
  };

  getShippingProviderPolicies = async () => {
    const { client } = ApolloStore.instance();
    this.isLoading = true;

    if (this.destinationCountry == null) {
      this.isLoading = false;
      return;
    }

    const { data } = await client.query<
      GetShippingProviderPoliciesResponseType,
      GetShippingProviderPoliciesRequestType
    >({
      query: GET_SHIPPING_PROVIDER_POLICIES,
      variables: { destCountryCode: this.destinationCountry },
    });

    this.originCountry = null;
    this.orderValue = null;

    const { shippingProviderPolicies } = data.publicShippingProviderDocs;

    this.shippingProviderPolicies = shippingProviderPolicies;

    const originCountries: Set<string> = new Set();
    const orderValues: Set<string> = new Set();
    (this.shippingProviderPolicies || []).forEach(({ origin, condition }) => {
      if (origin != null) originCountries.add(origin);
      if (condition != null) orderValues.add(condition);
    });
    this.originCountries = originCountries;
    this.orderValues = orderValues;

    this.isLoading = false;
  };
}
