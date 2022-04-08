import { observable, action, computed } from "mobx";

/* Type */
import {
  CountryCode,
  MerchantTaxIdentificationBusinessType,
  MerchantTaxIdentificationFormType,
  MerchantTaxIdentificationMutationsUpsertMerchantTaxIdentificationArgs,
  MerchantTaxIdentificationPaymentReceiverEntity,
  MerchantTaxIdentificationSelfIdentityClassification,
  UpsertMerchantTaxIdentificationInput,
} from "@schema/types";

/* Toolkit */
import {
  BenefitProvisionLimitationType,
  ChapterThreeStatusEntityType,
  LLCTaxClassificationType,
  TAX_IDENTIFICATION_ERRORS,
  UpsertMerchantTaxIdentificationResponseType,
  UPSERT_MERCHANT_TAX_IDENTIFICATION_MUTATION,
  TaxTreatyBenefitErrorType,
  MerchantAddressErrorType,
  IdentificationErrorType,
  TaxFormErrorType,
} from "@toolkit/tax/identification";
import {
  computeEmptyTextInputError,
  formattedAddressInput,
  isEmptyTextInput,
  isValidTaxID,
  isNumber,
} from "@toolkit/tax/util";

/* Store */
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";

/**
 * Tax identification form states
 */
export default class TaxIdentificationState {
  @observable
  countryOfDomicile: CountryCode | null | undefined;

  @observable
  paymentReceiverIdentity:
    | MerchantTaxIdentificationPaymentReceiverEntity
    | undefined;

  @observable
  selfIdentityClassification:
    | MerchantTaxIdentificationSelfIdentityClassification
    | undefined;

  @observable
  domicileExplanation: string | null | undefined;

  @observable
  identificationState: IdentificationState = new IdentificationState();

  @observable
  taxTreatyBenefitState: TaxTreatyBenefitState = new TaxTreatyBenefitState();

  @observable
  signDate: Date | undefined;

  @observable
  signName: string | null | undefined; // TODO: api

  @observable
  canSignOnbehalfOfEntity: boolean | undefined;

  // W9 Business form specific states
  @observable
  isBackupWithholding: boolean | undefined; // TODO: api

  @observable
  businessType: MerchantTaxIdentificationBusinessType | undefined;

  @observable
  otherBusinessType: string | null | undefined; // TODO: api

  @observable
  llcTaxClassificationType: LLCTaxClassificationType | undefined; // TODO: replace with be type

  @observable
  exemptionPayeeCode: string | null | undefined; // TODO: api

  @observable
  exemptionFATCAReportingCode: string | null | undefined; // TODO: api

  // form status
  @observable
  isSubmitting: boolean = false;

  @observable
  submitted: boolean = false;

  @observable
  showErrors: boolean = false;

  constructor(countryOfDomicile: CountryCode | null | undefined) {
    this.countryOfDomicile = countryOfDomicile;
  }

  /*
   * -------------------------
   *   computed states
   * -------------------------
   */

  /** Return formatted name for address input */
  @computed
  get name(): string | undefined | null {
    const { identificationState } = this;

    if (this.isBusiness) {
      return identificationState.businessName;
    }
    return (
      identificationState.firstName &&
      identificationState.lastName &&
      `${identificationState.firstName} ${identificationState.lastName}`
    );
  }

  /** Return whether merchant is a business entity */
  @computed
  get isBusiness(): boolean {
    return this.selfIdentityClassification === "BUSINESS";
  }

  /** Return whether merchant has no US TIN */
  @computed
  get isNonUS(): boolean {
    return this.paymentReceiverIdentity === "NON_US";
  }

  /** Return form type based on merchant information inputs */
  @computed
  get formType(): MerchantTaxIdentificationFormType | null {
    const { paymentReceiverIdentity, selfIdentityClassification } = this;

    if (paymentReceiverIdentity && selfIdentityClassification) {
      if (paymentReceiverIdentity === "US") {
        return "W_9";
      } else if (selfIdentityClassification === "INDIVIDUAL") {
        return "W_8BEN";
      } else if (selfIdentityClassification === "BUSINESS") {
        return "W_8BEN_E";
      }
    }
    return null;
  }

  /** Convert sign date to unix */
  @computed
  get unixSignDate(): number | null {
    return this.signDate ? this.signDate.getTime() / 1000 : null;
  }

  /** Return whether the merchant info form section is incomplete */
  @computed
  get isMerchantInfoFormIncomplete(): boolean {
    return (
      this.selfIdentityClassification === undefined ||
      this.paymentReceiverIdentity === undefined
    );
  }

  /** Return all form errrors */
  @computed
  get formErrors(): TaxFormErrorType {
    return {
      identificationError: this.identificationState.formErrors,
      taxTreatyBenefitError: this.taxTreatyBenefitState.formErrors,
      signDateError:
        this.signDate === undefined ? TAX_IDENTIFICATION_ERRORS.Required : null,
      signNameError: computeEmptyTextInputError(this.signName),
      canSignOnbehalfOfEntityError:
        !!this.canSignOnbehalfOfEntity === false
          ? TAX_IDENTIFICATION_ERRORS.RequiredCheckbox
          : null,
      businessTypeError: computeEmptyTextInputError(this.businessType),
      llcTaxClassificationTypeError: this.llcTypeError,
      otherBusinessTypeError: this.otherBusinessTypeError,
      beneficialOwnerResidentCountryError:
        this.beneficialOwnerResidentCountryError,
      domicileExplanationError: this.domicileExplanationError,
    };
  }

  @computed
  get llcTypeError(): string | null {
    if (
      this.businessType === "LCC" &&
      isEmptyTextInput(this.llcTaxClassificationType)
    ) {
      return TAX_IDENTIFICATION_ERRORS.Required;
    }
    return null;
  }

  // TODO: switch to OTHER type when api is updated
  @computed
  get otherBusinessTypeError(): string | null {
    if (
      this.businessType === "S_CORP" &&
      isEmptyTextInput(this.otherBusinessType)
    ) {
      return TAX_IDENTIFICATION_ERRORS.Required;
    }
    return null;
  }

  @computed
  get beneficialOwnerResidentCountryError(): string | null {
    const {
      formType,
      taxTreatyBenefitState: { formErrors, isBeneficialOwnerResident },
    } = this;
    const { residenceCountryError } = formErrors;

    if (formType === "W_8BEN") {
      return residenceCountryError;
    } else if (formType === "W_8BEN_E") {
      return !!isBeneficialOwnerResident ? residenceCountryError : null;
    }
    return null;
  }

  @computed
  get domicileExplanationError(): string | null {
    if (this.isNonUS && this.countryOfDomicile === "US") {
      return computeEmptyTextInputError(this.domicileExplanation);
    }
    return null;
  }

  @action
  clearFormFields() {
    this.identificationState.clearFormFields();
    this.taxTreatyBenefitState.clearFormFields();
    this.signDate = undefined;
    this.signName = null;
    this.canSignOnbehalfOfEntity = undefined;
    this.isBackupWithholding = undefined;
    this.businessType = undefined;
    this.otherBusinessType = null;
    this.llcTaxClassificationType = undefined;
    this.exemptionPayeeCode = null;
    this.exemptionFATCAReportingCode = null;
  }

  @computed
  get hasSignatureErrors(): boolean {
    const {
      formErrors: { signNameError, signDateError },
    } = this;

    return signNameError !== null || signDateError !== null;
  }

  @computed
  get hasForm9IndividualErrors(): boolean {
    return (
      this.identificationState.hasForm9IndividualErrors ||
      this.hasSignatureErrors
    );
  }

  @computed
  get hasForm9BusinessErrors(): boolean {
    const { formErrors } = this;

    return (
      this.identificationState.hasForm9BusinessErrors ||
      this.hasSignatureErrors ||
      formErrors.businessTypeError !== null ||
      formErrors.llcTaxClassificationTypeError !== null ||
      formErrors.otherBusinessTypeError !== null
    );
  }

  @computed
  get hasForm8IndividualErrors(): boolean {
    return (
      this.identificationState.hasForm8IndividualErrors ||
      this.hasSignatureErrors ||
      this.taxTreatyBenefitState.hasForm8IndividualErrors ||
      this.formErrors.beneficialOwnerResidentCountryError !== null ||
      this.formErrors.domicileExplanationError !== null
    );
  }

  @computed
  get hasForm8BusinessErrors(): boolean {
    const { formErrors } = this;

    return (
      this.identificationState.hasForm8BusinessErrors ||
      this.hasSignatureErrors ||
      this.taxTreatyBenefitState.hasForm8BusinessErrors ||
      formErrors.canSignOnbehalfOfEntityError !== null ||
      formErrors.beneficialOwnerResidentCountryError !== null ||
      this.formErrors.domicileExplanationError !== null
    );
  }

  @computed
  get readyToSubmit(): boolean {
    const { formType, isBusiness } = this;

    if (formType === "W_9" && isBusiness) {
      return !this.hasForm9BusinessErrors;
    } else if (formType === "W_9") {
      return !this.hasForm9IndividualErrors;
    } else if (formType === "W_8BEN") {
      return !this.hasForm8IndividualErrors;
    } else if (formType === "W_8BEN_E") {
      return !this.hasForm8BusinessErrors;
    }
    return false;
  }

  @computed
  get input(): UpsertMerchantTaxIdentificationInput | null {
    const {
      identificationState,
      name,
      paymentReceiverIdentity,
      selfIdentityClassification,
      businessType,
      unixSignDate,
      domicileExplanation,
    } = this;
    const { firstName, lastName, businessName, residenceAddress } =
      identificationState;
    const residenceAddressInput = formattedAddressInput(residenceAddress, name);

    if (
      residenceAddressInput === null ||
      unixSignDate === null ||
      paymentReceiverIdentity === undefined ||
      selfIdentityClassification === undefined
    ) {
      return null;
    }

    return {
      address: residenceAddressInput,
      signDate: { unix: unixSignDate },
      paymentReceiverIdentity,
      selfIdentityClassification,
      firstName,
      lastName,
      businessName,
      businessType,
      employeeIdNumber: "123456789", // TODO: wait for tax api
      foreignTaxId: "123456789", // TODO: wait for tax api
      domicileExplanation,
    };
  }

  @action
  async submit() {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    // check whether form is ready for submit
    this.isSubmitting = true;
    if (!this.readyToSubmit) {
      toastStore.error(
        i`Form information is incomplete or invalid, please correct the highlighted ` +
          i`errors and try again.`
      );
      this.showErrors = true;
      this.isSubmitting = false;
      return;
    }

    // get input
    const { input } = this;
    if (input === null) {
      toastStore.error(i`Something went wrong, please try again.`);
      this.isSubmitting = false;
      return;
    }

    // submit data
    const { data } = await client.mutate<
      UpsertMerchantTaxIdentificationResponseType,
      MerchantTaxIdentificationMutationsUpsertMerchantTaxIdentificationArgs
    >({
      mutation: UPSERT_MERCHANT_TAX_IDENTIFICATION_MUTATION,
      variables: { input },
    });

    const ok =
      data?.currentUser?.merchant?.merchantTaxIdentification
        .upsertMerchantTaxIdentification.ok;
    const message =
      data?.currentUser?.merchant?.merchantTaxIdentification
        .upsertMerchantTaxIdentification.errorMessage;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.error(message || i`Something went wrong, please try again.`);
      return;
    }

    this.submitted = true;
  }
}

/**
 * Identification section states
 */
class IdentificationState {
  @observable
  firstName: string | null | undefined;

  @observable
  lastName: string | null | undefined;

  @observable
  businessName: string | null | undefined;

  @observable
  disregardedEntityName: string | null | undefined; // TODO: api

  @observable
  residenceAddress: MerchantAddressState = new MerchantAddressState();

  @observable
  mailingAddress: MerchantAddressState = new MerchantAddressState(); // TODO: api

  @observable
  isMailingAddressDifferent: boolean | undefined;

  @observable
  taxID: string | null | undefined; // TODO: api

  @observable
  foreignTaxID: string | null | undefined; // TODO: api

  @observable
  isForeignTaxIDNotRequired: boolean | undefined;

  @observable
  chapterThreeStatus: ChapterThreeStatusEntityType | undefined; // TODO: api

  @observable
  isHybridEntity: boolean | undefined;

  @computed
  get formErrors(): IdentificationErrorType {
    return {
      residenceAddressError: this.residenceAddress.formErrors,
      mailingAddressError: this.mailingAddress.formErrors,
      firstNameError: computeEmptyTextInputError(this.firstName),
      lastNameError: computeEmptyTextInputError(this.lastName),
      businessNameError: computeEmptyTextInputError(this.businessName),
      taxIDError: computeEmptyTextInputError(this.taxID),
      foreignTaxIDError: this.foreignTaxIDError,
      chapterThreeStatusError: computeEmptyTextInputError(
        this.chapterThreeStatus
      ),
    };
  }

  @computed
  get foreignTaxIDError(): string | null {
    const {
      foreignTaxID,
      residenceAddress: { countryCode, state },
    } = this;

    if (!!this.isForeignTaxIDNotRequired) {
      return null;
    } else if (foreignTaxID == null || foreignTaxID.trim().length === 0) {
      return TAX_IDENTIFICATION_ERRORS.RequiredForeignTaxID;
    } else if (countryCode == null || countryCode.trim().length === 0) {
      // do not perform pattern check if country code is still undefined
      return null;
    } else if (!isValidTaxID(foreignTaxID, { countryCode, state })) {
      return TAX_IDENTIFICATION_ERRORS.InvalidTaxID;
    }
    return null;
  }

  @computed
  get hasForm9IndividualErrors(): boolean {
    const {
      residenceAddress,
      formErrors: { firstNameError, lastNameError, taxIDError },
    } = this;

    return (
      residenceAddress.hasAddressErrors ||
      firstNameError !== null ||
      lastNameError !== null ||
      taxIDError !== null
    );
  }

  @computed
  get hasForm9BusinessErrors(): boolean {
    const {
      residenceAddress,
      formErrors: { businessNameError, taxIDError },
    } = this;

    return (
      residenceAddress.hasAddressErrors ||
      businessNameError !== null ||
      taxIDError !== null
    );
  }

  @computed
  get hasForm8IndividualErrors(): boolean {
    const {
      isMailingAddressDifferent,
      mailingAddress,
      residenceAddress,
      formErrors: { firstNameError, lastNameError, foreignTaxIDError },
    } = this;

    return (
      residenceAddress.hasAddressErrors ||
      (isMailingAddressDifferent && mailingAddress.hasAddressErrors) ||
      firstNameError !== null ||
      lastNameError !== null ||
      foreignTaxIDError !== null
    );
  }

  @computed
  get hasForm8BusinessErrors(): boolean {
    const {
      isMailingAddressDifferent,
      mailingAddress,
      residenceAddress,
      formErrors: {
        businessNameError,
        foreignTaxIDError,
        chapterThreeStatusError,
      },
    } = this;

    return (
      residenceAddress.hasAddressErrors ||
      (isMailingAddressDifferent && mailingAddress.hasAddressErrors) ||
      businessNameError !== null ||
      foreignTaxIDError !== null ||
      chapterThreeStatusError !== null
    );
  }

  @action
  clearFormFields() {
    this.firstName = null;
    this.lastName = null;
    this.businessName = null;
    this.disregardedEntityName = null;
    this.residenceAddress.clearFormFields();
    this.mailingAddress.clearFormFields();
    this.isMailingAddressDifferent = undefined;
    this.taxID = null;
    this.foreignTaxID = null;
    this.isForeignTaxIDNotRequired = undefined;
    this.chapterThreeStatus = undefined;
    this.isHybridEntity = undefined;
  }
}

/**
 * Merchant address section states
 */
export class MerchantAddressState {
  @observable
  streetAddress1: string | null | undefined;

  @observable
  streetAddress2: string | null | undefined;

  @observable
  city: string | null | undefined;

  @observable
  state: string | null | undefined;

  @observable
  countryCode: CountryCode | undefined;

  @observable
  zipcode: string | null | undefined;

  @computed
  get formErrors(): MerchantAddressErrorType {
    return {
      streetAddress1Error: computeEmptyTextInputError(this.streetAddress1),
      cityError: computeEmptyTextInputError(this.city),
      stateError: computeEmptyTextInputError(this.state),
      countryCodeError: computeEmptyTextInputError(this.countryCode),
      zipcodeError: computeEmptyTextInputError(this.zipcode),
    };
  }

  @computed
  get hasAddressErrors(): boolean {
    const {
      formErrors: {
        streetAddress1Error,
        cityError,
        stateError,
        countryCodeError,
        zipcodeError,
      },
    } = this;

    return (
      streetAddress1Error !== null ||
      cityError !== null ||
      stateError !== null ||
      countryCodeError !== null ||
      zipcodeError !== null
    );
  }

  @action
  clearFormFields() {
    this.streetAddress1 = null;
    this.streetAddress2 = null;
    this.city = null;
    this.state = null;
    this.countryCode = undefined;
    this.zipcode = null;
  }
}

/*
 * Tax treaty benefits section states
 */
class TaxTreatyBenefitState {
  // TODO: match states in this section with api types
  // W8 common states
  @observable
  residenceCountry: string | null | undefined;

  @observable
  provincialArticle: string | null | undefined;

  @observable
  withholdingRate: string | null | undefined;

  @observable
  incomeType: string | null | undefined;

  @observable
  additionalConditions: string | null | undefined;

  // W8-BEN-E specifc states
  @observable
  isBeneficialOwnerResident: boolean | undefined;

  @observable
  isIncomeDerived: boolean | undefined;

  @observable
  benefitProvisionLimitationType: BenefitProvisionLimitationType | undefined;

  @observable
  otherBenefitProvisionLimitationType: string | null | undefined;

  @observable
  isBeneficialOwnerQualifiedForeignResident: boolean | undefined;

  @computed
  get formErrors(): TaxTreatyBenefitErrorType {
    return {
      residenceCountryError: computeEmptyTextInputError(this.residenceCountry),
      withholdingRateError: this.withholdingRateError,
      otherBenefitProvisionLimitationTypeError:
        this.otherBenefitProvisionLimitationTypeError,
    };
  }

  @computed
  get withholdingRateError(): string | null {
    const { withholdingRate } = this;

    if (withholdingRate == null || withholdingRate.trim().length === 0) {
      // withhoding rate can be empty
      return null;
    } else if (isNumber(withholdingRate)) {
      return null;
    }
    return TAX_IDENTIFICATION_ERRORS.NumberOnly;
  }

  @computed
  get otherBenefitProvisionLimitationTypeError(): string | null {
    if (
      this.benefitProvisionLimitationType === "OTHER" &&
      isEmptyTextInput(this.otherBenefitProvisionLimitationType)
    ) {
      return TAX_IDENTIFICATION_ERRORS.Required;
    }
    return null;
  }

  @computed
  get hasForm8IndividualErrors(): boolean {
    return this.formErrors.withholdingRateError !== null;
  }

  @computed
  get hasForm8BusinessErrors(): boolean {
    const { formErrors } = this;
    return (
      this.formErrors.withholdingRateError !== null ||
      formErrors.otherBenefitProvisionLimitationTypeError !== null
    );
  }

  @action
  clearFormFields() {
    this.residenceCountry = null;
    this.provincialArticle = null;
    this.withholdingRate = null;
    this.incomeType = null;
    this.additionalConditions = null;
    this.isBeneficialOwnerResident = undefined;
    this.isIncomeDerived = undefined;
    this.benefitProvisionLimitationType = undefined;
    this.otherBenefitProvisionLimitationType = null;
    this.isBeneficialOwnerQualifiedForeignResident = undefined;
  }
}
