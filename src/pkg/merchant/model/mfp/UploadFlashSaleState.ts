/* External Libraries */
import { observable, computed } from "mobx";

import { CountryCode } from "@schema/types";
import { UploadCampaignStep } from "@merchant/model/mfp/UploadCampaignState";
import { UploadVariationInfo } from "@toolkit/mfp/dashboard";
import {
  campaignNameError,
  FLASH_SALE_WINDOW_LENGTH,
  MfpUploadCampaignInitialData,
} from "@toolkit/mfp/tools";
import moment from "moment/moment";

export default class UploadFlashSaleState {
  @observable
  initialData: MfpUploadCampaignInitialData;

  @observable
  campaignName?: string;

  @observable
  startDate?: Date;

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
  get endDate(): Date | undefined {
    return this.startDate == null
      ? undefined
      : moment(this.startDate).add(FLASH_SALE_WINDOW_LENGTH, "days").toDate();
  }

  @computed
  get campaignNameError(): string | null | undefined {
    const { campaignName } = this;
    return campaignNameError({ name: campaignName });
  }

  @computed
  get step(): UploadCampaignStep {
    const { campaignNameError } = this;
    if (campaignNameError != null) {
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
