import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ci18n } from "@legacy/core/i18n";

import { Link, Info } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

import WishRemitIcon from "./WishRemitIcon";
import OrderTaxDetailModal from "./OrderTaxDetailModal";
import RemittanceCurrencyDetails from "./RemittanceCurrencyDetails";

import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { OrderDetailInitialData } from "@toolkit/orders/detail";

type Props = BaseProps & {
  readonly initialData: OrderDetailInitialData;
};

const RowHeight = 50;

const TaxSheetItems: React.FC<Props> = ({
  initialData,
  style,
  className,
}: Props) => {
  const styles = useStylesheet();
  const {
    fulfillment: { order },
  } = initialData;

  const { tax, merchantCurrencyAtPurchaseTime, hasShipped } = order;
  if (tax == null || !hasShipped) {
    return null;
  }

  const {
    salesTax: {
      merchantRemitItems,
      netTax,
      salesTax,
      remitTypes,
      refundedTax,
      wishRemitNetTaxInAuthorityCurrency,
      authorityCountry,
      merchantRemitNetTaxInAuthorityCurrency,
    },
  } = tax;

  if (remitTypes.length == 0) {
    return null;
  }

  const isWishRemitOnly =
    remitTypes.length == 1 && remitTypes.includes("WISH_REMIT");

  const isTBDRemitOnly =
    remitTypes.length == 1 && remitTypes.includes("TBD_REMIT");
  if (isTBDRemitOnly) {
    return null;
  }

  if (isWishRemitOnly) {
    return (
      <SheetItem
        className={css(
          styles.bottomBordered,
          styles.fixedHeightSheetItem,
          style,
          className
        )}
        title={i`Tax`}
      >
        <WishRemitIcon />
      </SheetItem>
    );
  }

  const showBreakdown = refundedTax.amount > 0;

  return (
    <div className={css(styles.content, style, className)}>
      <div className={css(styles.breakdown, styles.bottomBordered)}>
        <SheetItem
          className={css(styles.fixedHeightSheetItem)}
          title={ci18n(
            "Label for the amount of tax that we charged the user",
            "Tax collected"
          )}
        >
          {salesTax.display}
        </SheetItem>
        {showBreakdown && (
          <>
            <SheetItem
              className={css(styles.fixedHeightSheetItem)}
              title={ci18n(
                "Label for the amount of tax that we refunded back to the user",
                "Tax refunded"
              )}
            >
              <div
                className={css(styles.refunded)}
              >{`- ${refundedTax.display}`}</div>
            </SheetItem>
            <SheetItem
              className={css(styles.fixedHeightSheetItem)}
              title={ci18n(
                "Label for the amount of tax that we is owed to the government after subtracting refunds etc",
                "Net tax"
              )}
            >
              <div className={css(styles.sheetContent)}>
                {netTax.display}

                {authorityCountry && (
                  <Info
                    className={css(styles.infoLabel)}
                    popoverContent={() => (
                      <RemittanceCurrencyDetails
                        field="net_tax"
                        value={netTax}
                        merchantCurrency={merchantCurrencyAtPurchaseTime}
                      />
                    )}
                    position="right center"
                  />
                )}
              </div>
            </SheetItem>
          </>
        )}
      </div>
      <SheetItem
        title={i`Tax liability`}
        className={css(styles.fixedHeightSheetItem, styles.bottomBordered)}
      >
        <div className={css(styles.liabilityContainer)}>
          <div className={css(styles.liability)}>
            {merchantRemitNetTaxInAuthorityCurrency.display} (merchant remits)
          </div>
          {wishRemitNetTaxInAuthorityCurrency.amount > 0 && (
            <div className={css(styles.liability)}>
              {wishRemitNetTaxInAuthorityCurrency.display} (Wish remits)
            </div>
          )}
        </div>
      </SheetItem>
      {merchantRemitItems.length > 0 && (
        <SheetItem
          title={i`Tax authorities`}
          className={css(styles.fixedHeightSheetItem, styles.bottomBordered)}
        >
          <Link
            onClick={() =>
              new OrderTaxDetailModal({ orderId: order.id }).render()
            }
          >
            View details
          </Link>
        </SheetItem>
      )}
    </div>
  );
};

export default observer(TaxSheetItems);

const useStylesheet = () => {
  const { borderPrimary, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fixedHeightSheetItem: {
          "@media (max-width: 900px)": {
            height: RowHeight * 1.2,
          },
          "@media (min-width: 900px)": {
            height: RowHeight,
          },
          padding: "0px 20px",
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        refunded: {
          color: negative,
        },
        liabilityContainer: {
          display: "flex",
          flexDirection: "column",
        },
        liability: {},
        breakdown: {
          display: "flex",
          flexDirection: "column",
        },
        bottomBordered: {
          borderBottom: `1px solid ${borderPrimary}`,
        },
        infoLabel: {
          marginLeft: 5,
        },
        sheetContent: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [borderPrimary, negative]
  );
};
