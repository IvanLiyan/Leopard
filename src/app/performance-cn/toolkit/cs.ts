import { gql } from "@gql";
import {
  CurrencyValue,
  Datetime,
  CsPerformanceStats,
  Timedelta,
  MerchantStatsWeeklyArgs,
  MerchantSchema,
} from "@schema";

export type CustomerServiceAggregateBenchMark = {
  readonly benchmark: string;
  readonly refundRatio30d: string;
  readonly refundRatio93d: string;
  readonly chargebackRatio: string;
  readonly chargebackAmountRatio: string;
  readonly ticketRatio: string;
  readonly lateResponseRate30d: string;
  readonly customerSatisfaction: string;
};

export const CS_PERFORMANCE_AGGREGATE_DATA_QUERY = gql(`
  query CustomerService_PerformanceAggregateDataQuery($weeks: Int!) {
    currentMerchant {
      primaryCurrency
      storeStats {
        weekly(weeks: $weeks) {
          cs {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            gmv {
              amount
              currencyCode
            }
            orders
            orders30d
            refund30d
            refundRatio30d
            orders93d
            refund93d
            refundRatio93d
            chargeback
            chargebackRatio
            chargebackAmount {
              amount
              currencyCode
            }
            chargebackAmountRatio
            tickets
            ticketRatio
            lateResponseRate30d
            averageTicketResponseTime {
              hours
            }
            customerSatisfaction
          }
        }
      }
    }
  }
`);

export type PickedCustomerServiceAggregate = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly chargebackAmount?: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly averageTicketResponseTime: Pick<Timedelta, "hours">;
} & Pick<
  CsPerformanceStats,
  | "orders"
  | "orders30d"
  | "refund30d"
  | "refundRatio30d"
  | "orders93d"
  | "refund93d"
  | "refundRatio93d"
  | "chargeback"
  | "chargebackRatio"
  | "chargebackAmountRatio"
  | "tickets"
  | "ticketRatio"
  | "lateResponseRate30d"
  | "customerSatisfaction"
  | "ticketRatio"
>;

export type CustomerServiceAggregateResponseData = {
  readonly currentMerchant?: Pick<MerchantSchema, "primaryCurrency"> & {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly cs: PickedCustomerServiceAggregate;
      }>;
    };
  };
};

export type CustomerServiceAggregateArgs = MerchantStatsWeeklyArgs;
