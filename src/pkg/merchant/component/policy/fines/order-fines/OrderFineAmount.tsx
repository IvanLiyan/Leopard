import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Relative Imports */
import FineExemptionInfo from "./FineExemptionInfo";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineDisplayItem } from "@merchant/api/fines";

type OrderFineAmountProps = BaseProps & {
  readonly fineItem: FineDisplayItem;
};

const OrderFineAmount = (props: OrderFineAmountProps) => {
  const { fineItem } = props;
  const styles = useStylesheet();
  const { localized_amount: fineAmount, localized_currency: currency } =
    fineItem;

  const initialAmount = fineItem.merchant_fine?.localized_initial_amount || 0;
  const fineReduced =
    initialAmount && fineAmount > 0 && initialAmount < fineAmount;
  const isExempt = fineItem.merchant_fine?.is_exempt;
  const fineExemptionParagraphs =
    fineItem.merchant_fine?.fine_exempt_paragraphs;
  const fineExemptionInfoLinkDict =
    fineItem.merchant_fine?.fine_exempt_info_link_dict;

  if (isExempt && fineExemptionParagraphs && fineExemptionInfoLinkDict) {
    return (
      <div className={css(styles.exemptFine)}>
        <span>{formatCurrency(initialAmount, currency)}</span>
        <FineExemptionInfo
          fineExemptionParagraphs={fineExemptionParagraphs}
          fineExemptionInfoLinkDict={{
            infoLink: fineExemptionInfoLinkDict.info_link,
            linkType: fineExemptionInfoLinkDict.link_type,
          }}
        />
      </div>
    );
  }

  if (fineReduced) {
    return (
      <div className={css(styles.fineAmount)}>
        <span className={css(styles.oldFineAmount)}>
          {formatCurrency(initialAmount, currency)}
        </span>
        &nbsp;
        <span>{formatCurrency(fineAmount, currency)}</span>
      </div>
    );
  }

  return (
    <span className={css(fineItem.is_reversed ? styles.oldFineAmount : null)}>
      {formatCurrency(
        fineAmount == 0 && initialAmount > 0 ? initialAmount : fineAmount,
        currency,
      )}
    </span>
  );
};

export default OrderFineAmount;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        fineAmount: {
          fontSize: 14,
          color: colors.text,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
        oldFineAmount: {
          textDecoration: "line-through",
          opacity: 0.7,
        },
        exemptFine: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [],
  );
