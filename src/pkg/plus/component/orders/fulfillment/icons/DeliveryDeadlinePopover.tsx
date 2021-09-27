import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { css } from "@toolkit/styling";
import { zendeskURL } from "@legacy/core/url";

import { Link } from "@ContextLogic/lego";

import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly deliveryDeadline?: string | null | undefined;
};
const DeliveryDeadlinePopover: React.FC<Props> = ({
  style,
  className,
  deliveryDeadline,
}: Props) => {
  const styles = useStylesheet();
  return (
    <div className={css(style, className, styles.popoverRoot)}>
      <div className={css(styles.title)}>Wish Express</div>
      <div className={css(styles.deadline)}>
        Delivery required by {deliveryDeadline}
      </div>

      <p className={css(styles.body)}>
        Orders enrolled for Wish Express need to be confirmed delivered within
        the required time frame.
      </p>
      <Link className={css(styles.link)} href={zendeskURL("231264967")}>
        Learn more
      </Link>
      <Link
        className={css(styles.link)}
        href="/documentation/confirmeddeliveryshippingcarriers"
      >
        View Confirmed Delivery Carriers
      </Link>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        popoverRoot: {
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 250,
        },
        title: {
          fontWeight: fonts.weightSemibold,
          fontSize: 16,
          color: textDark,
        },
        deadline: {
          margin: "5px 0px",
          fontWeight: fonts.weightSemibold,
          fontSize: 16,
          color: textDark,
        },
        body: {
          marginTop: 5,
          fontWeight: fonts.weightNormal,
          fontSize: 16,
          color: textDark,
        },
        link: {
          margin: "2px 0px",
        },
      }),
    [textDark]
  );
};

export default DeliveryDeadlinePopover;
