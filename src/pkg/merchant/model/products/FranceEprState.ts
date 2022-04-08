import gql from "graphql-tag";
import { observable, action, computed } from "mobx";
import {
  LinkProductComplianceType,
  UpsertFranceProductUniqueIdentificationNumber,
  UpsertFranceLinkProductCompliance,
  FranceProductUniqueIdentificationNumberAction,
  FranceProductUniqueIdentificationNumberCategory,
  FranceProductUniqueIdentificationNumberUpsertInput,
  AcceptFrComplianceTermsOfService,
  LinkProductComplianceAction,
  LinkProductComplianceUpsertInput,
} from "@schema/types";
import { PickedFranceUinSchema } from "@toolkit/products/france-epr";

import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

const ACCEPT_FRANCE_EPR_TERMS_MUTATION = gql`
  mutation FranceEprState_AcceptFranceEprTermsMutation {
    currentMerchant {
      merchantTermsAgreed {
        acceptFrComplianceTermsOfService {
          ok
          message
        }
      }
    }
  }
`;

const UPSERT_PRODUCT_UIN_MUTATION = gql`
  mutation FranceEprState_UpsertProductUinMutation(
    $input: FranceProductUniqueIdentificationNumberUpsertInput!
  ) {
    policy {
      productCompliance {
        frCompliance {
          upsertUin(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`;

const UPSERT_FR_LINK_PRODUCT_COMPLIANCE_MUTATION = gql`
  mutation FranceEprState_UpsertFrLinkProductComplianceMutation(
    $input: LinkProductComplianceUpsertInput!
  ) {
    policy {
      productCompliance {
        frCompliance {
          upsertLink(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`;

type AcceptFrTermsResponse = {
  readonly currentMerchant?: {
    readonly merchantTermsAgreed?: {
      readonly acceptFrComplianceTermsOfService: Pick<
        AcceptFrComplianceTermsOfService,
        "ok" | "message"
      >;
    };
  };
};

type UpsertFrUinComplianceResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly frCompliance?: {
        readonly upsertUin: Pick<
          UpsertFranceProductUniqueIdentificationNumber,
          "ok" | "message"
        >;
      };
    };
  };
};

type UpsertLinkProductComplianceResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly frCompliance?: {
        readonly upsertLink: Pick<
          UpsertFranceLinkProductCompliance,
          "ok" | "message"
        >;
      };
    };
  };
};

export default class FranceEprState {
  compliance: LinkProductComplianceType = "FR_COMPLIANCE";

  @observable
  upsertAction: FranceProductUniqueIdentificationNumberAction;

  @observable
  uinId?: string | null;

  @observable
  category?: FranceProductUniqueIdentificationNumberCategory | null;

  @observable
  productResponsibilityOrganization?: string | null;

  @observable
  uniqueIdentificationNumber?: string | null;

  // Product linking
  @observable
  productIds?: ReadonlyArray<string> | null;

  @observable
  uinIds?: ReadonlyArray<string> | null;

  @observable
  isSubmitting: boolean = false;

  constructor(args?: PickedFranceUinSchema) {
    if (args != null) {
      const {
        id,
        category,
        uniqueIdentificationNumber,
        productResponsibilityOrganization,
      } = args;

      this.upsertAction = id ? "UPDATE" : "CREATE";
      this.uinId = id;
      this.category = category;
      this.productResponsibilityOrganization =
        productResponsibilityOrganization;
      this.uniqueIdentificationNumber = uniqueIdentificationNumber;

      return;
    }
    this.upsertAction = "CREATE";
  }

  @computed
  get isValid(): boolean {
    const {
      category,
      productResponsibilityOrganization,
      uniqueIdentificationNumber,
    } = this;

    return (
      !!(
        category &&
        productResponsibilityOrganization &&
        uniqueIdentificationNumber
      ) &&
      productResponsibilityOrganization.trim() !== "" &&
      uniqueIdentificationNumber.trim() !== ""
    );
  }

  @action
  async acceptTerms() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    this.isSubmitting = true;

    const { data } = await client.mutate<AcceptFrTermsResponse, void>({
      mutation: ACCEPT_FRANCE_EPR_TERMS_MUTATION,
    });

    const ok =
      data?.currentMerchant?.merchantTermsAgreed
        ?.acceptFrComplianceTermsOfService.ok;
    const message =
      data?.currentMerchant?.merchantTermsAgreed
        ?.acceptFrComplianceTermsOfService.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not accept terms of service.`);
      return;
    }

    await navigationStore.reload();
  }

  @action
  async submit() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const {
      upsertAction,
      uinId,
      category,
      productResponsibilityOrganization,
      uniqueIdentificationNumber,
    } = this;

    if (
      uinId == null &&
      category == null &&
      productResponsibilityOrganization == null &&
      uniqueIdentificationNumber == null
    ) {
      toastStore.negative(i`Could not add EPR registration number.`);
      return;
    }

    const input = {
      action: upsertAction,
      uinId,
      category,
      productResponsibilityOrganization,
      uniqueIdentificationNumber,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertFrUinComplianceResponse,
      { input: FranceProductUniqueIdentificationNumberUpsertInput }
    >({
      mutation: UPSERT_PRODUCT_UIN_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.productCompliance?.frCompliance?.upsertUin.ok;
    const message =
      data?.policy?.productCompliance?.frCompliance?.upsertUin.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not add EPR registration number.`);
      return;
    }

    toastStore.positive(i`EPR registration number has been added!`, {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.reload();
  }

  @action
  async delete() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    this.upsertAction = "DELETE";

    const { upsertAction, uinId, category } = this;

    if (uinId == null) {
      toastStore.negative(i`Could not delete EPR registration number.`);
      return;
    }

    const input = {
      action: upsertAction,
      category,
      uinId,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertFrUinComplianceResponse,
      { input: FranceProductUniqueIdentificationNumberUpsertInput }
    >({
      mutation: UPSERT_PRODUCT_UIN_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.productCompliance?.frCompliance?.upsertUin.ok;
    const message =
      data?.policy?.productCompliance?.frCompliance?.upsertUin.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Could not delete EPR registration number.`
      );
      return;
    }

    toastStore.positive(i`EPR registration number has been deleted.`, {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.reload();
  }

  @action
  async linkProduct() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const { compliance, productIds, uinIds } = this;

    if (productIds == null || productIds.length < 1) {
      toastStore.negative(i`Could not link product(s).`);
      return;
    }

    const input = {
      compliance,
      action: "UPDATE_FRANCE_UIN" as LinkProductComplianceAction,
      productIds,
      uinIds,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertLinkProductComplianceResponse,
      { input: LinkProductComplianceUpsertInput }
    >({
      mutation: UPSERT_FR_LINK_PRODUCT_COMPLIANCE_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.productCompliance?.frCompliance?.upsertLink.ok;
    const message =
      data?.policy?.productCompliance?.frCompliance?.upsertLink.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not link products.`);
      return;
    }

    toastStore.positive(i`Products have been linked`, {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.reload();
  }
}
