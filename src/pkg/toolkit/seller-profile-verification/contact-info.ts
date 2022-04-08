import { useMemo } from "react";
import gql from "graphql-tag";

/* Toolkit */
import {
  CNZipcodeOnlyValidator,
  RequiredValidator,
  USZipcodeOnlyValidator,
  Validator,
} from "@toolkit/validators";

/* Merchant Stores */
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";

/* Types Imports */
import { SellerProfileVerificationInitialData } from "./initial-data";
import {
  SellerIdentitySetContactInfoMutation,
  SellerIdentitySetContactInfoInput,
  CountryCode,
  SellerIdentityBusinessLocation,
} from "@schema/types";

export const SET_CONTACT_INFO_MUTATION = gql`
  mutation SellerIdentity_SetContactInfo(
    $input: SellerIdentitySetContactInfoInput!
  ) {
    currentMerchant {
      sellerIdentityVerification {
        setContactInfo(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

export type SetContactInfoResponseType = {
  readonly currentMerchant?: {
    readonly sellerIdentityVerification: {
      readonly setContactInfo?: Pick<
        SellerIdentitySetContactInfoMutation,
        "ok" | "message"
      >;
    };
  };
};

export const setContactInfo = async (
  input: SellerIdentitySetContactInfoInput
) => {
  const { client } = ApolloStore.instance();
  const toastStore = ToastStore.instance();
  const { data } = await client.mutate<
    SetContactInfoResponseType,
    { input: SellerIdentitySetContactInfoInput }
  >({
    mutation: SET_CONTACT_INFO_MUTATION,
    variables: { input },
  });
  const { ok, message } =
    data?.currentMerchant?.sellerIdentityVerification.setContactInfo || {};
  if (!ok) {
    toastStore.negative(message || i`Something went wrong`);
  }
  return ok;
};

export const defaultBusinessLocation = (
  initialData: SellerProfileVerificationInitialData
) => {
  const { currentMerchant, currentUser } = initialData;
  const countryCodeOfDomicile = currentMerchant?.countryOfDomicile?.code;
  const { streetAddress1, streetAddress2, city, state, countryCode, zipcode } =
    currentUser?.businessAddress || {};

  return {
    countryCodeDomicile: countryCodeOfDomicile,
    baStreetAddress1: streetAddress1,
    baStreetAddress2: streetAddress2,
    baCity: city,
    baState: state || undefined,
    baCountry: countryCode || countryCodeOfDomicile,
    baZipcode: zipcode || undefined,
  };
};

const getZipcodeValidators = (country: CountryCode | undefined) => {
  const validators = [new RequiredValidator()];
  if (country === "US") {
    validators.push(new USZipcodeOnlyValidator());
  } else if (country === "CN") {
    validators.push(new CNZipcodeOnlyValidator());
  }
  return validators;
};

export type Form = Partial<SellerIdentityBusinessLocation>;

export type Fields = keyof Form;

export const useValidators = (
  country: CountryCode | undefined
): Record<Fields, Array<Validator>> => {
  return useMemo(
    () => ({
      countryCodeDomicile: [new RequiredValidator()],
      baStreetAddress1: [new RequiredValidator()],
      baStreetAddress2: [],
      baCity: [new RequiredValidator()],
      baState: [new RequiredValidator()],
      baCountry: [new RequiredValidator()],
      baZipcode: getZipcodeValidators(country),
    }),
    [country]
  );
};
