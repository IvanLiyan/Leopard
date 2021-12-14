import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import _ from "lodash";
import { useApolloStore } from "@stores/ApolloStore";
import {
  UserSchema,
  MerchantSchema,
  NotificationsServiceSchema,
  AlertSchema,
  Datetime,
  AlertSentiment,
} from "@schema/types";
import { BannerSentiment } from "@ContextLogic/lego";

export type NavigationBadgeType = "NEW" | "BETA";

export type NavigationBadge = {
  readonly type: NavigationBadgeType;
  readonly expiry_date: number;
};

export type CountQuery = {
  readonly query: string;
  readonly selectors: ReadonlyArray<string>;
};

export type NavigationNode = {
  readonly url: string;
  readonly path: string | null | undefined;
  readonly label: string;
  readonly overview_label?: string | null | undefined;
  readonly badge: NavigationBadge | null | undefined;
  readonly children: ReadonlyArray<NavigationNode>;
  readonly nodeid?: string | null | undefined;
  readonly description?: string | null | undefined;
  readonly search_phrase?: string | null | undefined;
  readonly show_in_side_menu: boolean;
  readonly keywords: ReadonlyArray<string>;
  readonly total_hits: number | null | undefined;
  readonly most_recent_hit: number | null | undefined;
  readonly count_field?: string | null | undefined;
  readonly count_query?: CountQuery;
};

const EMPTY_QUERY = `
query emptyQuery {
  currentUser {
    id
  }
}
`;

export const useNodeCount = (
  node: NavigationNode | null | undefined,
): number | null => {
  const countQuery = node?.count_query;
  const queryString = countQuery?.query;
  const querySelectors = countQuery?.selectors;
  const { nonBatchingClient: client } = useApolloStore();

  // skip and empty query logic required since the hooks cannot be called conditionally
  const { data: countData } = useQuery<any, void>(
    gql(queryString || EMPTY_QUERY),
    {
      skip: countQuery == null,
      client,
    },
  );

  const count =
    querySelectors == null
      ? null
      : querySelectors.reduce((acc: number | null, querySelector) => {
          const selectorCount: unknown = querySelector // Need string based lookup from server.
            ? // eslint-disable-next-line local-rules/no-unnecessary-use-of-lodash
              _.get(countData, querySelector)
            : null;

          if (selectorCount == null || typeof selectorCount != "number") {
            return acc;
          }

          if (acc == null) {
            return selectorCount;
          }

          return acc + selectorCount;
        }, null);

  return count;
};

export type GetAppTopbarDataResponse = {
  readonly su?: Pick<UserSchema, "hasPermission">;
  readonly currentUser: Pick<UserSchema, "firstName">;
  readonly currentMerchant: Pick<
    MerchantSchema,
    "id" | "isStoreMerchant" | "isMerchantPlus"
  >;
};

export const GET_APP_TOPBAR_DATA_QUERY = gql`
  query Chrome_GetAppTopbarData {
    su {
      hasPermission(
        permissions: [
          CAN_TOGGLE_ADMIN_EDIT_ON_STORE_USERS
          CAN_TOGGLE_ADMIN_EDIT_ON_ALL_USERS
        ]
      )
    }
    currentMerchant {
      id
      isStoreMerchant
      isMerchantPlus
    }
    currentUser {
      firstName
    }
  }
`;

export type GetNotificationButtonResponse = {
  readonly notifications: Pick<NotificationsServiceSchema, "notificationCount">;
};

export const GET_NOTIFICATION_BUTTON_QUERY = gql`
  query Chrome_NotificationButtonData {
    notifications {
      notificationCount(viewed: false)
    }
  }
`;

export const useAppTopBarData = () => {
  const { nonBatchingClient: client } = useApolloStore();
  return useQuery<GetAppTopbarDataResponse, void>(GET_APP_TOPBAR_DATA_QUERY, {
    client,
  });
};

export const AlertSentimentMap: {
  readonly [T in AlertSentiment]: BannerSentiment;
} = {
  INFO: "info",
  WARNING: "warning",
  NEGATIVE: "error",
};

export const GET_ALERTS_QUERY = gql`
  query Chrome_GetAlerts {
    currentUser {
      alerts {
        link
        description
        date {
          formatted(fmt: "YYYY/MM/dd")
        }
        sentiment
      }
    }
  }
`;

export type PickedUserAlert = Pick<
  AlertSchema,
  "description" | "link" | "sentiment"
> & {
  readonly date?: Pick<Datetime, "formatted"> | undefined;
};

export type GetAlertsRequestType = {
  readonly currentUser: {
    readonly alerts?: ReadonlyArray<PickedUserAlert> | null;
  };
};
