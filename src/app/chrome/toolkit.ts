import gql from "graphql-tag";
import { useApolloStore } from "../core/stores/ApolloStore";
import { QueryResult, useQuery } from "@apollo/client";
import {
  UserSchema,
  MerchantSchema,
  NotificationsServiceSchema,
  AlertSchema,
  Datetime,
  AlertSentiment,
  PolicySchema,
  TrackingDisputeHub,
  CustomerSupportServiceSchema,
  FulfillmentSchema,
  FulfilledByWishSchema,
  MarketingServiceSchema,
  RefundDisputeHub,
  ChromeBadgeType,
} from "@schema";
import { BannerSentiment } from "@ContextLogic/lego";
import sum from "lodash/sum";
import get from "lodash/get";

export type NavigationBadge = {
  readonly type: ChromeBadgeType;
  readonly expiry_date: number;
};

// TODO [lliepert]: pull this from schema
export type NavigationNode = {
  readonly url: string;
  readonly path: string | null | undefined;
  readonly label: string;
  readonly overviewLabel?: string | null | undefined;
  readonly badge: NavigationBadge | null | undefined;
  readonly children: ReadonlyArray<NavigationNode>;
  readonly nodeid?: string | null | undefined;
  readonly description?: string | null | undefined;
  readonly search_phrase?: string | null | undefined;
  readonly showInSideMenu: boolean;
  readonly open_in_new_tab: boolean;
  readonly keywords: ReadonlyArray<string>;
  readonly total_hits: number | null | undefined;
  readonly most_recent_hit: number | null | undefined;
  readonly count_field?: string | null | undefined;
  readonly count_selectors?: ReadonlyArray<string>;
};

export const SIDE_MENU_COUNTS_QUERY = gql`
  query Chrome_GetSideMenuCounts {
    cs {
      ticketCount(
        states: [AWAITING_MERCHANT]
        types: [ORDER, PRE_PURCHASE, POST_CUSTOMER_SUPPORT]
      )
    }
    fulfillment {
      actionRequiredOrderCount
    }
    logistics {
      fbw {
        lowInventoryCount
        actionRequiredShippingPlans
        totalActionRequired
      }
    }
    marketing {
      pendingCampaignCount
      lowBudgetCampaignCount
      actionRequiredCampaignCount
    }
    policy {
      merchantIpWarningCount: merchantWarningCount(
        states: [AWAITING_MERCHANT, NEW]
        reasons: [COUNTERFEIT_GOODS, FINE_FOR_COUNTERFEIT_GOODS]
      )
      merchantActionRequiredCount: merchantWarningCount(
        states: [AWAITING_MERCHANT, NEW]
      )
      dispute {
        trackingDispute {
          disputeCount(states: [AWAITING_MERCHANT])
        }
        refundDispute {
          returnDisputeCount: disputeCount(
            states: [AWAITING_MERCHANT]
            reasons: [MERCHANT_REPORT_RETURN]
          )
          refundDisputeCount: disputeCount(
            states: [AWAITING_MERCHANT]
            reasons: [
              MISLEADING_PRODUCT_TAG
              PRODUCT_HIGH_REFUND_RATIO
              DELIVERED_TO_WRONG_ADDRESS
              EPC_OVERWEIGHT
              FRAUDULENT_BEHAVIOR
              VALID_TRACKING
              INCOMPLETE_ORDER
              NOT_DELIVERED_ON_TIME
              STORE_UPLOADED_INVENTORY_RETURN
              PRODUCT_LOW_RATING
              RIGHT_OF_WITHDRAWAL
              FBS_ITEM_NOT_PICKUP
              CORRECT_SIZE
              ITEM_IS_DAMAGED
              EPC_OVERVALUE
              RETURNED_TO_SENDER
              ITEM_NOT_MATCH_LISTING
              WISHBLUE_EPC_LATE_FULFULLMENT
              OUT_OF_STOCK
              ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE
              FAKE_TRACKING
              MERCHANT_HIGH_REFUND_EAT_COST
              ITEM_IS_DANGEROUS
              BANNED_MERCHANT
              NOT_QUALIFIED_SHIPPING_PROVIDER
              AUTHORIZED_TO_SELL
              EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP
              EPC_OVERSIZE
              COUNTERFEIT_ITEM
              DID_NOT_ACCEPT_TOS_ON_TIME
              LATE_CONFIRMED_FULFILLMENT
              MERCHANT_REPORT_FRAUD
            ]
          )
        }
      }
    }
  }
`;

export type SideMenuCounts = {
  readonly cs?: Pick<CustomerSupportServiceSchema, "ticketCount">;
  readonly fulfillment?: Pick<FulfillmentSchema, "actionRequiredOrderCount">;
  readonly logistics?: {
    readonly fbw: Pick<
      FulfilledByWishSchema,
      | "lowInventoryCount"
      | "actionRequiredShippingPlans"
      | "totalActionRequired"
    >;
  };
  readonly marketing?: Pick<
    MarketingServiceSchema,
    | "pendingCampaignCount"
    | "lowBudgetCampaignCount"
    | "actionRequiredCampaignCount"
  >;
  readonly policy?: {
    readonly merchantIpWarningCount?: PolicySchema["merchantWarningCount"];
    readonly merchantActionRequiredCount?: PolicySchema["merchantWarningCount"];
    readonly dispute?: {
      readonly trackingDispute?: Pick<TrackingDisputeHub, "disputeCount">;
      readonly refundDispute?: {
        readonly returnDisputeCount?: RefundDisputeHub["disputeCount"];
        readonly refundDisputeCount?: RefundDisputeHub["disputeCount"];
      };
    };
  };
};

export const getNodeCount = (
  node: NavigationNode,
  counts: SideMenuCounts,
): number => {
  const currentNodeCount = node.count_selectors
    ? sum(
        node.count_selectors.map(
          // Reason: Need string based lookup from server.
          // eslint-disable-next-line local-rules/no-unnecessary-use-of-lodash
          (selector: string) => get(counts, selector) || 0,
        ),
      )
    : 0;
  const childrenNodeCount = node.children
    ? sum(
        node.children.map((child: NavigationNode) =>
          getNodeCount(child, counts),
        ),
      )
    : 0;
  return currentNodeCount + childrenNodeCount;
};

export type GetAppTopbarDataResponse = {
  readonly su?: Pick<UserSchema, "hasPermission">;
  readonly currentUser: Pick<UserSchema, "firstName">;
  readonly currentMerchant: Pick<
    MerchantSchema,
    "id" | "isStoreMerchant" | "canAccessHome"
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
      canAccessHome
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

export const useAppTopBarData = (): QueryResult<
  GetAppTopbarDataResponse,
  void
> => {
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
