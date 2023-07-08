import { ChangeLocale, LocaleMutationsChangeLocaleArgs } from "@schema";
import { gql } from "@gql";

export const CHANGE_LOCALE_MUTATION = gql(`
  mutation AppLocalSelector_ChangeLocaleMutation($input: ChangeLocaleInput!) {
    locale {
      changeLocale(input: $input) {
        ok
        message
      }
    }
  }
`);

export type ChangeLocalRequestType = LocaleMutationsChangeLocaleArgs;
export type ChangeLocalResponseType = {
  readonly locale: {
    readonly changeLocale: Pick<ChangeLocale, "ok" | "message">;
  };
};
