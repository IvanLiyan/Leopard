import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H6, H7, H7Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

import { PickedOrderSalesTaxDetailsSchema } from "@toolkit/orders/tax";
import RemitPopover from "./RemitPopover";
import OrderTaxDetailModal from "./OrderTaxDetailModal";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly orderId: string;
  readonly salesTaxData: PickedOrderSalesTaxDetailsSchema | null | undefined;
};

const OrderTaxCell: React.FC<Props> = (props: Props) => {
  const { className, style, orderId, salesTaxData } = props;
  const styles = useStylesheet();

  if (salesTaxData == null) {
    return <span>--</span>;
  }

  const {
    remitTypes,
    netTax,
    merchantRemitNetTaxInAuthorityCurrency,
    wishRemitNetTaxInAuthorityCurrency,
  } = salesTaxData;
  if (remitTypes.length == 0) {
    return <span>--</span>;
  }

  const isFullyWishRemit =
    remitTypes.length == 1 && remitTypes[0] == "WISH_REMIT";
  const popoverPosition = "left center";
  if (isFullyWishRemit) {
    return (
      <RemitPopover
        className={css(className, style)}
        remitTypes={remitTypes}
        position={popoverPosition}
      >
        <Illustration
          name="blueCheckmark"
          alt="marketplace"
          className={css(styles.icon)}
        />
      </RemitPopover>
    );
  }

  return (
    <Popover
      position={popoverPosition}
      popoverMaxWidth={300}
      popoverMinWidth={300}
      popoverContent={() => (
        <div className={css(styles.details)}>
          <H7Markdown
            text={
              i`We have collected **${netTax.display}** on this order ` +
              i`based on your Tax Settings. Please review the tax amount ` +
              i`collected and tax obligations below: `
            }
            style={css(styles.text)}
          />
          <div className={css(styles.taxCollected)}>
            <H6 className={css(styles.text)}>
              {ci18n(
                "This is a label. Placed in from of the amount of tax that was collected",
                "Tax collected",
              )}
            </H6>
            <H6 className={css(styles.text)}>{netTax.display}</H6>
          </div>
          <div className={css(styles.taxLiability)}>
            <H6 className={css(styles.text, styles.taxLiabilityText)}>
              {ci18n(
                "This is a label. Placed in from of the amount of tax that was collected",
                "Tax liability",
              )}
            </H6>
            <div className={css(styles.remitBreakdown)}>
              {merchantRemitNetTaxInAuthorityCurrency.amount > 0 && (
                <H7 className={css(styles.text, styles.taxLiabilityText)}>
                  {merchantRemitNetTaxInAuthorityCurrency.display} (merchant
                  remits)
                </H7>
              )}
              {wishRemitNetTaxInAuthorityCurrency.amount > 0 && (
                <H7 className={css(styles.text, styles.taxLiabilityText)}>
                  {wishRemitNetTaxInAuthorityCurrency.display} (Wish remits)
                </H7>
              )}
            </div>
          </div>
          <H7 className={css(styles.text)}>
            You will receive the applicable tax amount collected by Wish in your
            next payment disbursement, excluding refunds or deductions.
          </H7>
        </div>
      )}
    >
      <div
        className={css(styles.root, className, style)}
        onClick={() => new OrderTaxDetailModal({ orderId }).render()}
      >
        {netTax.display}
      </div>
    </Popover>
  );
};

const useStylesheet = () => {
  const { primary, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          fontSize: 14,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: primary,
          cursor: "pointer",
        },
        icon: {
          width: 25,
        },
        details: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 7,
          maxWidth: 260,
        },
        taxCollected: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "8px 0px",
          borderBottom: `1px solid ${borderPrimaryDark}`,
        },
        taxLiability: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "8px 0px",
        },
        taxLiabilityText: {
          ":not(:last-child)": {
            marginBottom: 5,
          },
        },
        remitBreakdown: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
        },
        text: {
          fontSize: 14,
        },
      }),
    [primary, borderPrimaryDark],
  );
};

export default observer(OrderTaxCell);
