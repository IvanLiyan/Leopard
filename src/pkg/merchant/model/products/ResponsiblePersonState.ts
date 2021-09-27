import gql from "graphql-tag";
import { observable, action, computed } from "mobx";
import {
  UpsertResponsiblePerson,
  ResponsiblePersonAction,
  ResponsiblePersonUpsertInput,
  ResponsiblePersonCompliance,
  LinkProductComplianceUpsertInput,
  LinkProductComplianceAction,
  UpsertLinkProductCompliance,
  CountryCode,
  EuComplianceResponsiblePersonCountriesAndRegionsCode,
  AcceptEuComplianceTermsOfService,
  ResponsiblePersonRejectionReason,
  ResponsiblePersonStatus,
} from "@schema/types";

import { PickedResponsiblePerson } from "@toolkit/products/responsible-person";

import ToastStore from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";

const ACCEPT_EU_TERMS_MUTATION = gql`
  mutation ResponsiblePersonState_AcceptEuTermsMutation {
    currentMerchant {
      merchantTermsAgreed {
        acceptEuComplianceTermsOfService {
          ok
          message
        }
      }
    }
  }
`;

const UPSERT_RESPONSIBLE_PERSON_MUTATION = gql`
  mutation ResponsiblePersonState_UpsertResponsiblePersonMutation(
    $input: ResponsiblePersonUpsertInput!
  ) {
    policy {
      euCompliance {
        upsertResponsiblePerson(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

const UPSERT_LINK_PRODUCT_COMPLIANCE_MUTATION = gql`
  mutation ResponsiblePersonState_UpsertLinkProductComplianceMutation(
    $input: LinkProductComplianceUpsertInput!
  ) {
    policy {
      euCompliance {
        upsertLink(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type AcceptEuTermsResponse = {
  readonly currentMerchant?: {
    readonly merchantTermsAgreed?: {
      readonly acceptEuComplianceTermsOfService: Pick<
        AcceptEuComplianceTermsOfService,
        "ok" | "message"
      >;
    };
  };
};

type UpsertResponsiblePersonResponse = {
  readonly policy?: {
    readonly euCompliance?: {
      readonly upsertResponsiblePerson: Pick<
        UpsertResponsiblePerson,
        "ok" | "message"
      >;
    };
  };
};

type UpsertLinkProductComplianceResponse = {
  readonly policy?: {
    readonly euCompliance?: {
      readonly upsertLink: Pick<UpsertLinkProductCompliance, "ok" | "message">;
    };
  };
};

type ReviewState = Extract<ResponsiblePersonAction, "REJECT" | "APPROVE">;

export default class ResponsiblePersonState {
  compliance: ResponsiblePersonCompliance = "EU_REGULATION_20191020_MSR";

  @observable
  upsertAction: ResponsiblePersonAction;

  @observable
  responsiblePersonId: string | null | undefined;

  @observable
  email: string | null | undefined;

  @observable
  name: string | null | undefined;

  @observable
  streetAddress1: string | null | undefined;

  @observable
  streetAddress2: string | null | undefined;

  @observable
  state: string | null | undefined;

  @observable
  city: string | null | undefined;

  @observable
  zipcode: string | null | undefined;

  @observable
  countryCode:
    | EuComplianceResponsiblePersonCountriesAndRegionsCode
    | null
    | undefined;

  @observable
  countryOrRegionName: string | null | undefined;

  @observable
  phoneNumber: string | null | undefined;

  @observable
  merchantName: string | null | undefined;

  @observable
  merchantId: string | null | undefined;

  @observable
  merchantCountryCode: CountryCode | null | undefined;

  @observable
  rejectReason: ResponsiblePersonRejectionReason | null | undefined;

  @observable
  status: ResponsiblePersonStatus | null | undefined;

  @observable
  isSubmitting: boolean = false;

  constructor(args?: PickedResponsiblePerson) {
    if (args != null) {
      const {
        id,
        email,
        address: {
          name,
          streetAddress1,
          streetAddress2,
          city,
          state,
          zipcode,
          phoneNumber,
          country,
        },
        merchantId,
        merchant: { displayName, countryOfDomicile },
        status,
      } = args;
      this.responsiblePersonId = id;
      this.email = email;
      this.name = name;
      this.streetAddress1 = streetAddress1;
      this.streetAddress2 = streetAddress2;
      this.city = city;
      this.state = state;
      this.zipcode = zipcode;
      this.phoneNumber = phoneNumber;
      this.countryCode = country?.code;
      this.countryOrRegionName = country?.name;
      this.merchantId = merchantId;
      this.merchantName = displayName;
      this.merchantCountryCode = countryOfDomicile?.code;
      this.status = status;
      this.upsertAction = "UPDATE" as ResponsiblePersonAction;

      return;
    }
    this.upsertAction = "CREATE" as ResponsiblePersonAction;
  }

  @computed
  get isValid(): boolean {
    const { email, name, streetAddress1, city, state, zipcode, countryCode } =
      this;

    return !!(
      email &&
      name &&
      streetAddress1 &&
      city &&
      state &&
      zipcode &&
      countryCode
    );
  }

  @action
  async acceptTerms() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    this.isSubmitting = true;

    const { data } = await client.mutate<AcceptEuTermsResponse, void>({
      mutation: ACCEPT_EU_TERMS_MUTATION,
    });

    const ok =
      data?.currentMerchant?.merchantTermsAgreed
        ?.acceptEuComplianceTermsOfService.ok;
    const message =
      data?.currentMerchant?.merchantTermsAgreed
        ?.acceptEuComplianceTermsOfService.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not accept terms of service.`);
      return;
    }

    await navigationStore.navigate("/product/responsible-person");
  }

  @action
  async submit() {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const {
      upsertAction,
      responsiblePersonId,
      compliance,
      email,
      name,
      streetAddress1,
      streetAddress2,
      city,
      state,
      zipcode,
      countryCode,
      phoneNumber,
    } = this;

    if (
      email == null ||
      name == null ||
      streetAddress1 == null ||
      city == null ||
      state == null ||
      zipcode == null ||
      countryCode == null
    ) {
      toastStore.negative(i`Could not add responsible person.`);
      return;
    }

    const input = {
      action: upsertAction,
      compliance,
      email,
      address: {
        name,
        streetAddress1,
        streetAddress2,
        city,
        state,
        zipcode,
        countryCode,
        phoneNumber,
      },
      ...(responsiblePersonId != null ? { responsiblePersonId } : {}),
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertResponsiblePersonResponse,
      { input: ResponsiblePersonUpsertInput }
    >({
      mutation: UPSERT_RESPONSIBLE_PERSON_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.euCompliance?.upsertResponsiblePerson.ok;
    const message = data?.policy?.euCompliance?.upsertResponsiblePerson.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not add responsible person.`);
      return;
    }

    toastStore.positive(i`Responsible person has been added!`, {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.navigate("/product/responsible-person");
  }

  @action
  async delete(responsiblePersonId: string) {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const { compliance } = this;

    if (responsiblePersonId == null) {
      toastStore.negative(i`Could not delete responsible person.`);
      return;
    }

    const input = {
      action: "DELETE" as ResponsiblePersonAction,
      responsiblePersonId,
      compliance,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertResponsiblePersonResponse,
      { input: ResponsiblePersonUpsertInput }
    >({
      mutation: UPSERT_RESPONSIBLE_PERSON_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.euCompliance?.upsertResponsiblePerson.ok;
    const message = data?.policy?.euCompliance?.upsertResponsiblePerson.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not delete responsible person.`);
      return;
    }

    toastStore.positive(i`Responsible person has been deleted.`, {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.navigate("/product/responsible-person");
  }

  @action
  async linkProduct(
    productIds: ReadonlyArray<string>,
    responsiblePersonId: string,
  ) {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const { compliance } = this;

    if (productIds.length === 0) {
      toastStore.negative(i`Could not link responsible person.`);
      return;
    }

    const input = {
      action: "UPDATE_EU_RP" as LinkProductComplianceAction,
      responsiblePersonId,
      compliance,
      productIds,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertLinkProductComplianceResponse,
      { input: LinkProductComplianceUpsertInput }
    >({
      mutation: UPSERT_LINK_PRODUCT_COMPLIANCE_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.euCompliance?.upsertLink.ok;
    const message = data?.policy?.euCompliance?.upsertLink.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not link responsible person.`);
      return;
    }

    toastStore.positive(i`Responsible person has been linked.`, {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.navigate("/product/responsible-person");
  }

  // Should be used for admins only
  /* eslint-disable local-rules/unwrapped-i18n */
  @action
  async review(responsiblePersonId: string, reviewState: ReviewState) {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const { rejectReason, compliance } = this;

    if (responsiblePersonId == null) {
      toastStore.negative("Could not review responsible person.");
      return;
    }

    const input = {
      action: reviewState,
      responsiblePersonId,
      compliance,
      rejectReason,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertResponsiblePersonResponse,
      { input: ResponsiblePersonUpsertInput }
    >({
      mutation: UPSERT_RESPONSIBLE_PERSON_MUTATION,
      variables: { input },
    });

    const ok = data?.policy?.euCompliance?.upsertResponsiblePerson.ok;
    const message = data?.policy?.euCompliance?.upsertResponsiblePerson.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || "Could not review responsible person.");
      return;
    }

    toastStore.positive("Responsible person has been reviewed.", {
      timeoutMs: 7000,
      deferred: true,
    });

    await navigationStore.reload();
  }
  /* eslint-enable local-rules/unwrapped-i18n */
}
