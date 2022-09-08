import gql from "graphql-tag";
import {
  Datetime,
  MerchantConnectionSchema,
  MerchantEntitySchema,
  MerchantSchemaMerchantEntityArgs,
} from "@schema/types";

export const GET_ENTITY_QUERY = gql`
  query getMerchantEntity($mid: ObjectIdType!) {
    merchants {
      merchant(id: $mid) {
        merchantEntity {
          id
          updatedTime {
            datetime
          }
          merchantConnections {
            id
            merchantIds
            confidence
            reason
            matchedValue
            updatedTime {
              datetime
            }
          }
        }
      }
    }
  }
`;

type UpdatedTimeType = Pick<Datetime, "datetime">;

type MerchantConnectionType = Pick<
  MerchantConnectionSchema,
  | "id"
  | "merchantIds"
  | "confidence"
  | "reason"
  | "matchedValue"
  | "updatedTime"
> &
  UpdatedTimeType;

export type GetMerchantEntityRequestType = MerchantSchemaMerchantEntityArgs;

export type GetMerchantEntityResponseType = {
  readonly merchants: {
    readonly merchant: {
      readonly merchantEntity: Pick<MerchantEntitySchema, "id"> & {
        readonly updatedTime: UpdatedTimeType;
        readonly merchantConnections: ReadonlyArray<MerchantConnectionType>;
      };
    };
  };
};
