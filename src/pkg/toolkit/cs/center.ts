import gql from "graphql-tag";
import {
  TicketSearchType,
  Datetime,
  Timedelta,
  WishUserSchema,
  CustomerSupportTicket,
  CustomerSupportIssueType,
  CustomerSupportTicketState,
  CustomerSupportServiceSchema,
  MerchantSchema,
} from "@schema/types";
import { SimpleSelectOption as Option } from "@ContextLogic/lego";

export type InitialData = {
  readonly platformConstants: {
    readonly cs: {
      readonly issues: ReadonlyArray<
        Pick<CustomerSupportIssueType, "id" | "label">
      >;
    };
  };
  readonly cs: {
    readonly closedTicketCount: CustomerSupportServiceSchema["ticketCount"];
    readonly postCSTicketCount: CustomerSupportServiceSchema["ticketCount"];
    readonly prePurchaseTicketCount: CustomerSupportServiceSchema["ticketCount"];
    readonly awaitingUserTicketCount: CustomerSupportServiceSchema["ticketCount"];
    readonly awaitingMerchantTicketCount: CustomerSupportServiceSchema["ticketCount"];
  };
  readonly currentMerchant: Pick<MerchantSchema, "isWhiteGlove">;
};

export const GET_ORDER_TICKETS = gql`
  query CustomerSupportCenterContainer_GetOrderTickets(
    $offset: Int!
    $limit: Int!
    $sort: CustomerSupportTicketSort
    $query: String
    $searchType: TicketSearchType
    $issueTypes: [Int!]
    $includeMissingTicketType: Boolean
    $states: [CustomerSupportTicketState!]
    $types: [CustomerSupportTicketType!]
  ) {
    cs {
      ticketCount(
        query: $query
        searchType: $searchType
        issueTypes: $issueTypes
        states: $states
        types: $types
        includeMissingTicketType: $includeMissingTicketType
      )
      tickets(
        offset: $offset
        limit: $limit
        sort: $sort
        query: $query
        searchType: $searchType
        issueTypes: $issueTypes
        states: $states
        types: $types
        includeMissingTicketType: $includeMissingTicketType
      ) {
        id
        state
        createdTime {
          mmddyyyy
        }
        timeToRespond {
          days
          hours
          minutes
        }
        lastUpdateTime {
          timezone
          formatted(fmt: "%m/%d/%Y %I:%M %p")
        }
        issueType {
          label
        }
        user {
          name
        }
      }
    }
  }
`;

export const InputHeight = 35;
export const PageLimitOptions = [10, 50, 100];

export const SearchOptions: ReadonlyArray<Option<TicketSearchType>> = [
  {
    value: "SKU",
    text: i`Product SKU`,
  },
  {
    value: "ID",
    text: i`Ticket ID`,
  },
  {
    value: "USER_NAME",
    text: i`User name`,
  },
  {
    value: "ORDER_ID",
    text: i`Order ID`,
  },
  {
    value: "PRODUCT_ID",
    text: i`Product ID`,
  },
];

export const Placeholders: { [searchType in TicketSearchType]: string } = {
  PRODUCT_ID: i`Enter a product id`,
  ID: i`Enter a ticket id`,
  TRANSACTION_ID: i`Enter a transaction id`,
  USER_NAME: i`Enter a user name`,
  ORDER_ID: i`Enter an order id`,
  SKU: i`Enter an product SKU`,
};

export const StateLabels: { [state in CustomerSupportTicketState]: string } = {
  AWAITING_REFUND_CONFIRMATION: i`Pending`,
  ADMIN: i`Pending`,
  MANUAL_REFUND_CONFIRMATION: i`Pending`,
  PERM_CLOSED: i`Pending`,
  DELAYED: i`Pending`,
  ESCALATED_TO_FRAUD_INTERNAL: i`Pending`,
  REVIEW_MERCHANT_REPLY: i`Pending`,
  AWAITING_USER: i`Awaiting buyer response`,
  CLOSED: i`Closed`,
  AWAITING_FRAUD: i`Pending`,
  NEW: i`Pending`,
  SUPER_ADMIN: i`Pending`,
  AWAITING_SHIP_PROVIDER: i`Pending`,
  AWAITING_MERCHANT: i`Awaiting your response`,
  RETURN_AUTO_TICKET: i`Pending`,
  ESCALATED_TO_INTERNAL: i`Pending`,
};

export type PickedCustomerSupportTicket = Pick<
  CustomerSupportTicket,
  "id" | "state"
> & {
  readonly createdTime: Pick<Datetime, "mmddyyyy">;
  readonly timeToRespond?: Pick<Timedelta, "hours" | "days" | "minutes"> | null;
  readonly lastUpdateTime: Pick<Datetime, "timezone" | "formatted">;
  readonly issueType?: Pick<CustomerSupportIssueType, "label"> | null;
  readonly user: Pick<WishUserSchema, "name">;
};

export type GetOrderTicketsResponseType = {
  readonly cs: Pick<CustomerSupportServiceSchema, "ticketCount"> & {
    readonly tickets: ReadonlyArray<PickedCustomerSupportTicket>;
  };
};
