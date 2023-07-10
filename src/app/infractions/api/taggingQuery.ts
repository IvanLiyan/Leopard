import { gql } from "@apollo/client";
import { TrueTagSchema } from "@schema";

export const TAGGING_QUERY = gql`
  query Tags {
    platformConstants {
      topLevelTags {
        id
        name
      }
    }
  }
`;

export type TaggingQueryResponse = {
  readonly platformConstants: {
    readonly topLevelTags: ReadonlyArray<Pick<TrueTagSchema, "id" | "name">>;
  };
};
