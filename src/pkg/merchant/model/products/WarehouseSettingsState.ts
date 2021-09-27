import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import {
  UpsertMerchantWarehouseMutation,
  UpsertWarehouseInput,
  CountryCode,
} from "@schema/types";

import ToastStore from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";

const UPSERT_WAREHOUSE_MUTATION = gql`
  mutation WarehouseSettingsState_UpsertWarehouseMutation(
    $input: UpsertWarehouseInput!
  ) {
    currentMerchant {
      warehouseSettings {
        upsertWarehouse(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type UpsertWarehouseResponseType = {
  readonly currentMerchant?: {
    readonly warehouseSettings?: {
      readonly upsertWarehouse: Pick<
        UpsertMerchantWarehouseMutation,
        "ok" | "message"
      >;
    };
  };
};

export default class WarehouseSettingsState {
  @observable
  id: string | null | undefined;

  @observable
  name: string | null | undefined;

  @observable
  streetAddress1: string | null | undefined;

  @observable
  streetAddress2: string | null | undefined;

  @observable
  city: string | null | undefined;

  @observable
  state: string | null | undefined;

  @observable
  zipcode: string | null | undefined;

  @observable
  countryCode: CountryCode | null | undefined;

  @observable
  enabledCountries: ReadonlyArray<CountryCode> | null | undefined;

  @observable
  isSubmitting: boolean = false;

  constructor(args?: UpsertWarehouseInput) {
    if (args != null) {
      this.id = args.id;
      this.name = args.name;
      this.enabledCountries = args.enabledCountries;

      if (args.address != null) {
        this.streetAddress1 = args.address.streetAddress1;
        this.streetAddress2 = args.address.streetAddress2;
        this.city = args.address.city;
        this.state = args.address.state;
        this.zipcode = args.address.zipcode;
        this.countryCode = args.address.countryCode;
      }
    } else {
      this.enabledCountries = [];
    }
  }

  @computed
  get formValid(): boolean {
    return (
      this.name != null &&
      this.name.trim() !== "" &&
      this.streetAddress1 != null &&
      this.streetAddress1.trim() !== "" &&
      this.city != null &&
      this.city.trim() !== "" &&
      this.state != null &&
      this.state.trim() !== "" &&
      this.zipcode != null &&
      this.zipcode.trim() !== "" &&
      this.countryCode != null &&
      this.enabledCountries != null &&
      this.enabledCountries.length > 0
    );
  }

  @action
  async submit() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const {
      id,
      name,
      streetAddress1,
      city,
      state,
      zipcode,
      countryCode,
      enabledCountries,
    } = this;

    if (
      name == null ||
      streetAddress1 == null ||
      city == null ||
      state == null ||
      zipcode == null ||
      countryCode == null
    ) {
      toastStore.negative(
        i`Could not update warehouse. Certain fields are missing.`,
      );
      return;
    }

    const input = {
      ...(id != null ? { id } : { name, enabledCountries }),
      address: {
        name,
        streetAddress1,
        city,
        state,
        zipcode,
        countryCode,
      },
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertWarehouseResponseType,
      { input: UpsertWarehouseInput }
    >({
      mutation: UPSERT_WAREHOUSE_MUTATION,
      variables: { input },
    });

    const ok = data?.currentMerchant?.warehouseSettings?.upsertWarehouse.ok;
    const message =
      data?.currentMerchant?.warehouseSettings?.upsertWarehouse.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not add warehouse.`);
      return;
    }

    if (id != null) {
      toastStore.positive(i`${name} warehouse has been updated!`, {
        timeoutMs: 7000,
        deferred: true,
      });

      await navigationStore.navigate("/warehouse-overview/settings");
    } else {
      toastStore.positive(i`${name} warehouse has been added!`, {
        timeoutMs: 7000,
        deferred: true,
      });

      await navigationStore.navigate("/product");
    }
  }
}
