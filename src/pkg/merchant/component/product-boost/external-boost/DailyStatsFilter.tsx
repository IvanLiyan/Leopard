/*
 * DailyStatsFilter.tsx
 *
 * Created by Jonah Dlin on Mon May 10 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupField, Info, Layout, Text } from "@ContextLogic/lego";
import { OptionType } from "@ContextLogic/lego/component/form/CheckboxGroupField";

import {
  ChargingMethodDailyStats,
  DailyStatsLineType,
  DailyStatsNames,
  useDailyStatsTooltips,
} from "@toolkit/product-boost/external-boost/external-boost";
import { useTheme } from "@stores/ThemeStore";
import { ExternalBoostChargingMethod } from "@schema/types";
import LinePreview from "./LinePreview";
import { useStringSetQueryParam } from "@toolkit/url";

type Props = BaseProps & {
  readonly chargingMethod: ExternalBoostChargingMethod;
};

const DailyStatsFilter: React.FC<Props> = ({
  className,
  style,
  chargingMethod,
}: Props) => {
  const styles = useStylesheet();

  const [excludedMetrics, setExcludedMetrics] =
    useStringSetQueryParam<DailyStatsLineType>("hidden-metrics");

  const metrics = useMemo(() => {
    const includedMetrics = new Set(ChargingMethodDailyStats[chargingMethod]);
    excludedMetrics.forEach((metric) => includedMetrics.delete(metric));
    return includedMetrics;
  }, [excludedMetrics, chargingMethod]);

  const availableMetrics = ChargingMethodDailyStats[chargingMethod];

  const onToggleMetric = (value: DailyStatsLineType) => {
    const newMetrics = new Set(excludedMetrics);
    if (newMetrics.has(value)) {
      newMetrics.delete(value);
    } else {
      newMetrics.add(value);
    }
    setExcludedMetrics(newMetrics);
  };

  const DailyStatsTooltips = useDailyStatsTooltips(chargingMethod);

  const stateOptions: ReadonlyArray<OptionType<DailyStatsLineType>> =
    useMemo(() => {
      return availableMetrics.map((metric) => ({
        value: metric,
        key: metric,
        title: () => (
          <>
            <LinePreview metric={metric} isDisabled={!metrics.has(metric)} />
            <Text style={{ margin: "0 6px" }}>{DailyStatsNames[metric]}</Text>
            <Info
              sentiment="info"
              text={DailyStatsTooltips[metric]}
              size={12}
            />
          </>
        ),
      }));
    }, [availableMetrics, metrics, DailyStatsTooltips]);

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <section className={css(styles.title)}>
        {ci18n("Button that exposes controls to filter a chart", "Filters")}
      </section>
      <CheckboxGroupField
        className={css(styles.filterGroup)}
        title={i`Metrics`}
        options={stateOptions}
        onChecked={({ value }) => onToggleMetric(value)}
        selected={Array.from(metrics)}
      />
    </Layout.FlexColumn>
  );
};

export default observer(DailyStatsFilter);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 20,
          width: "fit-content",
        },
        title: {
          color: textBlack,
          fontSize: 20,
          lineHeight: 1,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        filterGroup: {
          whiteSpace: "nowrap",
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        legendItem: {
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          ":not(:last-child)": {
            marginRight: 24,
          },
        },
        linePreview: {
          marginRight: 4,
          boxSizing: "border-box",
          height: 4,
          width: 20,
        },
        legendTooltipText: {
          fontSize: 14,
          lineHeight: 1.5,
          color: textBlack,
          padding: 13,
          maxWidth: 250,
          textAlign: "left",
          whiteSpace: "normal",
          opacity: 1,
        },
        legendPopoverTarget: {
          display: "flex",
          alignItems: "center",
        },
      }),
    [textBlack],
  );
};
