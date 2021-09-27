/* External Libraries */
import moment from "moment/moment";

/* Lego Toolkit */
import { Validator } from "@toolkit/validators";
import { ValidationResponse } from "@toolkit/validators";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";
import { VerifyProductBoostProductIdParams } from "@merchant/api/product-boost";

const formatDate = (date: string) => {
  return moment(date).format("YYYY-MM-DD");
};

export default class VerifyProductIdValidator extends Validator {
  campaignId: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;

  constructor({
    customMessage,
    campaignId,
    startDate,
    endDate,
  }: {
    customMessage?: string | null | undefined;
    campaignId: string | null | undefined;
    startDate: string | null | undefined;
    endDate: string | null | undefined;
  }) {
    super({ customMessage });
    this.campaignId = campaignId;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  async validateText(text: string): Promise<ValidationResponse> {
    const { customMessage } = this;

    let params: VerifyProductBoostProductIdParams = {
      product_id: text,
    };

    if (this.campaignId && this.startDate && this.endDate) {
      params = {
        product_id: text,
        campaign_id: this.campaignId,
        start_date: formatDate(this.startDate),
        end_date: formatDate(this.endDate),
      };
    }

    const response = await productBoostApi
      .verifyProductBoostProductId(params)
      .call();
    const isValid = response?.data?.is_valid;
    if (!isValid) {
      const campaignId = response?.data?.campaign_id;
      let msg = response?.data?.msg;
      if (campaignId) msg += ` ${campaignId}`;
      return customMessage ? customMessage : msg;
    }
    return null;
  }
}
