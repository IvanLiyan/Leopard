/*
 *
 * AdvancedLogisticsSection.tsx
 *
 * Created by Joyce Ji on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  CurrencyInput,
  Markdown,
  TextInput,
  Switch,
  Alert,
  HorizontalField,
} from "@ContextLogic/lego";
import "@ContextLogic/lego";
import Popover from "@merchant/component/core/Popover";

/* Lego Toolkit */
import { RequiredValidator } from "@toolkit/validators";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import CountryFlagsGroup from "@merchant/component/products/product-shipping/CountryFlagsGroup";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import ProductShippingEditState from "@merchant/model/products/ProductShippingEditState";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Link from "@next-toolkit/Link";

type Props = BaseProps & {
  readonly editState: ProductShippingEditState;
};

const ExampleCalculationFieldWidth = 250;
const AllowedShippingIncreaseAmountCny = 70; // MKL-35242

const AdvancedLogisticsSection: React.FC<Props> = ({ editState }: Props) => {
  const styles = useStylesheet();
  const {
    warehouseId,
    primaryCurrency,
    forceValidation,
    showUnityEffectiveDate,
    unityEffectiveDateStandardWarehouse,
    showDomesticShippingPrice,
    hasUnityCountriesEnabled,
    hasUnityCountriesEnabledAccountLevel,
  } = editState;
  const domesticShippingPrice = editState.getDomesticShippingPrice(warehouseId);
  const domesticShippingEstimate =
    editState.getDomesticShippingEstimate(warehouseId);
  const domesticShippingEnabled =
    editState.getDomesticShippingEnabled(warehouseId);
  const [showExample, setShowExample] = useState<boolean>(false);

  const shippingPriceTooltip =
    i`Wish is calculating an estimated First-Mile Shipping Price for ` +
    i`your customers to pay based on historical order data of this ` +
    i`product. You may be reimbursed for WishPost shipping.`;
  const shippingSettingsLink = i`[Enable First-Mile Shipping countries](/shipping-settings).`;

  const renderDomesticShippingNotApplicable = () => {
    return (
      <HorizontalField
        titleWidth={400}
        titleAlign={"start"}
        title={i`Ship to First-Mile Shipping countries:`}
        className={css(styles.verticalMargin)}
      >
        <Popover
          position="top center"
          popoverContent={() => {
            return (
              <Markdown
                text={
                  i`To begin receiving orders from customers in the ` +
                  i`First-Mile Shipping countries listed below, ` +
                  i`please enable one or more of these countries in your ` +
                  i`Shipping Settings and set up shipping prices first. ` +
                  i`Once Wish receives sufficient historical order data ` +
                  i`for this product, the shipping prices set up by you ` +
                  i`will be transitioned to a Wish-estimated First-Mile ` +
                  i`Shipping Price for your customers to pay. ` +
                  i`${shippingSettingsLink}`
                }
                className={css(styles.tooltip)}
                openLinksInNewTab
              />
            );
          }}
        >
          <TextInput value={i`N/A`} className={css(styles.input)} disabled />
        </Popover>
      </HorizontalField>
    );
  };

  const renderDomesticShippingCalculating = () => {
    return (
      <HorizontalField
        title={i`First-Mile Shipping Price`}
        titleWidth={400}
        titleAlign={"start"}
        popoverContent={shippingPriceTooltip}
        className={css(styles.verticalMargin)}
      >
        <Popover
          position="top center"
          popoverMaxWidth={300}
          popoverContent={shippingPriceTooltip}
          popoverFontSize={14}
        >
          <TextInput
            value={i`Calculating...`}
            className={css(styles.input)}
            disabled
            style={{ width: 150 }}
          />
        </Popover>
      </HorizontalField>
    );
  };

  const renderDomesticShippingNotEnrolled = () => {
    return hasUnityCountriesEnabled
      ? renderDomesticShippingCalculating()
      : renderDomesticShippingNotApplicable();
  };

  const renderDomesticShippingPriceFields = () => {
    return (
      <>
        <HorizontalField
          titleWidth={400}
          titleAlign={"start"}
          title={i`Ship to countries included in the unification initiative`}
          className={css(styles.verticalMargin)}
        >
          <Switch
            isOn={domesticShippingEnabled || false}
            onToggle={(isOn: boolean) => {
              editState.setDomesticShippingEnabled(isOn, warehouseId);
            }}
          />
        </HorizontalField>

        {showUnityEffectiveDate && (
          <HorizontalField
            titleWidth={400}
            titleAlign={"start"}
            title={i`Effective date`}
            className={css(styles.verticalMargin)}
            popoverContent={
              i`This is the date (UTC) when the First-Mile Shipping Price ` +
              i`will begin applying to this product’s orders bound for the ` +
              i`destination countries included in Wish’s unification initiative.`
            }
          >
            <TextInput
              value={unityEffectiveDateStandardWarehouse}
              className={css(styles.input)}
              disabled
              style={{ width: 150 }}
            />
          </HorizontalField>
        )}

        {domesticShippingEnabled && (
          <HorizontalField
            title={i`First-Mile Shipping Price`}
            titleWidth={400}
            titleAlign={"start"}
            className={css(styles.verticalMargin)}
          >
            {renderDomesticShippingInput()}
          </HorizontalField>
        )}
      </>
    );
  };

  const renderDomesticShippingInput = () => {
    return (
      <div className={css(styles.column)}>
        <CurrencyInput
          value={domesticShippingPrice?.toString()}
          placeholder="0.00"
          className={css(styles.input)}
          currencyCode={primaryCurrency}
          hideCheckmarkWhenValid
          onChange={({ textAsNumber }) =>
            editState.setDomesticShippingPrice(textAsNumber ?? NaN, warehouseId)
          }
          debugValue={(Math.random() * 10).toFixed(2).toString()}
          forceValidation={forceValidation}
          validators={[new RequiredValidator()]}
          disabled={editState.isSubmitting}
          style={{ width: 150 }}
        />
        {domesticShippingEstimate != null &&
          domesticShippingPrice != null &&
          domesticShippingEstimate !== domesticShippingPrice && (
            <p>
              {domesticShippingPrice >
                domesticShippingEstimate + AllowedShippingIncreaseAmountCny && (
                <span>
                  You cannot increase the First-Mile Shipping Price by more than
                  {formatCurrency(AllowedShippingIncreaseAmountCny, "CNY")} of
                  the estimate.
                </span>
              )}{" "}
              <span>
                Based on historical order data, the estimated First-Mile
                Shipping Price is
                {formatCurrency(domesticShippingEstimate, primaryCurrency)}
              </span>
            </p>
          )}
        {showExample && (
          <>
            <Alert
              text={
                i`Below is an example of how you will be paid ` +
                i`and reimbursed for shipping a hypothetical ` +
                i`United States-bound order under Wish’s unification ` +
                i`initiative. Actual First-Mile Shipping Price and ` +
                i`WishPost Shipping may vary.`
              }
              sentiment={"info"}
              className={css(styles.verticalMargin)}
            />
            <HorizontalField
              title={i`First-Mile Shipping Price`}
              titleWidth={ExampleCalculationFieldWidth}
              titleAlign={"start"}
              className={css(styles.verticalMarginSmall)}
            >
              <div className={css(styles.rightAlignInput)}>
                {" "}
                {formatCurrency(10, "CNY")}
              </div>
            </HorizontalField>

            <HorizontalField
              title={i`After Rev Share`}
              titleWidth={ExampleCalculationFieldWidth}
              titleAlign={"start"}
              className={css(styles.verticalMarginSmall)}
            >
              <div className={css(styles.rightAlignInput)}>85%</div>
            </HorizontalField>

            <hr className={css(styles.dashed)} />

            <HorizontalField
              title={i`First-Mile Shipping Cost`}
              titleWidth={ExampleCalculationFieldWidth}
              titleAlign={"start"}
              className={css(styles.verticalMarginSmall)}
            >
              <div className={css(styles.rightAlignInput)}>
                {formatCurrency(8.5, "CNY")}
              </div>
            </HorizontalField>

            <HorizontalField
              title={``}
              titleWidth={ExampleCalculationFieldWidth}
              titleAlign={"start"}
              className={css(styles.verticalMarginSmall)}
            >
              <div className={css(styles.rightAlignInput)}> + </div>
            </HorizontalField>

            <HorizontalField
              title={i`WishPost Shipping`}
              titleWidth={ExampleCalculationFieldWidth}
              titleAlign={"start"}
              className={css(styles.verticalMarginSmall)}
            >
              <div className={css(styles.rightAlignInput)}>
                {formatCurrency(20, "CNY")}
              </div>
            </HorizontalField>

            <hr className={css(styles.dashed)} />

            <HorizontalField
              title={i`Estimated Total`}
              titleWidth={ExampleCalculationFieldWidth}
              titleAlign={"start"}
              className={css(styles.verticalMarginSmall)}
            >
              <div className={css(styles.rightAlignInput)}>
                {formatCurrency(28.5, "CNY")}
              </div>
            </HorizontalField>
          </>
        )}
        <Link onClick={() => setShowExample(!showExample)}>
          {showExample ? i`Hide example` : i`Show example calculation`}
        </Link>
      </div>
    );
  };

  const renderCalculatedShippingToggle = () => {
    let popoverContent = "";

    if (!hasUnityCountriesEnabledAccountLevel) {
      popoverContent =
        i`Wish Supported Logistics cannot be enabled when all WSL countries are disabled, ` +
        i`you can go to [Shipping Settings](${"/shipping-settings"}) to enable those countries.`;
    }

    const switchDisabled = !hasUnityCountriesEnabledAccountLevel;
    const switchIsOn = (domesticShippingEnabled && !switchDisabled) || false;

    return (
      <HorizontalField
        titleAlign={"start"}
        titleWidth={"320"}
        titleStyle={{ fontSize: 15 }}
        title={i`Enable Calculated Shipping for this product`}
        className={css(styles.verticalMargin)}
        popoverContent={popoverContent}
      >
        <Switch
          isOn={switchIsOn}
          onToggle={(isOn: boolean) => {
            editState.setDomesticShippingEnabled(isOn, warehouseId);
          }}
          disabled={switchDisabled}
        />
      </HorizontalField>
    );
  };

  const renderUnityEUComplianceBanners = () => {
    return (
      <div className={css(styles.form)}>
        <Alert
          text={
            i`Your product impressions (and in effect, sales) in all EU countries ` +
            i`have been blocked. To resume selling into the EU, ` +
            i`link a Responsible Person to this product.`
          }
          sentiment="warning"
        />
      </div>
    );
  };

  const renderOldUnitySection = () => {
    // Pending state is removed, so renderDomesticShippingNotEnrolled won't be relevant
    // Deprecate in https://jira.wish.site/browse/MKL-54646

    return (
      <div className={css(styles.root)}>
        <Markdown
          text={
            i`To help merchants streamline their shipping process, ` +
            i`Wish has launched a shipping unification initiative ` +
            i`that covers a growing list of destination countries, ` +
            i`starting with the following select high-GMV countries ` +
            i`supported by the Advanced Logistics Program. By choosing ` +
            i`to ship to all countries below, you simply need to ` +
            i`deliver the orders to a designated warehouse located ` +
            i`in Mainland China, and Wish will take care of the rest.`
          }
        />

        <div className={css(styles.form)}>
          {showDomesticShippingPrice
            ? renderDomesticShippingPriceFields()
            : renderDomesticShippingNotEnrolled()}
        </div>

        {editState.showUnityEUComplianceBanners &&
          renderUnityEUComplianceBanners()}

        <div className={css(styles.greyBackground)}>
          Destination countries included in Wish’s shipping unification
          initiative
        </div>

        <CountryFlagsGroup editState={editState} />
      </div>
    );
  };

  const urlPlaceholder = "wish.com";
  const renderCalculatedShippingSection = () => {
    return (
      <div className={css(styles.root)}>
        <Markdown
          text={
            i`Calculated shipping allows Wish to dynamically calculate ` +
            i`the shipping cost based on the weight of items in an order ` +
            i`headed to countries/regions in the Advanced Logistics Program. ` +
            i`Simply provide the logistics information for your product, and ` +
            i`we’ll handle the rest. ` +
            i`[Learn more](${urlPlaceholder}).`
          }
        />

        {/* todo: check if should show the toggle or unclickable */}
        {renderCalculatedShippingToggle()}

        {editState.showCalculatedShippingEUComplianceBanners &&
          renderUnityEUComplianceBanners()}
      </div>
    );
  };

  return editState.isMerchantInCalculatedShippingBeta
    ? renderCalculatedShippingSection()
    : renderOldUnitySection();
};

export default observer(AdvancedLogisticsSection);

const useStylesheet = () => {
  const { surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        column: {
          display: "flex",
          flexDirection: "column",
        },
        greyBackground: {
          fontSize: 16,
          padding: 8,
          backgroundColor: surfaceLight,
        },
        input: {
          alignSelf: "flex-start",
          maxWidth: 200,
        },
        rightAlignInput: {
          alignSelf: "flex-end",
        },
        form: {
          padding: 15,
        },
        verticalMargin: {
          margin: "16px 0",
        },
        verticalMarginSmall: {
          margin: "2px 0",
        },
        dashed: {
          borderTop: "1px dashed #bbb",
          padding: 0,
          margin: 0,
        },
        tooltip: {
          maxWidth: 300,
          fontSize: 14,
          padding: 14,
        },
      }),
    [surfaceLight]
  );
};
