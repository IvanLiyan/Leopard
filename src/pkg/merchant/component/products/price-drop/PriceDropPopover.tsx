import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { RangeSlider, RangeSliderProps } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightMedium, weightSemibold } from "@toolkit/fonts";
import * as icons from "@assets/icons";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";
import { PriceDropRangeParams } from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useUserStore } from "@merchant/stores/UserStore";
import { useTheme } from "@merchant/stores/ThemeStore";

type PriceDropPopoverProps = BaseProps & {
  readonly dropPercentage: number;
  readonly rangeSliderHandler: RangeSliderProps["onChange"];
  readonly priceDropItem: ImprBoosterItem;
  readonly renderPriceRange: (params: PriceDropRangeParams) => string;
  readonly minDropPercentage?: number;
  readonly onPriceDropActionUpdated?: (arg0: any) => void;
  readonly isongoing?: boolean;
};

const PriceDropLogTable = "PRICE_DROP_UI";

const PriceDropPopover = (props: PriceDropPopoverProps) => {
  const {
    className,
    style,
    dropPercentage,
    rangeSliderHandler,
    renderPriceRange,
    priceDropItem,
    minDropPercentage = priceDropItem.min_drop_percentage,
    onPriceDropActionUpdated,
    isongoing = false,
  } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { loggedInMerchantUser } = useUserStore();

  const popoverContent = (
    <div className={css(style, className, styles.suggestedPricePopover)}>
      {isongoing && (
        <div className={css(styles.nonSelectableText)}>
          {" "}
          Increase percentage{" "}
        </div>
      )}
      {!isongoing && (
        <div className={css(styles.nonSelectableText)}> Drop price to </div>
      )}
      <RangeSlider
        className={css(styles.slider)}
        value={dropPercentage}
        range={[minDropPercentage, priceDropItem.max_drop_percentage]}
        stepSize={1}
        onChange={rangeSliderHandler}
      />
      <div className={css(styles.resultedProductPriceRow)}>
        <div className={css(styles.boldNumbers)}>
          {ci18n(
            "placeholder is a sale/discount",
            "%1$s off",
            numeral(dropPercentage / 100.0).format("0%")
          )}
        </div>
        <div className={css(styles.textDiluted)}>
          {renderPriceRange({
            minPrice: priceDropItem.original_localized_price_min,
            maxPrice: priceDropItem.original_localized_price_max,
            dropPercentage,
          })}
        </div>
      </div>
      {isongoing && (
        <PrimaryButton
          className={css(styles.button)}
          onClick={async () => {
            return new ConfirmationModal(() => {
              return (
                <div className={css(styles.confirmationModalContent)}>
                  <div className={css(styles.confirmText)}>
                    {" "}
                    Confirm new Price Drop campaign for the selected product{" "}
                  </div>
                  <p>
                    By confirming, you are creating a new Price Drop campaign
                    with the newly selected percentage for this product. The
                    current campaign will end tomorrow and the new campaign will
                    begin on the day after tomorrow.
                  </p>
                  <p>Please confirm the new campaign below</p>
                </div>
              );
            })
              .setIllustration("priceDropCampaign")
              .setHeader({
                title: i`Confirm Campaign`,
              })
              .setCancel(i`Cancel`)
              .setAction(i`Confirm`, async () => {
                const priceDropRecordIds = priceDropItem.id;
                logger.log(PriceDropLogTable, {
                  merchant_id: loggedInMerchantUser.merchant_id,
                  action: PriceDropLoggingActions.CLICK_REISSUE_PRICE_DROP,
                  price_drop_record_id: priceDropRecordIds,
                });

                try {
                  await priceDropApi
                    .reissuePriceDropCampaign({
                      drop_percentage: dropPercentage,
                      campaign_id: priceDropItem.id,
                    })
                    .call();
                } catch (e) {
                  return;
                }
                const successMsg = i`You successfully dropped the price.`;
                toastStore.positive(successMsg);
                if (onPriceDropActionUpdated == null) {
                  navigationStore.reload();
                } else {
                  onPriceDropActionUpdated(false);
                }
              })
              .setFooterStyle({
                justifyContent: "center",
              })
              .setWidthPercentage(0.42)
              .render();
          }}
        >
          Save campaign
        </PrimaryButton>
      )}
    </div>
  );
  return (
    <Popover position="top" popoverContent={() => popoverContent}>
      <div className={css(styles.priceDropButton)}>
        <div className={css(styles.option)}>
          {ci18n(
            "placeholder is a sale/discount",
            "%1$s off",
            numeral(dropPercentage / 100.0).format("0%")
          )}
          <img src={icons.chevronRight} className={css(styles.chevron)} />
        </div>
      </div>
    </Popover>
  );
};

export default observer(PriceDropPopover);

const useStylesheet = () => {
  const { textBlack, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        suggestedPricePopover: {
          margin: "20px",
        },
        nonSelectableText: {
          textAlign: "left",
          marginLeft: 16,
          marginBottom: 16,
          userSelect: "none",
          fontSize: "16px",
          fontWeight: weightSemibold,
        },
        confirmationModalContent: {
          fontSize: 16,
          fontWeight: weightMedium,
          lineHeight: 1.5,
          textAlign: "center",
          marginLeft: 50,
          marginRight: 50,
        },
        confirmText: {
          fontSize: "20px",
          color: textBlack,
          fontWeight: weightBold,
          lineHeight: 1.5,
        },
        slider: {
          marginLeft: 16,
          marginRight: 16,
          minWidth: 250,
          marginTop: 10,
          marginBottom: 10,
        },
        resultedProductPriceRow: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          userSelect: "none",
          justifyContent: "space-between",
        },
        boldNumbers: {
          fontWeight: weightBold,
          lineHeight: 1.5,
          marginRight: 50,
          marginLeft: 16,
        },
        button: {
          marginTop: 16,
          marginLeft: 16,
          marginRight: 16,
        },
        textDiluted: {
          color: "#7790a3",
          fontWeight: weightMedium,
          marginRight: 16,
        },
        priceDropButton: {
          border: `solid 1px ${primary}`,
          borderRadius: 4,
          overflow: "hidden",
          opacity: 1,
          height: 40,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "white",
          width: 100,
        },
        option: {
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          ":hover": {
            opacity: 1,
            backgroundColor: "rgba(47, 183, 236, 0.2)",
            color: primary,
          },
          padding: "8px 15px",
          flex: 1,
          whiteSpace: "nowrap",
        },
        chevron: {
          marginLeft: "10px",
          transform: "rotate(90deg)",
        },
      }),
    [primary, textBlack]
  );
};
