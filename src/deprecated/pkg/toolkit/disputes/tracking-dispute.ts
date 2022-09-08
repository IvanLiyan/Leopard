import gql from "graphql-tag";
import {
  Datetime,
  TrackingDisputeSchema,
  TrackingDisputeHub,
  TrackingDisputeHubDisputesArgs,
} from "@schema/types";

export const TRACKING_DISPUTES_QUERY = gql`
  query TrackingDispute_TrackingDisputesTable(
    $offset: Int
    $limit: Int
    $states: [TrackingDisputeState!]!
    $sort: DisputeSort
    $searchType: TrackingDisputeSearchType
    $query: String
    $creationDateStart: DatetimeInput
    $creationDateEnd: DatetimeInput
  ) {
    policy {
      dispute {
        trackingDispute {
          disputeCount(
            states: $states
            query: $query
            searchType: $searchType
            creationDateStart: $creationDateStart
            creationDateEnd: $creationDateEnd
          )
          disputes(
            limit: $limit
            offset: $offset
            sort: $sort
            states: $states
            query: $query
            searchType: $searchType
            creationDateStart: $creationDateStart
            creationDateEnd: $creationDateEnd
          ) {
            id
            state
            requestReason
            lastUpdate {
              formatted(fmt: "M/d/YYYY h:mm a z")
            }
            orderId
            productId
            trackingId
            isWishExpressLate
          }
        }
      }
    }
  }
`;

type PickedDisputes = Pick<
  TrackingDisputeSchema,
  | "id"
  | "requestReason"
  | "state"
  | "orderId"
  | "trackingId"
  | "isWishExpressLate"
  | "productId"
> & {
  readonly lastUpdate: Pick<Datetime, "formatted">;
};

type PickedTrackingDispute = Pick<TrackingDisputeHub, "disputeCount"> & {
  readonly disputes?: ReadonlyArray<PickedDisputes> | null;
};

type PickedDispute = {
  readonly trackingDispute?: PickedTrackingDispute | null;
};

export type TrackingDisputesQueryRequestData = TrackingDisputeHubDisputesArgs;

export type TrackingDisputesQueryResponseData = {
  readonly policy: {
    readonly dispute?: PickedDispute | null;
  };
};
