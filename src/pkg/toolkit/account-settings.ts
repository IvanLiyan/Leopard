import {
  Country,
  Datetime,
  UserSchema,
  AddressSchema,
  MerchantSchema,
  MerchantFileSchema,
  SellerVerificationSchema,
  SellerVerificationFeedback,
  KycVerificationSchema,
  CurrencyValue,
} from "@schema/types";

type PickedSellerVerificationFeedback = Pick<
  SellerVerificationFeedback,
  | "lastNameIssue"
  | "firstNameIssue"
  | "businessAddressIssue"
  | "proofOfIdentificationIssue"
  | "middleNameIssue"
  | "dateOfBirthIssue"
>;

export type PickedSellerVerificationSchema = Pick<
  SellerVerificationSchema,
  | "status"
  | "isKycVerification"
  | "gmvCapReached"
  | "paymentsBlocked"
  | "canStart"
  | "numSalesCap"
> & {
  readonly kycVerification?: Pick<
    KycVerificationSchema,
    "status" | "merchantType" | "canStart"
  > | null;
  readonly gmvCapGracePeriodEndDate?: Pick<Datetime, "unix"> | null;
  readonly adminFeedback?: PickedSellerVerificationFeedback | null;
  readonly lastUpdateTime?: Pick<Datetime, "mmddyyyy"> | null;
  readonly gmvCap: Pick<CurrencyValue, "display" | "amount"> | null;
};

type PickedMerchantSchema = Pick<
  MerchantSchema,
  | "id"
  | "displayName"
  | "onVacationMode"
  | "revShare"
  | "canUseVacationMode"
  | "isStoreMerchant"
  | "businessName"
> & {
  readonly proofOfIdentity?: ReadonlyArray<
    Pick<MerchantFileSchema, "fileUrl" | "displayFilename">
  > | null;
  readonly countryOfDomicile?: Pick<Country, "name">;
  readonly businessAddress?: Pick<
    AddressSchema,
    | "streetAddress1"
    | "streetAddress2"
    | "city"
    | "countryCode"
    | "zipcode"
    | "state"
  >;
  readonly sellerVerification: PickedSellerVerificationSchema;
};

export type AccountSettingsInitialData = {
  readonly platformConstants: {
    readonly interselectablePhoneCountries: ReadonlyArray<
      Pick<Country, "code">
    >;
  };
  readonly currentUser: Pick<
    UserSchema,
    | "name"
    | "email"
    | "phoneNumber"
    | "canEditPhoneNumber"
    | "twoFactorEnabled"
    | "numCurrentDevices"
    | "hasTfaBackupCodes"
  > & {
    readonly tfaTokenSentTime?: Pick<Datetime, "iso8061"> | null;
    readonly accountManager?: Pick<UserSchema, "email"> | null;
  };
  readonly currentMerchant: PickedMerchantSchema;
};
