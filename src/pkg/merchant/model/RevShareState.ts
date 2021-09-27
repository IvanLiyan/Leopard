/* eslint-disable filenames/match-regex */

/* External Libraries */
import { observable } from "mobx";

/* Lego Toolkit */
import * as illustrations from "@assets/illustrations";

/* Merchant Model */
import ERPPromoProgramV2 from "@merchant/model/external/erp-promo-program/ERPPromoProgramV2";

type RevShareStateProps = {};

export class RevShareState {
  @observable
  revShare: string | null | undefined;

  constructor(props?: RevShareStateProps) {
    this.revShare = undefined;
  }
}

export type ReferralDetails = {
  name: string;
  logoSource: string;
  promoProgram?: ERPPromoProgramV2;
};

export const nonErpReferral: {
  [key: string]: ReferralDetails;
} = {
  paypal: {
    name: "Paypal",
    logoSource: illustrations.paypal,
  },
};
