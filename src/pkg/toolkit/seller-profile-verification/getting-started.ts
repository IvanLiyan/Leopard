import gql from "graphql-tag";

/* Merchant Stores */
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";

/* Types Imports */
import { SellerIdentityGetStartedMutation } from "@schema/types";

export const SET_GETTING_STARTED_MUTATION = gql`
  mutation SellerIdentity_SetGettingStarted {
    currentMerchant {
      sellerIdentityVerification {
        setGettingStarted {
          ok
          message
        }
      }
    }
  }
`;

export type SetGettingStartedResponseType = {
  readonly currentMerchant?: {
    readonly sellerIdentityVerification: {
      readonly setGettingStarted?: Pick<
        SellerIdentityGetStartedMutation,
        "ok" | "message"
      >;
    };
  };
};

export const setGettingStarted = async () => {
  const { client } = ApolloStore.instance();
  const toastStore = ToastStore.instance();
  const { data } = await client.mutate<SetGettingStartedResponseType, void>({
    mutation: SET_GETTING_STARTED_MUTATION,
  });
  const { ok, message } =
    data?.currentMerchant?.sellerIdentityVerification.setGettingStarted || {};
  if (!ok) {
    toastStore.negative(message || i`Something went wrong`);
  }
  return ok;
};
