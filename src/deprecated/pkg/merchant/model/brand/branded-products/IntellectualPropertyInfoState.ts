/* External Libraries */
import { observable, computed } from "mobx";

/* Merchant API */
import { submitIntellectualPropertyInfo } from "@merchant/api/brand/true-brands";

/* Lego Toolkit */
import { TrademarkCountryCode } from "@schema/types";

export type TrademarkType = "DESIGN_MARK" | "WORD_MARK";

export default class IntellectualPropertyInfoState {
  @observable requestId: string;
  @observable trademarkType: TrademarkType | null = null;
  @observable trademarkNumber: string | null = null;
  @observable trademarkOffice: TrademarkCountryCode | null = null;
  @observable trademarkDocUrl: string | null = null;
  @observable trademarkUrl: string | null = null;

  @observable trademarkNumberValid: boolean = false;
  @observable trademarkUrlValid: boolean = false;

  @observable isSubmitting: boolean = false;
  @observable submitted: boolean = false;
  @observable submitSucceeded: boolean = false;

  constructor(requestId: string) {
    this.requestId = requestId;
  }

  @computed
  get trademarkTypeValid(): boolean {
    return this.trademarkType != null;
  }

  @computed
  get trademarkOfficeValid(): boolean {
    return this.trademarkOffice != null;
  }

  @computed
  get trademarkDocUrlValid(): boolean {
    return this.trademarkDocUrl != null;
  }

  @computed
  get trademarkUrlEmptyOrValid(): boolean {
    return this.trademarkUrlValid || !this.trademarkUrl;
  }

  @computed
  get formComplete(): boolean {
    return (
      this.trademarkTypeValid &&
      this.trademarkNumberValid &&
      this.trademarkOfficeValid &&
      this.trademarkDocUrlValid &&
      this.trademarkUrlEmptyOrValid
    );
  }

  async submit() {
    if (!this.formComplete) {
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await submitIntellectualPropertyInfo({
        request_id: this.requestId,
        trademark_type: this.trademarkType,
        trademark_number: this.trademarkNumber,
        trademark_office: this.trademarkOffice,
        trademark_doc_url: this.trademarkDocUrl,
        trademark_url: this.trademarkUrl,
      }).call();

      this.submitSucceeded = response.code === 0;
    } finally {
      this.isSubmitting = false;
      this.submitted = true;
    }
  }
}
