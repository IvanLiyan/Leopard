/*
 *
 * WishExpressTip.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import * as fonts from "@toolkit/fonts";

import WishExpressIcon from "@plus/component/orders/fulfillment/icons/WishExpressIcon";

import { Markdown } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly orderId: string;
  readonly deliveryDeadline?: string | null | undefined;
};

const WishExpressTip: React.FC<Props> = ({
  className,
  style,
  orderId,
  deliveryDeadline,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.confirmedDeliveryContainer)}>
        <WishExpressIcon className={css(styles.checkmark)} />
        <div className={css(styles.confirmedDelivery)}>Wish Express</div>
      </div>

      {deliveryDeadline && (
        <Markdown
          className={css(styles.deadline)}
          text={i`**Delivery required by** ${deliveryDeadline}`}
        />
      )}

      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Orders enrolled for Wish Express need to be confirmed ` +
          i`delivered within the required time frame. [Learn more](${zendeskURL(
            "231264967"
          )})`
        }
      />

      <Markdown
        className={css(styles.orderId)}
        text={i`**Order** ${orderId}`}
      />
    </div>
  );
};

export default observer(WishExpressTip);

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "20px 20px",
        },
        confirmedDeliveryContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        confirmedDelivery: {
          fontWeight: fonts.weightBold,
        },
        deadline: {
          margin: "20px 0px",
        },
        orderId: {},
        paragraph: {
          marginBottom: 20,
        },
        checkmark: {
          width: 25,
          marginRight: 10,
        },
      }),
    [surfaceLightest]
  );
};
