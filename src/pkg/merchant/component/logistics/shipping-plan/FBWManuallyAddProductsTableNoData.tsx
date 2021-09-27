import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWManuallyAddProductsTableNoDataProps = BaseProps & {
  readonly onClick: () => Promise<unknown>;
};

const FBWManuallyAddProductsTableNoData = (
  props: FBWManuallyAddProductsTableNoDataProps
) => {
  const styles = useStylesheet();
  const { onClick } = props;

  return (
    <Card className={css(styles.card)}>
      <div className={css(styles.add)}>
        <div className={css(styles.text)}>
          Select products to add to your shipping plan.
        </div>
        <div className={css(styles.actBtn)}>
          <PrimaryButton className={css(styles.btn)} onClick={onClick}>
            Add products
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
};

export default FBWManuallyAddProductsTableNoData;

const useStylesheet = () =>
  StyleSheet.create({
    card: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
    },
    add: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 48,
      marginBottom: 48,
    },
    text: {
      fontSize: 16,
      lineHeight: 1.5,
      color: palettes.textColors.Ink,
      fontWeight: fonts.weightNormal,
      fontFamily: fonts.proxima,
    },
    btn: {
      fontSize: 14,
    },
    actBtn: {
      marginTop: 8,
    },
  });
