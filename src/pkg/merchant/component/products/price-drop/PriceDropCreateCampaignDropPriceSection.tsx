import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { RangeSlider } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { MinMaxValueValidator } from "@toolkit/validators";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import { PriceDropConstants } from "@toolkit/price-drop/constants";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { EligibleProduct } from "@merchant/api/price-drop";

type PriceDropCreateCampaignDropPriceSectionProps = BaseProps & {
  readonly selectedProduct: EligibleProduct | null | undefined;
  readonly onDropPrice: (dropPercentage: number) => void;
  readonly dropPercentage: number;
};

const PriceDropCreateCampaignDropPriceSection = (
  props: PriceDropCreateCampaignDropPriceSectionProps
) => {
  const styles = useStylesheet();
  const {
    className,
    style,
    onDropPrice,
    dropPercentage,
    selectedProduct,
  } = props;

  const renderPriceRange = (
    product: EligibleProduct,
    includeDropPercentage: boolean | null | undefined
  ) => {
    const minPrice = includeDropPercentage
      ? (product.min_price * (100 - dropPercentage)) / 100.0
      : product.min_price;
    const maxPrice = includeDropPercentage
      ? (product.max_price * (100 - dropPercentage)) / 100.0
      : product.max_price;
    const currencyCode = product.currency_code;

    if (minPrice === maxPrice) {
      return formatCurrency(minPrice, currencyCode);
    }
    return `${formatCurrency(minPrice, currencyCode)}-${formatCurrency(
      maxPrice,
      currencyCode
    )}`;
  };

  if (selectedProduct == null) {
    return (
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.semiboldText, styles.topMargin)}>
          Add a product to this campaign to set a Price Drop percentage.
        </div>
      </div>
    );
  }

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.semiboldText, styles.topMargin)}>
        Set a Price Drop percentage for your selected product.
      </div>
      <HorizontalField
        title={i`Drop by Percentage`}
        centerTitleVertically
        className={css(styles.topMargin)}
      >
        <div className={css(styles.rowFlex)}>
          <NumericInput
            className={css(styles.dropPercentageInput)}
            value={dropPercentage}
            numberFormat={"0,0"}
            validators={[
              new MinMaxValueValidator({
                minAllowedValue: PriceDropConstants.DEFAULT_MIN_DROP_PERCENTAGE,
                maxAllowedValue: PriceDropConstants.DEFAULT_MAX_DROP_PERCENTAGE,
                customMessage: i`Must be between ${PriceDropConstants.DEFAULT_MIN_DROP_PERCENTAGE}% and ${PriceDropConstants.DEFAULT_MAX_DROP_PERCENTAGE}%.`,
              }),
            ]}
            onChange={({ valueAsNumber }) => {
              const newValue = Math.min(Math.max(valueAsNumber || 0, 0), 100);
              onDropPrice(newValue);
            }}
          />
          <div className={css(styles.dropPercentage)}>% </div>
          <div className={css(styles.rangeSliderContainer)}>
            <RangeSlider
              value={dropPercentage} // TODO: need to get the min/max drop percentage from price drop store.
              range={[
                PriceDropConstants.DEFAULT_MIN_DROP_PERCENTAGE,
                PriceDropConstants.DEFAULT_MAX_DROP_PERCENTAGE,
              ]}
              stepSize={1}
              onChange={({ value }) => {
                onDropPrice(value);
              }}
            />
            <div className={css(styles.minMaxRangeContainer)}>
              <div>Min: {PriceDropConstants.DEFAULT_MIN_DROP_PERCENTAGE}%</div>
              <div>Max: {PriceDropConstants.DEFAULT_MAX_DROP_PERCENTAGE}%</div>
            </div>
          </div>
        </div>
      </HorizontalField>
      <HorizontalField
        title={i`Price dropped to`}
        centerTitleVertically
        className={css(styles.topMargin)}
      >
        <div className={css(styles.leftMargin)}>
          {renderPriceRange(selectedProduct, true)}
        </div>
      </HorizontalField>
    </div>
  );
};

export default observer(PriceDropCreateCampaignDropPriceSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        semiboldText: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
        },
        topMargin: {
          marginTop: 20,
        },
        leftMargin: {
          color: palettes.textColors.Ink,
          marginLeft: 30,
        },
        dropPercentage: {
          fontWeight: fonts.weightBold,
          lineHeight: 1,
          marginLeft: 8,
          marginTop: 14,
        },
        rowFlex: {
          display: "flex",
          flexDirection: "row",
        },
        minMaxRangeContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        rangeSliderContainer: {
          display: "flex",
          flexDirection: "column",
          marginLeft: 30,
          flexGrow: 1,
        },
        dropPercentageInput: {
          width: "60px",
          marginLeft: 30,
        },
      }),
    []
  );
};
