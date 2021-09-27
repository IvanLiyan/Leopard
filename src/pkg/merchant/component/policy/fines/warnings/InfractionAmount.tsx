import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Core Imports */

/* Toolkit Imports */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* External Libraries */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import FineExemptionInfo from "@merchant/component/policy/fines/order-fines/FineExemptionInfo";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Infraction } from "@merchant/api/warnings";

type InfractionAmountProps = BaseProps & {
  readonly fineItem: Infraction;
};

const InfractionAmount = (props: InfractionAmountProps) => {
  const { fineItem } = props;
  const styles = useStylesheet();
  const { fine_amount: fineAmount, fine_currency: currency } = fineItem;

  const initialAmount = fineItem.initial_fine_amount || 0;
  const fineReduced =
    fineItem.fine_reduction_per_proof &&
    fineAmount &&
    fineAmount < initialAmount;
  const isExempt = fineItem.fine_is_exempt;
  const fineExemptionParagraphs = fineItem.fine_exempt_paragraphs;
  const fineExemptionInfoLinkDict = fineItem.fine_exempt_info_link_dict;

  if (fineAmount == null) {
    return (
      <span
        style={{
          color: colors.palettes.textColors.LightInk,
        }}
      >
        N/A
      </span>
    );
  }

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

  if (fineReduced && fineAmount) {
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
    <span className={css(styles.fineAmount)}>
      {formatCurrency(fineAmount || 0, currency)}
    </span>
  );
};

export default InfractionAmount;

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
    []
  );
