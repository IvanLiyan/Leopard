import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";
import { useTheme } from "@stores/ThemeStore";

type PriceDropPerformanceCampaignFieldsProps = BaseProps & {
  readonly priceDropItem: ImprBoosterItem;
  readonly impressionGainDescription: string;
  readonly gmvGainDescription: string;
  readonly hideImpressionAndGMV: boolean;
  readonly showGMVGain: boolean;
};

const PriceDropPerformanceCampaignFields = (
  props: PriceDropPerformanceCampaignFieldsProps,
) => {
  const styles = useStylesheet();
  const {
    priceDropItem,
    style,
    className,
    impressionGainDescription,
    gmvGainDescription,
    hideImpressionAndGMV,
    showGMVGain,
  } = props;
  const {
    start_date_str: campaignStartDateStr,
    end_date_str: campaignEndDateStr,
    drop_percentage: dropPercentage,
    impression_gain: impressionGain,
    gmv_gain: gmvGain,
  } = priceDropItem;

  return (
    <div className={css(styles.headerStatsRow, className, style)}>
      <div className={css(styles.headerStatsColumn)}>
        <Text weight="bold" className={css(styles.keyMetricTitle)}>
          Merchant Dropped Price
        </Text>
        <Text weight="medium" className={css(styles.keyMetricBody)}>
          {ci18n(
            "placeholder is a sale/discount",
            "%1$s OFF",
            numeral(dropPercentage / 100.0).format("0%"),
          )}
        </Text>
      </div>

      <div className={css(styles.headerStatsColumn)}>
        <Text weight="bold" className={css(styles.keyMetricTitle)}>
          Campaign Period
        </Text>
        <Text weight="medium" className={css(styles.keyMetricBody)}>
          {campaignStartDateStr && campaignEndDateStr
            ? campaignStartDateStr + " - " + campaignEndDateStr
            : "N/A"}
        </Text>
      </div>

      {!hideImpressionAndGMV && (
        <Popover
          popoverContent={impressionGainDescription}
          position="top center"
          popoverMaxWidth={300}
        >
          <div className={css(styles.headerStatsColumn)}>
            <Text weight="bold" className={css(styles.keyMetricTitle)}>
              Impression Gain
            </Text>
            <Text weight="medium" className={css(styles.keyMetricBody)}>
              {impressionGain && impressionGain > 0 ? "+" : ""}
              {numeral(impressionGain).format("0.00%")}
            </Text>
          </div>
        </Popover>
      )}

      {!hideImpressionAndGMV && showGMVGain && (
        <Popover
          popoverContent={gmvGainDescription}
          position="top center"
          popoverMaxWidth={300}
        >
          <div className={css(styles.headerStatsColumn)}>
            <Text weight="bold" className={css(styles.keyMetricTitle)}>
              GMV Gain
            </Text>
            <Text weight="medium" className={css(styles.keyMetricBody)}>
              {gmvGain && gmvGain > 0 ? "+" : ""}
              {numeral(gmvGain).format("0.00%")}
            </Text>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default observer(PriceDropPerformanceCampaignFields);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerStatsRow: {
          display: "flex",
          transform: "translateZ(0)",
          marginTop: 16,
        },
        headerStatsColumn: {
          lineHeight: 2,
          marginRight: 50,
        },
        keyMetricTitle: {
          fontSize: 16,
          color: textBlack,
        },
        keyMetricBody: {
          fontSize: 16,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
