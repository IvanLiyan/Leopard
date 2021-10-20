import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";
import {
  EuvatTaxQuestionnaireInput,
  UploadEuvatTaxQuestionnaire,
  CountryCode,
} from "@schema/types";

const EU_VAT_QUESTIONNAIRE_MUTATION = gql`
  mutation EuVatQuestionnaireState_UploadEuvatTaxQuestionnaireMutation(
    $input: EUVATTaxQuestionnaireInput!
  ) {
    currentMerchant {
      euVatTax {
        uploadVatTaxQuestionnaire(input: $input) {
          ok
          errorMessage
        }
      }
    }
  }
`;

type UploadEuvatTaxQuestionnaireResponse = {
  readonly currentMerchant?: {
    readonly euVatTax?: {
      readonly uploadVatTaxQuestionnaire: Pick<
        UploadEuvatTaxQuestionnaire,
        "ok" | "errorMessage"
      >;
    };
  };
};

export default class EuVatQuestionnaireState {
  @observable
  subjectToTaxInEu: boolean | null | undefined;

  @observable
  employPersonnelInEu: boolean | null | undefined;

  @observable
  businessAddressInEu: boolean | null | undefined;

  @observable
  registeredWithTradeRegistryInEu: boolean | null | undefined;

  @observable
  fileUrl: string | null | undefined;

  @observable
  vatNumber: string | null | undefined;

  @observable
  businessRegistrationNumber: string | null | undefined;

  @observable
  euVatRegistrationCountryCode: CountryCode | null | undefined;

  // Business address
  @observable
  streetAddress1: string | null | undefined;

  @observable
  countryCode: CountryCode | null | undefined;

  @observable
  state: string | null | undefined;

  @observable
  city: string | null | undefined;

  @observable
  zipcode: string | null | undefined;

  @observable
  isSubmitting: boolean = false;

  @observable
  redirect: string | null | undefined;

  @computed
  get euTradeRegistrationErrorMsg(): string | null {
    if (
      this.registeredWithTradeRegistryInEu &&
      (this.vatNumber == null || this.vatNumber.trim() === "") &&
      (this.businessRegistrationNumber == null ||
        this.businessRegistrationNumber.trim() === "")
    ) {
      return (
        i`Please provide the Value-Added Tax (VAT) Number and/or Business Registration ` +
        i`Number.`
      );
    }
    return null;
  }

  @computed
  get isValid(): boolean {
    if (
      this.subjectToTaxInEu == null ||
      (this.subjectToTaxInEu && this.fileUrl == null) ||
      (!this.subjectToTaxInEu && this.employPersonnelInEu == null) ||
      (!this.subjectToTaxInEu && this.businessAddressInEu == null) ||
      (!this.subjectToTaxInEu &&
        this.registeredWithTradeRegistryInEu == null) ||
      (this.registeredWithTradeRegistryInEu &&
        this.vatNumber == null &&
        this.businessRegistrationNumber == null)
    ) {
      return false;
    }

    return true;
  }

  @action
  async submit() {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

    this.isSubmitting = true;

    const addressInput =
      this.businessAddressInEu &&
      this.streetAddress1 != null &&
      this.zipcode != null &&
      this.city != null &&
      this.state != null &&
      this.countryCode != null
        ? {
            address: this.streetAddress1,
            zipcode: this.zipcode,
            city: this.city,
            state: this.state,
            countryCode: this.countryCode as CountryCode,
          }
        : null;

    const input = {
      subjectToTaxInEu: this.subjectToTaxInEu,
      employPersonnelInEu: this.employPersonnelInEu,
      businessAddressInEu: this.businessAddressInEu,
      businessAddress: addressInput,
      fileUrl: this.fileUrl,
      registeredWithTradeRegistryInEu: this.registeredWithTradeRegistryInEu,
      euVatRegistration:
        this.vatNumber != null && this.euVatRegistrationCountryCode != null
          ? {
              vatNumber: this.vatNumber,
              countryCode: this.euVatRegistrationCountryCode,
            }
          : null,
      businessRegistrationNumber:
        this.businessRegistrationNumber != null
          ? this.businessRegistrationNumber
          : null,
    };

    const { data } = await client.mutate<
      UploadEuvatTaxQuestionnaireResponse,
      { input: EuvatTaxQuestionnaireInput }
    >({
      mutation: EU_VAT_QUESTIONNAIRE_MUTATION,
      variables: { input },
    });

    const ok = data?.currentMerchant?.euVatTax?.uploadVatTaxQuestionnaire.ok;
    const message =
      data?.currentMerchant?.euVatTax?.uploadVatTaxQuestionnaire.errorMessage;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`,
      );
      return;
    }

    if (this.redirect != null) {
      await navigationStore.navigate(this.redirect);
    } else {
      await navigationStore.navigate("/");
    }

    toastStore.positive(i`Your questionnaire data is submitted successfully.`, {
      timeoutMs: 7000,
      deferred: true,
    });
  }
}
