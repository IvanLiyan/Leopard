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

/* Toolkit */
import { PriceDropTooltip } from "@toolkit/price-drop/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";
import { PriceDropRangeParams } from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";
import { useTheme } from "@merchant/stores/ThemeStore";

type PriceDropPerformanceWishSubsidyFieldsProps = BaseProps & {
  readonly priceDropItem: ImprBoosterItem;
  readonly renderPriceRange: (params: PriceDropRangeParams) => string;
  readonly impressionGainDescription: string;
  readonly gmvGainDescription: string;
  readonly showGMVGain: boolean;
};

const PriceDropPerformanceWishSubsidyFields = (
  props: PriceDropPerformanceWishSubsidyFieldsProps
) => {
  const styles = useStylesheet();
  const {
    priceDropItem,
    renderPriceRange,
    style,
    className,
    impressionGainDescription,
    gmvGainDescription,
    showGMVGain,
  } = props;
  const {
    trial_start_date_str: trialStartDateStr,
    trial_end_date_str: trialEndDateStr,
    original_localized_price_min: minPrice,
    original_localized_price_max: maxPrice,
    impression_gain: impressionGain,
    gmv_gain: gmvGain,
  } = priceDropItem;

  const trialDropPercentage = priceDropItem.trial_drop_percentage
    ? priceDropItem.trial_drop_percentage
    : 0;
  return (
    <div className={css(styles.headerStatsRow, className, style)}>
      <Popover
        popoverContent={PriceDropTooltip.WISH_SUBSIDY}
        position="top left"
        popoverMaxWidth={300}
      >
        <div className={css(styles.headerStatsColumn)}>
          <Text weight="bold" className={css(styles.keyMetricTitle)}>
            Wish Subsidy
          </Text>
          <Text weight="medium" className={css(styles.keyMetricBody)}>
            {ci18n(
              "placeholder is a sale/discount",
              "%1$s OFF",
              numeral(trialDropPercentage / 100.0).format("0%")
            )}
          </Text>
        </div>
      </Popover>

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

      {showGMVGain && (
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

      <div className={css(styles.headerStatsColumn)}>
        <Text weight="bold" className={css(styles.keyMetricTitle)}>
          Subsidy Period
        </Text>
        <Text weight="medium" className={css(styles.keyMetricBody)}>
          {trialStartDateStr + " - " + trialEndDateStr}
        </Text>
      </div>

      <Popover
        popoverContent={PriceDropTooltip.ORIGINAL_PRICE}
        position="top center"
        popoverMaxWidth={300}
      >
        <div className={css(styles.headerStatsColumn)}>
          <Text weight="bold" className={css(styles.keyMetricTitle)}>
            Original Price
          </Text>
          <Text weight="medium" className={css(styles.keyMetricBody)}>
            {renderPriceRange({ minPrice, maxPrice })}
          </Text>
        </div>
      </Popover>
    </div>
  );
};

export default observer(PriceDropPerformanceWishSubsidyFields);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerStatsRow: {
          display: "flex",
          transform: "translateZ(0)",
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
    [textBlack]
  );
};
