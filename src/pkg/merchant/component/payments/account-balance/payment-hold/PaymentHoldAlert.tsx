import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
/* Relative Imports */
import PaymentHoldRow from "./PaymentHoldRow";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PaymentHoldType = Readonly<{
  hold_type: number;
  is_infraction_hold?: string;
  infraction: InfractionType | null | undefined;
  withhold_until: string;
  message?: string;
  creation_time: string;
  display_name: string;
  message_translated: string;
  hold_type_text_en: string;
  hold_type_text_zh: string;
  hold_detail_link: Readonly<{
    text: string;
    url: string;
  }>;
}>;

type InfractionType = {
  reason: number;
  id: string;
};

export type PaymentHoldAlertType = BaseProps & {
  readonly holds: Array<PaymentHoldType>;
  readonly locale: string | undefined;
  readonly reauthenticationId: string;
};

const PaymentHoldAlert = (props: PaymentHoldAlertType) => {
  const themeColor = palettes.yellows.Yellow;

  const styles = useStylesheet();
  return (
    <Tip className={css(styles.tip)} color={themeColor} icon="tip">
      <div className={css(styles.textContainer)}>
        <div className={css(styles.titleRow)}>
          <div className={css(styles.titleText)}>
            Your payments are being withheld for the following reasons
          </div>
          <div className={css(styles.createdOn)}>Created on</div>
        </div>
        <PaymentHoldRow {...props} />
      </div>
    </Tip>
  );
};
export default PaymentHoldAlert;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        textContainer: {
          alignItems: "flex-start",
          color: palettes.textColors.Ink,
          display: "flex",
          flexDirection: "column",
          fontSize: 14,
          justifyContent: "center",
          flexGrow: 1,
          overflow: "hidden",
        },
        descriptionText: {
          fontWeight: fonts.weightMedium,
          flexGrow: 1,
          width: "100%",
          color: palettes.textColors.DarkInk,
          display: "flex",
        },
        titleText: {
          fontWeight: fonts.weightBold,
          fontSize: 16,
        },
        link: {
          marginLeft: 4,
          flex: "1 0 auto",
          marginRight: 5,
        },
        createdOn: {
          fontSize: 14,
          float: "right",
          fontWeight: fonts.weightBold,
          color: palettes.textColors.DarkInk,
        },
        createdTime: {
          float: "right",
          flex: "0 0 auto",
        },
        titleRow: {
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 9,
        },
        holdName: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.DarkInk,
          marginRight: 5,
          flex: "0 0 auto",
        },
        combinedMessage: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: "0 1 auto",
        },
        tip: {
          fontSize: 14,
          display: "flex",
        },
      }),
    []
  );
};
