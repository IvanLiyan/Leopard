/* Types Imports */
import { AddressSchema, Country, UserSchema } from "@schema/types";

export type SellerProfileVerificationInitialData = {
  currentUser?:
    | null
    | (Pick<
        UserSchema,
        "firstName" | "lastName" | "phoneNumber" | "entityType"
      > & {
        businessAddress?: null | Pick<
          AddressSchema,
          | "streetAddress1"
          | "streetAddress2"
          | "city"
          | "state"
          | "countryCode"
          | "zipcode"
        >;
      });
  currentMerchant?: null | {
    countryOfDomicile?: null | Pick<Country, "code">;
    signupTime: {
      unix: number;
    };
  };
};
