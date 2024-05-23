import { gql } from "@gql";
import ApolloStore from "@core/stores/ApolloStore";
import ToastStore from "@core/stores/ToastStore";
import { ci18n } from "@core/toolkit/i18n";

import { RedirectToQoo10MutationInput, RootMutation } from "@schema";

const GET_QOO10_REDIRECT_URL = gql(`
  mutation GlobalSalesStatusMutation($input: RedirectToQoo10MutationInput!) {
    currentMerchant {
      redirectToQoo10(input: $input) {
        ok
        redirectUrl
      }
    }
  }
`);

type PickedQoo10RedirectMutation = Pick<RootMutation, "currentMerchant">;

type ResponseType = PickedQoo10RedirectMutation;

export const getUrl = async (
  input: RedirectToQoo10MutationInput,
): Promise<Pick<RootMutation, "currentMerchant"> | undefined> => {
  const { client } = ApolloStore.instance();
  const toastStore = ToastStore.instance();
  const { data } = await client.mutate<ResponseType>({
    mutation: GET_QOO10_REDIRECT_URL,
    variables: { input },
  });

  if (data == null) {
    toastStore.negative(ci18n("request error message", "Something went wrong"));
    return;
  }
  const { currentMerchant } = data;

  if (!currentMerchant || currentMerchant == null) {
    toastStore.negative(ci18n("request error message", "Something went wrong"));
    return;
  }

  return data;
};
