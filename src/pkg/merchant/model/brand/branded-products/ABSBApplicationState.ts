/* External Libraries */
import { observable, computed, action } from "mobx";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Merchant API */
import * as absbApi from "@merchant/api/brand/authentic-brand-seller-application";

/* Type Imports */
import { AttachmentInfo } from "@ContextLogic/lego";
import { TrueBrandObject } from "@merchant/component/brand/branded-products/BrandSearch";
import { ABSBApplicationSellerType } from "@toolkit/brand/branded-products/abs";

export type ApplicationStep =
  | "BRAND_NAME"
  | "AUTHORIZATION_TYPE"
  | "TRADEMARK_REGISTRATIONS"
  | "BRANDED_PRODUCT_DECLARATION";

export default class ABSBApplicationState {
  @observable steps: Array<ApplicationStep> = ["BRAND_NAME"];
  @observable brand: TrueBrandObject | null = null;
  @observable brandValid: boolean = false;
  @observable authorizationType:
    | ABSBApplicationSellerType
    | null
    | undefined = null;

  @observable documents: ReadonlyArray<Partial<AttachmentInfo>> = [];
  @observable regions: string | null | undefined = null;
  @observable regionsValid: boolean = false;
  @observable brandOwner: string | null | undefined = null;
  @observable brandOwnerValid: boolean = false;
  @observable brandRep: string | null | undefined = null;
  @observable brandRepValid: boolean = false;
  @observable brandRepTitle: string | null | undefined = null;
  @observable brandRepTitleValid: boolean = false;
  @observable phoneNumber: string | null | undefined = null;
  @observable phoneNumberValid: boolean = false;
  @observable email: string | null | undefined = null;
  @observable emailValid: boolean = false;
  @observable acceptedContract: boolean = false;
  @observable isSubmitting: boolean = false;
  @observable trademarkEdited: boolean = false;

  @computed
  get currentStep(): ApplicationStep {
    return this.steps[this.steps.length - 1];
  }

  @computed
  get brandNameStepComplete(): boolean {
    return this.brand != null && this.brandValid;
  }

  @computed
  get brandNameStepVisible(): boolean {
    return true;
  }

  @computed get documentsValid(): boolean {
    return this.documents.length > 0;
  }

  @computed
  get authorizationTypeStepComplete(): boolean {
    return this.authorizationType != null;
  }

  @computed
  get authorizationTypeStepVisible(): boolean {
    return true;
  }

  @computed
  get trademarkRegistrationsStepComplete(): boolean {
    return (
      this.documentsValid &&
      this.regionsValid &&
      this.brandOwnerValid &&
      this.brandRepValid &&
      this.brandRepTitleValid &&
      this.phoneNumberValid &&
      this.emailValid
    );
  }

  @computed
  get trademarkRegistrationsStepVisible(): boolean {
    return (
      this.authorizationType === "BRAND_OWNER" ||
      this.authorizationType === "AUTHORIZED_RESELLER"
    );
  }

  @computed
  get brandedProductDeclarationStepComplete(): boolean {
    return this.acceptedContract;
  }

  @computed
  get brandedProductDeclarationStepVisible(): boolean {
    return (
      this.authorizationType === "BRAND_OWNER" ||
      this.authorizationType === "AUTHORIZED_RESELLER"
    );
  }

  @computed
  get isEditing(): boolean {
    return !this.isSubmitting && this.brand != undefined;
  }

  @action
  setCurrentStep = (nextStep: ApplicationStep) => {
    this.steps.push(nextStep);
  };

  @action setBrand = (brand: TrueBrandObject | null) => {
    if (brand) {
      this.brand = brand;
      this.brandValid = true;
    } else {
      this.brand = null;
      this.brandValid = false;
    }
  };

  @action setAuthorizationType = (
    authorizationType: ABSBApplicationSellerType
  ) => {
    this.authorizationType = authorizationType;
  };

  @action
  exitApplication = () => {
    const { navigationStore } = AppStore.instance();
    navigationStore.navigate(`/branded-products/authentic-brand-seller`);
  };

  @action
  goPreviousStep = () => {
    if (this.steps.length > 1) {
      this.steps.pop();
    } else {
      this.exitApplication();
    }
  };

  async submit() {
    this.isSubmitting = true;
    const authDocsJsons = this.documents.map((doc) => doc.serverParams);
    const createParams = {
      brand_id: this.brand?.id,
      authorization_type: this.authorizationType,
      auth_docs_json_str: JSON.stringify(authDocsJsons),
      brand_owner: this.brandOwner,
      brand_rep: this.brandRep,
      brand_rep_title: this.brandRepTitle,
      phone_number: this.phoneNumber,
      email: this.email,
      regions: this.regions,
    };

    let succeeded = false;
    try {
      const response = await absbApi.createAbsbApplication(createParams).call();
      succeeded = response.code === 0;
    } finally {
      const { navigationStore } = AppStore.instance();
      const status = succeeded ? "success" : "fail";
      navigationStore.navigate(
        `/branded-products/authentic-brand-seller?submission=${status}`
      );
    }
  }
}
