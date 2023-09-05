import { gql } from "@gql";
import {
  CreateNotice,
  DsaMutations,
  PublicDsaMutations,
  CreateNoticeInput,
} from "@schema";

export type CreateNoticeMutationVariables = {
  readonly input: CreateNoticeInput;
};

export type CreateNoticeMutationResponse = {
  readonly dsa: Pick<DsaMutations, "public"> & {
    readonly public: Pick<PublicDsaMutations, "createNotice"> & {
      readonly createNotice: CreateNotice;
    };
  };
};

export const CREATE_NOTICE_MUTATION = gql(`
  mutation NoticePortal_CreateNotice($input: CreateNoticeInput!) {
    dsa {
      public {
        createNotice(input: $input) {
          ok
          message
        }
      }
    }
  }
`);
