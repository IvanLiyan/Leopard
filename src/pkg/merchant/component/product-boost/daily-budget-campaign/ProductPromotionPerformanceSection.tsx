import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CurrencyCode } from "@toolkit/currency";

/* Merchant Components */
import ProductPerformanceLifetimeGraph from "@merchant/component/product-boost/daily-budget-campaign/ProductPerformanceLifetimeGraph";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ProductPromotionPerformanceType } from "@merchant/api/product-promotion";
import {
  ProductPromotionStatus,
  MarketingServiceSchemaProductPromotionArgs,
  Maybe,
} from "@schema/types";

const GET_PRODUCT_PROMOTION_PERFORMANCE = gql`
  query ProductPromotionPerformanceSection_GetProductPromotionPerformance(
    $productId: ObjectIdType!
    $startTime: Int!
    $endTime: Int!
  ) {
    marketing {
      productPromotion(productId: $productId) {
        periodStats(
          startTime: { unix: $startTime }
          endTime: { unix: $endTime }
        ) {
          startDate {
            unix
          }
          endDate {
            unix
          }
          dailyStats {
            date {
              formatted(fmt: "%Y-%m-%d")
            }
            impressions
            sales
            promotionSpending {
              amount
              currencyCode
            }
            promotionStatus
          }
          totalImpressions
          totalSales
          totalPromotionSpending {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type GetProductPromotionPerformanceResponseType = {
  readonly marketing: Maybe<{
    readonly productPromotion: Maybe<{
      readonly periodStats: ProductPromotionPerformanceType;
    }>;
  }>;
};
type GetProductPromotionPerformanceRequestType = Pick<
  MarketingServiceSchemaProductPromotionArgs,
  "productId"
> & {
  startTime: number;
  endTime: number;
};

type TimeRange = "7d" | "30d" | "3mo" | "6mo" | "1y";
const timeOffsetDict: {
  [timeRange in TimeRange]: {
    amount: moment.DurationInputArg1;
    units: moment.DurationInputArg2;
  };
} = {
  "7d": { amount: 7, units: "days" },
  "30d": { amount: 30, units: "days" },
  "3mo": { amount: 3, units: "months" },
  "6mo": { amount: 6, units: "months" },
  "1y": { amount: 1, units: "years" },
};

const statusNameDict: {
  [state in ProductPromotionStatus]: string;
} = {
  ACTIVE: i`Active`,
  INACTIVE: i`Inactive`,
  OUT_OF_BALANCE: i`Pending`,
};

type ProductPromotionPerformanceSectionProps = BaseProps & {
  readonly productId: string;
  readonly currencyCode: CurrencyCode;
};

const ProductPromotionPerformanceSection = (
  props: ProductPromotionPerformanceSectionProps
) => {
  const styles = useStylesheet();
  const { productId, currencyCode, className, style } = props;
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const endTime = useMemo(() => moment().unix(), []);
  const startTime = useMemo(() => {
    const { amount, units } = timeOffsetDict[timeRange];
    return moment().subtract(amount, units).unix();
  }, [timeRange]);

  const dateSelectProps = useMemo(() => {
    return {
      options: [
        {
          value: "7d",
          text: i`Last 7 Days`,
        },
        {
          value: "30d",
          text: i`Last 30 Days`,
        },
        {
          value: "3mo",
          text: i`Last 3 Months`,
        },
        {
          value: "6mo",
          text: i`Last 6 Months`,
        },
        {
          value: "1y",
          text: i`Last 1 Year`,
        },
      ],
      onSelected: (value: TimeRange) => {
        setTimeRange(value);
      },
      selectedValue: timeRange,
      minWidth: 120,
      hideBorder: false,
      filterName: i`Period`,
    };
  }, [timeRange]);

  const { data, loading: loadingProductPromotionPerformance } = useQuery<
    GetProductPromotionPerformanceResponseType,
    GetProductPromotionPerformanceRequestType
  >(GET_PRODUCT_PROMOTION_PERFORMANCE, {
    variables: {
      productId,
      startTime,
      endTime,
    },
  });
  const stats = data?.marketing?.productPromotion?.periodStats;

  const renderProductPerformanceLifetimeGraph = () => {
    if (
      stats === undefined ||
      stats.totalPromotionSpending.currencyCode !== currencyCode
    ) {
      return null;
    }
    const dailyStats = stats.dailyStats.map((stats) => {
      const {
        date: { formatted: dateStr },
        impressions,
        sales,
        promotionSpending,
        promotionStatus,
      } = stats;
      // TODO(juxu) come up with appropriate placeholder data in the extremely
      // rare event that the currency codes disagree
      return {
        date: dateStr,
        impressions,
        sales,
        promotionSpending: promotionSpending?.amount,
        promotionStatus: statusNameDict[promotionStatus],
      };
    });
    return (
      <ProductPerformanceLifetimeGraph
        className={css(className, style)}
        startTime={new Date(stats.startDate.unix)}
        endTime={new Date(stats.endDate.unix)}
        dailyStats={dailyStats}
        totalImpressions={stats.totalImpressions}
        totalSales={stats.totalSales}
        totalPromotionSpending={stats.totalPromotionSpending.amount}
        currencyCode={currencyCode}
      />
    );
  };

  return (
    <div>
      <div className={css(styles.selectContainer)}>
        <Select {...dateSelectProps} />
      </div>
      {loadingProductPromotionPerformance ? (
        <LoadingIndicator />
      ) : (
        renderProductPerformanceLifetimeGraph()
      )}
    </div>
  );
};

export default observer(ProductPromotionPerformanceSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        selectContainer: {
          display: "flex",
          flexDirection: "row",
          margin: "25px 25px 0px 25px",
          alignItems: "center",
        },
      }),
    []
  );
};
