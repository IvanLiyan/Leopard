import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ci18n } from "@legacy/core/i18n";
import moment from "moment/moment";

import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

import CardSection from "@plus/component/marketing/boosted-products/CardSection";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { MarketingServiceSchemaImpressionStatsArgs } from "@schema/types";

import { ImpressionOverviewStatsResponseType } from "@toolkit/marketing/boosted-products";

import ImpressionOverviewContent from "./ImpressionOverviewContent";

type TimePeriod = "ONE_MONTH" | "ONE_WEEK" | "ALL";

const TimePeriodText: { [period in TimePeriod]: string } = {
  ONE_MONTH: ci18n("Short for 1 month", "1M"),
  ONE_WEEK: ci18n("Short for 1 week", "1W"),
  ALL: ci18n("Show data for all-time, instead of a small time range", "ALL"),
};

const GET_IMPRESSION_STATS = gql`
  query Marketing_ImpressionsOverviewCard_GetImpressionStats(
    $startTime: DatetimeInput!
    $endTime: DatetimeInput!
    $dateFormat: String!
  ) {
    marketing {
      impressionStats(startTime: $startTime, endTime: $endTime) {
        totalImpressions
        impressionDailyStats {
          date {
            formatted(fmt: $dateFormat)
          }
          impressions
        }
      }
    }
  }
`;

type ImpressionOverviewStatsRequestType =
  MarketingServiceSchemaImpressionStatsArgs & {
    readonly dateFormat: string;
  };

type Props = BaseProps & {
  readonly merchantSignupTime: number;
};

const ImpressionsOverviewCard: React.FC<Props> = (props: Props) => {
  const { className, style, merchantSignupTime } = props;
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("ONE_WEEK");

  const styles = useStylesheet();

  const periods: ReadonlyArray<TimePeriod> = ["ONE_WEEK", "ONE_MONTH", "ALL"];

  const storeIsMoreThanOneYearOld =
    merchantSignupTime < new Date().getTime() / 1000 - 3.154e7;
  const { nonBatchingClient: client } = useApolloStore();
  const [startTime, endTime] = useTimeRange(selectedPeriod, merchantSignupTime);
  const { data, loading } = useQuery<
    ImpressionOverviewStatsResponseType,
    ImpressionOverviewStatsRequestType
  >(GET_IMPRESSION_STATS, {
    variables: {
      startTime: { unix: startTime },
      endTime: { unix: endTime },
      dateFormat:
        selectedPeriod == "ALL" && storeIsMoreThanOneYearOld
          ? "%m/%d/%Y"
          : "%m/%d",
    },
    client,
  });

  const renderRight = () => (
    <div className={css(styles.periodContainer)}>
      {periods.map((period) => {
        return (
          <Link
            onClick={() => setSelectedPeriod(period)}
            className={css(
              styles.periodButton,
              selectedPeriod == period
                ? styles.periodButtonSelected
                : styles.periodButtonUnselected,
            )}
          >
            {TimePeriodText[period]}
          </Link>
        );
      })}
    </div>
  );

  return (
    <CardSection
      title={i`Impressions`}
      renderRight={renderRight}
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      {data == null ? (
        <LoadingIndicator />
      ) : (
        <ImpressionOverviewContent
          data={data}
          style={{ opacity: loading ? 0.5 : 1 }}
        />
      )}
    </CardSection>
  );
};

const useTimeRange = (
  period: TimePeriod,
  merchantSignupTime: number,
): [number, number] => {
  return useMemo(() => {
    const now = moment();
    const nowTimestamp = now.toDate().getTime() / 1000;
    const DateRanges: { [period in TimePeriod]: [number, number] } = {
      ONE_MONTH: [
        now.clone().subtract(1, "month").toDate().getTime() / 1000,
        nowTimestamp,
      ],
      ONE_WEEK: [
        now.clone().subtract(1, "week").toDate().getTime() / 1000,
        nowTimestamp,
      ],
      ALL: [merchantSignupTime, nowTimestamp],
    };
    return DateRanges[period];
  }, [period, merchantSignupTime]);
};

const useStylesheet = () => {
  const { textUltralight, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
        },
        periodContainer: {
          display: "grid",
          gridGap: 10,
          gridTemplateColumns: "1fr 1fr 1fr",
        },
        periodButton: {
          fontSize: 14,
        },
        periodButtonSelected: {
          color: primary,
        },
        periodButtonUnselected: {
          color: textUltralight,
        },
      }),
    [textUltralight, primary],
  );
};

export default observer(ImpressionsOverviewCard);
