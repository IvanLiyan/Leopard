import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import * as fonts from "@toolkit/fonts";

import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type EmptyStateProps = BaseProps;

const EmptyState: React.FC<EmptyStateProps> = (props: EmptyStateProps) => {
  const { className, style } = props;

  const styles = useStylesheet(props);

  return (
    <Card className={css(styles.root, className, style)}>
      <Illustration
        name="laptopPlantBoxesHomescreenWish"
        className={css(styles.illustration)}
        alt={i`No orders yet`}
      />
      <div className={css(styles.title)}>Orders will be here soon</div>
      <div className={css(styles.subtitle)}>
        We'll let you know when you have a new order to fulfill.
      </div>
    </Card>
  );
};

export default observer(EmptyState);

const useStylesheet = (props: EmptyStateProps) => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 50px",
          textAlign: "center",
        },
        illustration: {
          minWidth: 200,
        },
        title: {
          marginTop: 40,
          marginBottom: 20,
          fontSize: 20,
          color: textBlack,
          fontWeight: fonts.weightBold,
        },
        subtitle: {
          fontSize: 16,
          color: textDark,
          fontWeight: fonts.weightNormal,
        },
      }),
    [textBlack, textDark]
  );
};
