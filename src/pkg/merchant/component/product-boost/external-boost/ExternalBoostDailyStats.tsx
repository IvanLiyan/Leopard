/*
 * ExternalBoostDailyStats.tsx
 *
 * Created by Jonah Dlin on Thu Mar 11 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  LoadingIndicator,
  Layout,
  Text,
  FilterButton,
  Popover,
  DayRangePickerInput,
} from "@ContextLogic/lego";

import { useQuery } from "@apollo/client";
import {
  ChargingMethodDailyStats,
  DailyStatsLineType,
  GetExternalBoostStatsInputType,
  GetExternalBoostStatsResponseType,
  GET_EXTERNAL_BOOST_STATS,
} from "@toolkit/product-boost/external-boost/external-boost";
import { DatetimeInput, ExternalBoostChargingMethod } from "@schema/types";
import DailyStatsChart from "./DailyStatsChart";
import { useTheme } from "@stores/ThemeStore";
import DailyStatsFilter from "./DailyStatsFilter";
import { useStringSetQueryParam } from "@toolkit/url";

type DateRange = {
  readonly from: Date;
  readonly to: Date;
};

type Props = BaseProps & {
  readonly chargingMethod: ExternalBoostChargingMethod;
  readonly minDate: Date;
  readonly isCpa: Boolean;
};

const ExternalBoostDailyStats: React.FC<Props> = ({
  className,
  style,
  chargingMethod,
  minDate,
  isCpa,
}: Props) => {
  const styles = useStylesheet();

  const [excludedMetrics] =
    useStringSetQueryParam<DailyStatsLineType>("hidden-metrics");

  const metrics = useMemo(() => {
    const includedMetrics = new Set(ChargingMethodDailyStats[chargingMethod]);
    excludedMetrics.forEach((metric) => includedMetrics.delete(metric));
    return includedMetrics;
  }, [excludedMetrics, chargingMethod]);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // seven days ago
    to: new Date(),
  });

  const { startDate, endDate } = useMemo((): {
    startDate: DatetimeInput;
    endDate: DatetimeInput;
  } => {
    return {
      startDate: {
        // add 1 day of ms for chart date to match filter date
        unix: dateRange.from.getTime() / 1000 + 24 * 60 * 60,
      },
      endDate: {
        // add 1 day of ms for chart date to match filter date
        unix: dateRange.to.getTime() / 1000 + 24 * 60 * 60,
      },
    };
  }, [dateRange]);

  const { data, loading } = useQuery<
    GetExternalBoostStatsResponseType,
    GetExternalBoostStatsInputType
  >(GET_EXTERNAL_BOOST_STATS, {
    variables: {
      startDate,
      endDate,
    },
  });

  const stats =
    data?.currentMerchant.storeStats.marketing.offsiteBoost.daily || [];

  return (
    <Layout.FlexColumn className={css(className, style)} alignItems="stretch">
      <Text className={css(styles.description)}>
        {isCpa
          ? i`Monitor ExternalBoost performance over time.`
          : i`Monitor the performance of your ExternalBoost budget.`}
      </Text>
      <Layout.FlexRow justifyContent="space-between">
        <Layout.FlexRow alignItems="center">
          <Text style={styles.dateRangeTitle}>Select a date range</Text>
          <DayRangePickerInput
            className={css(styles.dateRange)}
            fromDate={dateRange.from}
            toDate={dateRange.to}
            onDayRangeChange={(from, to) => {
              setDateRange({
                from: from || dateRange.from,
                to: to || dateRange.to,
              });
            }}
            disableBeforeStartDays
            cannotSelectFuture
            preventEmptyDate
            dayPickerProps={{
              disabledDays: (date: Date) => date < minDate,
            }}
            noEdit
          />
        </Layout.FlexRow>
        <Popover
          position="bottom right"
          contentWidth={350}
          popoverContent={() => (
            <DailyStatsFilter chargingMethod={chargingMethod} />
          )}
        >
          <FilterButton style={{ padding: "4px 15px" }} />
        </Popover>
      </Layout.FlexRow>
      <div>
        {loading ? (
          <LoadingIndicator className={css(styles.content)} />
        ) : (
          <DailyStatsChart
            className={css(styles.content)}
            stats={stats}
            shownMetrics={metrics}
          />
        )}
      </div>
    </Layout.FlexColumn>
  );
};

export default observer(ExternalBoostDailyStats);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        dateRangeText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          marginRight: 8,
        },
        content: {
          marginTop: 24,
        },
        description: {
          fontSize: 14,
          lineHeight: "20px",
          marginBottom: 16,
        },
        dateRange: {
          maxWidth: 350,
        },
        dateRangeTitle: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          marginRight: 8,
        },
        dateRangeTo: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          margin: "0px 8px",
        },
      }),
    [textDark],
  );
};
