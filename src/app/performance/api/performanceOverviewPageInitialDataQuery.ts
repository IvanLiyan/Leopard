import { gql } from "@apollo/client";
import { PerformanceHealthInitialData } from "@performance/migrated/toolkit/stats";

export const PERFORMANCE_OVERVIEW_PAGE_INITIAL_DATA_QUERY = gql`
  query PerformanceOverviewPageInitialDataQuery {
    policy {
      misleadingProducts: merchantWarningCount(
        reasons: [PRODUCT_IS_INAPPROPRIATE]
        isMisleading: true
        states: AWAITING_MERCHANT
      )
      ipInfringementProducts: merchantWarningCount(
        reasons: [FINE_FOR_COUNTERFEIT_GOODS]
        states: AWAITING_MERCHANT
      )
      prohibitedProducts: merchantWarningCount(
        reasons: [PRODUCT_IS_INAPPROPRIATE, CN_PROHIBITED_PRODUCTS]
        states: AWAITING_MERCHANT
      )
    }
    currentMerchant {
      id
      state
      storeStats {
        updateTime {
          formatted(fmt: "%m/%d/%Y")
          timezone
        }
        tracking {
          validTrackingRate
          lateConfirmedFulfillmentRate
          averageFulfillmentTime {
            hours
          }
          startDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
          endDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
        }
        delivery {
          timeToDoor {
            days
          }
          startDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
          endDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
        }
        refunds {
          refundRate
          startDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
          endDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
        }
        rating {
          averageProductRating
          startDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
          endDate {
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
        }
        cs {
          lateResponseRate30d
          customerSatisfactionScore
          averageTicketResponseTime {
            hours
          }
          startDate {
            iso8061
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
          endDate {
            iso8061
            formatted(fmt: "%m/%d")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
            }
          }
        }
      }
    }
  }
`;

export type PerformanceOverviewPageInitialDataQueryResponse =
  PerformanceHealthInitialData;
