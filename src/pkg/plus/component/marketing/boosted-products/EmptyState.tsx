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
import { useTheme } from "@stores/ThemeStore";

export type EmptyStateProps = BaseProps;

const EmptyState: React.FC<EmptyStateProps> = (props: EmptyStateProps) => {
  const { className, style } = props;

  const styles = useStylesheet(props);

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      <Illustration
        name="rocketPurpleBackground"
        className={css(styles.illustration)}
        alt={i`No products have been boosted yet`}
      />
      <div className={css(styles.title)}>
        You have not boosted any products yet
      </div>
      <div className={css(styles.subtitle)}>
        Boost and put your products in front of the right customers.
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
          width: 150,
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
    [textBlack, textDark],
  );
};
