import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SetUpShippingPriceTipProp = BaseProps & {
  readonly shippingPriceNumber: number;
  readonly buttonOnClick: () => unknown;
};

const SetUpShippingPriceTip = (props: SetUpShippingPriceTipProp) => {
  const styles = useStyleSheet();
  const { shippingPriceNumber, buttonOnClick } = props;
  const productsPhrase = ni18n(shippingPriceNumber, "Product", "Products");

  return (
    <Tip
      className={css(styles.alert)}
      color={palettes.coreColors.WishBlue}
      icon="tip"
    >
      <div className={css(styles.wrapper)}>
        <div className={css(styles.text)}>
          <Markdown
            text={
              i`Please set product shipping prices for **${shippingPriceNumber} **` +
              i` **${productsPhrase}** below, so that they are available for sale!`
            }
            className={css(styles.text)}
          />
        </div>
        <SecondaryButton
          text={i`View Details`}
          className={css(styles.button)}
          onClick={buttonOnClick}
        />
      </div>
    </Tip>
  );
};

export default observer(SetUpShippingPriceTip);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        },
        text: {
          fontSize: 14,
          color: palettes.textColors.Ink,
        },
        button: {
          minWidth: 160,
        },
        alert: {
          marginTop: 20,
          marginBottom: 10,
        },
        root: {},
      }),
    [],
  );
};
