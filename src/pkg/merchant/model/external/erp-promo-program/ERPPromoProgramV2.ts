/* External Libraries */
import { observable, computed } from "mobx";

/* Merchant API */
import { GetReferralAppResponse } from "@merchant/api/merchant-apps";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import PromotionStore from "@merchant/stores/PromotionStore";

export type PromoEndType = "FIXED_DURATION" | "FIXED_END_TIME";

export default class ERPPromoProgramV2 {
  @observable
  promoEndType: PromoEndType;

  @observable
  promoFixedDurationDays: number;

  @observable
  promoFixedEndTime: string;

  constructor(resp: GetReferralAppResponse) {
    this.promoEndType = resp.promo_end_type;
    this.promoFixedDurationDays = resp.promo_fixed_duration_days;
    this.promoFixedEndTime = resp.promo_fixed_end_time;
  }

  @computed
  get i18nDateString() {
    const { locale } = LocalizationStore.instance();
    return new Date(this.promoFixedEndTime).toLocaleString(locale);
  }

  @computed
  get bannerText() {
    const { discountedRevShare, defaultRevShare } = PromotionStore.instance();

    switch (this.promoEndType) {
      case "FIXED_DURATION":
        return (
          i`Your revenue share will only be ${discountedRevShare}% ` +
          i`for the first ${this.promoFixedDurationDays} days ` +
          i`if you verify your identity with this partner after sign up. Normally it's ${defaultRevShare}%.`
        );
      case "FIXED_END_TIME":
        return (
          i`Your revenue share will only be ${discountedRevShare}% ` +
          i`until ${this.i18nDateString} ` +
          i`if you verify your identity with this partner after sign up. Normally it's ${defaultRevShare}%.`
        );
      default:
        return "";
    }
  }

  @computed
  get reminderText() {
    const {
      promotionStore: { discountedRevShare, defaultRevShare },
    } = AppStore.instance();

    switch (this.promoEndType) {
      case "FIXED_DURATION":
        return (
          i`Hooray! For the **first ${this.promoFixedDurationDays} days** after you open your store, ` +
          i`the revenue share on your sales will be only **${discountedRevShare}%**. Normally, it is ${defaultRevShare}%.`
        );
      case "FIXED_END_TIME":
        return (
          i`Hooray! The revenue share on your sales will be only **${discountedRevShare}%** until ${this.i18nDateString}. ` +
          i`Normally, it is ${defaultRevShare}%.`
        );
      default:
        return "";
    }
  }
}
