import {
  Country,
  MerchantInviteInfo,
  SalesforceLeadInfo,
  BdSignupCodeInfo,
} from "@schema/types";

export type MerchantInviteInfoPick = Pick<
  MerchantInviteInfo,
  | "valid"
  | "email"
  | "promotionRevShare"
  | "promotionPeriodInDays"
  | "useMarketingTransactionBonus"
>;

export type SalesforceLeadInfoPick = Pick<
  SalesforceLeadInfo,
  "valid" | "email" | "firstName" | "lastName" | "company"
>;

export type BdSignupCodeInfoPick = Pick<
  BdSignupCodeInfo,
  "valid" | "bdName" | "useMarketingTransactionBonus"
>;

export type OnboardingV4ContactInfoInitialData = {
  readonly platformConstants: {
    readonly interselectablePhoneCountries: ReadonlyArray<
      Pick<Country, "code">
    >;
  };
};
