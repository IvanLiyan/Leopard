import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Link, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { PaymentHoldAlertType } from "@merchant/component/payments/account-balance/payment-hold/PaymentHoldAlert";

const PaymentHoldRow = (props: PaymentHoldAlertType) => {
  const { holds, locale } = props;
  const styles = useStylesheet();
  const [showText, setShowText] = useState(false);

  return (
    <>
      {holds.map((hold) => (
        <div className={css(styles.descriptionText)}>
          <div className={css(styles.text)}>
            <Text weight="bold" className={css(styles.holdName)}>
              {hold.display_name}
            </Text>
            <span
              className={css(
                showText ? styles.expandedMessage : styles.combinedMessage
              )}
            >
              {locale === "zh"
                ? hold.hold_type_text_zh
                : hold.hold_type_text_en}
            </span>
            {hold.hold_detail_link.text.trim().length > 0 && (
              <Link
                className={css(styles.link)}
                href={hold.hold_detail_link.url}
                openInNewTab
              >
                <Text weight="medium">{hold.hold_detail_link.text}</Text>
              </Link>
            )}
          </div>
          <span className={css(styles.createdTime)}>
            {hold.creation_time.split(" ")[0]}
          </span>
        </div>
      ))}
      <Link className={css(styles.link)} onClick={() => setShowText(!showText)}>
        {!showText ? i`Show full text` : i`Hide full text`}
      </Link>
    </>
  );
};

export default PaymentHoldRow;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        descriptionText: {
          flexGrow: 1,
          width: "100%",
          color: palettes.textColors.DarkInk,
          display: "flex",
          justifyContent: "space-between",
        },
        link: {
          marginLeft: 4,
          flex: "1 0 auto",
          marginRight: 5,
        },
        createdTime: {
          float: "right",
          flex: "0 0 auto",
        },
        holdName: {
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
        expandedMessage: {
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
          flex: "0 1 auto",
        },
        text: {
          display: "flex",
          overflow: "hidden",
        },
      }),
    []
  );
};
