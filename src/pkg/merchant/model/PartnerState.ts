/* External Libraries */
import { observable } from "mobx";

/* Merchant API */
import { MerchantAppListing } from "@merchant/api/merchant-apps";

type TrustedPartnerGlobalStateProps = {};

export class PartnerState {
  @observable
  isLoading: boolean;

  @observable
  merchantApps: Array<MerchantAppListing>;

  @observable
  selectedMerchantApp: MerchantAppListing | null | undefined;

  @observable
  searchFilter: string | null | undefined;

  @observable
  referralAppListing: MerchantAppListing | null | undefined;

  constructor(props?: TrustedPartnerGlobalStateProps) {
    this.isLoading = true;
    this.merchantApps = [];
  }
}
