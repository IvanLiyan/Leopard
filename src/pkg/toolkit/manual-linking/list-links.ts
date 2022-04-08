import gql from "graphql-tag";

/* Types */
import { MerchantSchema, UserSchema } from "@schema/types";

export type LinkedStoreListData = {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly displayPictureUrl: string;
};

export type ManualMerchantConnectionsQueryResponseType = {
  readonly currentUser?:
    | (Pick<UserSchema, "merchantId"> & {
        readonly manualMerchantConnections?: ReadonlyArray<MerchantConnectionResponseType> | null;
      })
    | null;
};

export type MerchantConnectionResponseType = {
  readonly merchants: ReadonlyArray<PickedMerchantData>;
};

export type PickedMerchantData = Pick<
  MerchantSchema,
  "id" | "displayName" | "email" | "displayPictureUrl"
>;

export const MANUAL_MERCHANT_CONNECTIONS_QUERY = gql`
  query ManualLink_ManualMerchantConnectionsQuery {
    currentUser {
      merchantId
      manualMerchantConnections {
        merchants {
          id
          displayName
          email
          displayPictureUrl
        }
      }
    }
  }
`;
