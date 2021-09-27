/*
 *
 * ConfirmedDeliveryTip.tsx
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

import ConfirmedDeliveryIcon from "@plus/component/orders/fulfillment/icons/ConfirmedDeliveryIcon";

import { Markdown } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {};

const ConfirmedDeliveryTip: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  const learnMore = `[${i`Learn more`}](${zendeskURL("360051621873")})`;
  const confirmedDeliveryCarriers = `[${i`Confirmed delivery carriers`}](${"/documentation/confirmeddeliveryshippingcarriers"})`;
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.confirmedDeliveryContainer)}>
        <ConfirmedDeliveryIcon className={css(styles.checkmark)} />
        <div className={css(styles.confirmedDelivery)}>Confirmed Delivery</div>
      </div>

      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Your orders become eligible for payment ` +
          i`when Wish confirms delivery. ${learnMore}`
        }
      />
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Orders affected by the Confirmed Delivery Policy need to be ` +
          i`fulfilled with a qualified shipping carrier that provides ` +
          i`last mile tracking. ${confirmedDeliveryCarriers}`
        }
      />
    </div>
  );
};

export default observer(ConfirmedDeliveryTip);

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
          padding: "25px 20px",
        },
        confirmedDeliveryContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        confirmedDelivery: {
          fontWeight: fonts.weightBold,
        },
        paragraph: {
          marginTop: 25,
        },
        checkmark: {
          width: 25,
          marginRight: 10,
        },
      }),
    [surfaceLightest]
  );
};
