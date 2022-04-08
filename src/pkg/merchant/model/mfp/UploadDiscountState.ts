/* External Libraries */
import { observable, computed } from "mobx";

import { CountryCode } from "@schema/types";
import { UploadCampaignStep } from "@merchant/model/mfp/UploadCampaignState";
import { UploadVariationInfo } from "@toolkit/mfp/dashboard";
import {
  discountStartTimeError,
  discountEndTimeError,
  MfpUploadCampaignInitialData,
  campaignNameError,
} from "@toolkit/mfp/tools";

export default class UploadDiscountState {
  @observable
  initialData: MfpUploadCampaignInitialData;

  @observable
  campaignName?: string;

  @observable
  startDate?: Date;

  @observable
  startHour?: number;

  @observable
  endDate?: Date;

  @observable
  endHour?: number;

  @observable
  countries: ReadonlyArray<CountryCode> = [];

  @observable
  data?: ReadonlyArray<UploadVariationInfo>;

  @observable
  showCampaignDetailsErrors: boolean = false;

  constructor({
    initialData,
  }: {
    readonly initialData: MfpUploadCampaignInitialData;
  }) {
    this.initialData = initialData;
  }

  @computed
  get campaignNameError(): string | null | undefined {
    const { campaignName } = this;
    return campaignNameError({ name: campaignName });
  }

  @computed
  get startDateError(): string | null | undefined {
    const {
      startDate,
      startHour,
      initialData: { platformConstants },
    } = this;

    const minCampaignDelayInHour =
      platformConstants == null ||
      platformConstants.mfp == null ||
      platformConstants.mfp.campaign == null
        ? null
        : platformConstants.mfp.campaign.minCampaignDelayInHour;

    const maxCampaignDelayInHour =
      platformConstants == null ||
      platformConstants.mfp == null ||
      platformConstants.mfp.campaign == null
        ? null
        : platformConstants.mfp.campaign.maxCampaignDelayInHour;

    return discountStartTimeError({
      startDate,
      startHour,
      minCampaignDelayInHour,
      maxCampaignDelayInHour,
    });
  }

  @computed
  get endDateError(): string | null | undefined {
    const {
      startDate,
      startHour,
      endDate,
      endHour,
      initialData: { platformConstants },
    } = this;
    const maxCampaignDurationInDays =
      platformConstants == null ||
      platformConstants.mfp == null ||
      platformConstants.mfp.campaign == null
        ? null
        : platformConstants.mfp.campaign.maxCampaignDurationInDays;

    return discountEndTimeError({
      startDate,
      startHour,
      endDate,
      endHour,
      maxCampaignDurationInDays,
    });
  }

  @computed
  get step(): UploadCampaignStep {
    const { campaignNameError, startDateError, endDateError } = this;
    if (
      campaignNameError != null ||
      startDateError != null ||
      endDateError != null
    ) {
      return "ENTER_DETAILS";
    }
    if (this.data == null) {
      return "UPLOAD_FILE";
    }
    return "REVIEW_CAMPAIGN";
  }

  stepNumber(step: UploadCampaignStep) {
    const stepMap: { readonly [T in UploadCampaignStep]: number } = {
      ENTER_DETAILS: 2,
      UPLOAD_FILE: 3,
      REVIEW_CAMPAIGN: 4,
    };
    return stepMap[step];
  }
}
