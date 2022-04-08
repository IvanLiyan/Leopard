/* External Libraries */
import { observable, computed, action } from "mobx";

/* Lego Components */
import { AttachmentInfo } from "@ContextLogic/lego";

/* Lego Toolkit */
import { UrlValidator, ObjectIdValidator } from "@toolkit/validators";
import { asyncSleep } from "@ContextLogic/lego/toolkit/mobx";

/* Merchant Stores */
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";
import NavigationStore from "@stores/NavigationStore";

/* Type Imports */
import {
  CountryCode,
  RegulatorReportReason,
  RegulatorAction,
  RegulatorReportAction,
  FileInput,
} from "@schema/types";
import { PickedCountry } from "@merchant/api/report-abuse";
import {
  ReportAbuseGetRegulatorRequestType,
  ReportAbuseGetRegulatorResponseType,
  GET_REGULATOR,
  ReportAbuseUpsertRegulatorRequestType,
  ReportAbuseUpsertRegulatorResponseType,
  UPSERT_REGULATOR,
  ReportAbuseUpsertRegulatorReportRequestType,
  ReportAbuseUpsertRegulatorReportResponseType,
  UPSERT_REGULATOR_REPORT,
  STEPS,
  REPORT_REASONS,
} from "@merchant/api/report-abuse";

export default class ReportAbuseState {
  @observable
  isLoading: boolean = false;

  @observable
  currentStep: number = 1;

  @observable
  email: string | null | undefined;

  @observable
  emailValid: boolean = false;

  @observable
  emailPreviouslyExists: boolean = false;

  @observable
  countries: ReadonlyArray<PickedCountry> | null | undefined;

  @observable
  selectedCountry: CountryCode | null | undefined;

  @observable
  organization: string | null | undefined;

  @observable
  organizationValid: boolean = false;

  @observable
  website: string | null | undefined;

  @observable
  websiteValid: boolean = false;

  @observable
  name: string | null | undefined;

  @observable
  nameValid: boolean = false;

  @observable
  phoneNumber: string | null | undefined;

  @observable
  phoneNumberValid: boolean = false;

  @observable
  title: string | null | undefined;

  @observable
  titleValid: boolean = false;

  @observable
  itemUrls: string | null | undefined;

  @observable
  regulatorReportReasons:
    | ReadonlyArray<RegulatorReportReason>
    | null
    | undefined;

  @observable
  reason: RegulatorReportReason | null | undefined;

  @observable
  description: string | null | undefined;

  @observable
  descriptionValid: boolean = false;

  @observable
  files: ReadonlyArray<AttachmentInfo> | undefined;

  @observable
  confirmation: boolean = false;

  @observable
  referenceNumber: string | null | undefined = undefined;

  @observable
  nextPageEnabled: boolean | undefined = true;

  constructor(params: {
    countries: ReadonlyArray<PickedCountry> | null | undefined;
    regulatorReportReasons:
      | ReadonlyArray<RegulatorReportReason>
      | null
      | undefined;
  }) {
    this.countries = params.countries || [];
    this.regulatorReportReasons = params.regulatorReportReasons || [];
  }

  @computed
  get regulatorReportReasonsOptions(): ReadonlyArray<{
    readonly value: RegulatorReportReason;
    readonly text: string;
  }> {
    return (this.regulatorReportReasons || []).map((reason) => ({
      value: reason,
      text: REPORT_REASONS[reason],
    }));
  }

  @computed
  get showNote(): boolean {
    return this.currentStep !== 4;
  }

  @computed
  get itemUrlsArray(): ReadonlyArray<string> | null | undefined {
    return (this.itemUrls || "")
      .split(/\s+|,/)
      .filter((string) => string.length > 0)
      .map((url) => url.trim());
  }

  @computed
  get itemUrlsValid(): Promise<boolean> {
    const result = async (): Promise<boolean> => {
      let returnVal = true;
      for (const urlOrPID of this.itemUrlsArray || []) {
        const urlValidator = new UrlValidator();
        const productIdValidator = new ObjectIdValidator();
        const checkValidation = async () => {
          const urlError = await urlValidator.validateText(urlOrPID);
          const pidError = await productIdValidator.validateText(urlOrPID);

          if (urlError && pidError) {
            returnVal = false;
          }
        };

        await checkValidation();
      }
      return returnVal;
    };
    return result();
  }

  @computed
  get supportingFiles(): ReadonlyArray<FileInput> {
    return (this.files || []).map((attachmentInfo) => {
      return {
        url: attachmentInfo.url,
        fileName: attachmentInfo.fileName,
      };
    });
  }

  @computed
  get canSubmit(): boolean | undefined {
    if (this.currentStep === 1) {
      return this.emailValid;
    }

    const regulatorFormComplete =
      this.emailValid &&
      this.selectedCountry != null &&
      this.organizationValid &&
      this.websiteValid &&
      this.nameValid;
    if (this.currentStep === 2) {
      return regulatorFormComplete;
    }

    const reportListingsFormComplete =
      regulatorFormComplete &&
      this.itemUrlsValid &&
      this.reason != null &&
      this.descriptionValid &&
      this.files != null &&
      this.files.length > 0 &&
      this.confirmation;
    if (this.currentStep === 3) {
      return reportListingsFormComplete;
    }

    return false;
  }

  @computed
  get nextStepPath(): string | null | undefined {
    const nextStep = this.canSubmit ? STEPS[this.currentStep + 1] : null;
    return nextStep != null
      ? nextStep.path
      : "/trust-and-safety/regulator-portal/";
  }

  @computed
  get previousStepPath(): string | null | undefined {
    const previousStep = STEPS[this.currentStep - 1];
    return this.currentStep === 0 || previousStep == null
      ? "/trust-and-safety/regulator-portal/"
      : previousStep.path;
  }

  @computed
  get emailIncomplete(): boolean | null | undefined {
    return this.email == null;
  }

  @computed
  get regulatorIncomplete(): boolean | null | undefined {
    return (
      this.selectedCountry == null ||
      this.organization == null ||
      this.website == null ||
      this.name == null ||
      this.email == null
    );
  }

  @computed
  get reportIncomplete(): boolean | null | undefined {
    return (
      this.regulatorIncomplete ||
      this.reason == null ||
      this.description == null ||
      this.files == null ||
      this.itemUrlsArray == null ||
      this.email == null
    );
  }

  @action
  next = async () => {
    const navStore = NavigationStore.instance();
    const { nextStepPath } = this;
    if (!this.nextPageEnabled) {
      return;
    } else if (nextStepPath != null) {
      navStore.pushPath(nextStepPath, navStore.queryParams);
      this.currentStep++;
    }
  };

  @action
  back = () => {
    const navStore = NavigationStore.instance();
    const { previousStepPath } = this;
    if (previousStepPath != null) {
      navStore.pushPath(previousStepPath, navStore.queryParams);
      this.currentStep--;
    }
  };

  getRegulator = async () => {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();
    this.isLoading = true;

    if (this.email == null) {
      toastStore.warning(i`Email is required`);
      this.isLoading = false;
      return;
    }

    const { data } = await client.query<
      ReportAbuseGetRegulatorResponseType,
      ReportAbuseGetRegulatorRequestType
    >({
      query: GET_REGULATOR,
      variables: { emailAddress: this.email },
      fetchPolicy: "no-cache",
    });

    this.isLoading = false;

    const regulatorInfo = data?.policyPublic?.reportAbuse?.regulator;

    if (regulatorInfo == null) {
      this.name = null;
      this.phoneNumber = null;
      this.website = null;
      this.title = null;
      this.organization = null;
      this.selectedCountry = null;
      this.emailPreviouslyExists = false;
      return;
    }

    const { name, phoneNumber, website, title, organization, country } =
      regulatorInfo;

    this.name = name;
    this.phoneNumber = phoneNumber;
    this.website = website;
    this.title = title;
    this.organization = organization;
    this.selectedCountry = country.code;
    this.emailPreviouslyExists = true;
  };

  upsertRegulator = async () => {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();
    this.isLoading = true;

    if (
      this.selectedCountry == null ||
      this.organization == null ||
      this.website == null ||
      this.name == null ||
      this.email == null
    ) {
      toastStore.warning(
        i`Regulator information is incomplete, please fill out missing information`
      );
      this.isLoading = false;
      return;
    }

    const input = {
      action: `UPSERT` as RegulatorAction,
      countryRegionCode: this.selectedCountry,
      organization: this.organization,
      website: this.website,
      name: this.name,
      emailAddress: this.email,
      phoneNumber: this.phoneNumber,
      title: this.title,
    };

    const { data } = await client.mutate<
      ReportAbuseUpsertRegulatorResponseType,
      ReportAbuseUpsertRegulatorRequestType
    >({
      mutation: UPSERT_REGULATOR,
      variables: { input },
    });

    if (data == null || !data.policyPublic.reportAbuse.upsertRegulator.ok) {
      toastStore.error(i`Something went wrong`);
      return;
    }

    const upsertRegulatorStatusInfo =
      data.policyPublic.reportAbuse.upsertRegulator;
    this.nextPageEnabled = upsertRegulatorStatusInfo.ok;
    if (upsertRegulatorStatusInfo == null || !upsertRegulatorStatusInfo.ok) {
      toastStore.error(i`Something went wrong`);
      this.isLoading = false;
      return;
    }

    this.isLoading = false;

    toastStore.positive(i`Regulator information saved`);
  };

  upsertRegulatorReport = async () => {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();
    const navigationStore = NavigationStore.instance();
    this.isLoading = true;

    if (
      this.reason == null ||
      this.description == null ||
      this.files == null ||
      this.itemUrlsArray == null ||
      this.email == null
    ) {
      toastStore.warning(
        i`Report information is incomplete, please fill out missing information`
      );
      this.isLoading = false;
      return;
    }

    const input = {
      action: `CREATE` as RegulatorReportAction,
      reason: this.reason,
      description: this.description,
      supportingFiles: this.supportingFiles,
      urls: this.itemUrlsArray,
      emailAddress: this.email,
      caseNumber: this.referenceNumber,
    };
    const { data } = await client.mutate<
      ReportAbuseUpsertRegulatorReportResponseType,
      ReportAbuseUpsertRegulatorReportRequestType
    >({
      mutation: UPSERT_REGULATOR_REPORT,
      variables: { input },
    });

    this.isLoading = false;

    if (data == null) {
      toastStore.error(i`Something went wrong`);
      await asyncSleep(3000);
      navigationStore.navigate("/trust-and-safety/regulator-portal");
      return;
    }
    const upsertRegulatorReportStatusInfo =
      data.policyPublic.reportAbuse.upsertRegulatorReport;
    this.nextPageEnabled = upsertRegulatorReportStatusInfo.ok;
    if (upsertRegulatorReportStatusInfo.ok) {
      toastStore.positive(i`Report saved`);
      this.referenceNumber = upsertRegulatorReportStatusInfo.message;
    } else {
      const errorMessage =
        upsertRegulatorReportStatusInfo.message != null
          ? upsertRegulatorReportStatusInfo.message
          : i`Report not saved`;
      toastStore.error(errorMessage);
    }
  };
}
