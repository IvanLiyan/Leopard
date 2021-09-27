/* External Libraries */
import { observable } from "mobx";

/* Merchant API */
import { SignUpPSPListing } from "@merchant/api/signup-psps";

type PSPDetailsProps = {};

export class PspDetails {
  @observable
  isLoading: boolean;

  @observable
  signUpPSPs: Array<SignUpPSPListing>;

  @observable
  selectedsignUpPSP: SignUpPSPListing | null | undefined;

  @observable
  searchFilter: string | null | undefined;

  @observable
  isMerchantAllowedPspSignUp: boolean | undefined;

  constructor(props?: PSPDetailsProps) {
    this.isLoading = true;
    this.signUpPSPs = [];
  }
}
