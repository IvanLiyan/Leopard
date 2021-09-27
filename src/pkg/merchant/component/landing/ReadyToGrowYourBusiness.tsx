import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Relative Imports */
import SignupButton from "./SignupButton";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type ReadyToGrowYourBusinessProps = BaseProps & {
  readonly insetX: number;
};

const ReadyToGrowYourBusiness = (props: ReadyToGrowYourBusinessProps) => {
  const { style, className } = props;
  const styles = useStylesheet(props);

  return (
    <section className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.title)}>Ready to grow your business?</div>
        <div className={css(styles.secondary)}>
          Get started today and get your first sales within days!
        </div>
      </div>
      <SignupButton
        className={css(styles.cta)}
        style={{ fontSize: 19, padding: "10px 80px" }}
      />
    </section>
  );
};

export default observer(ReadyToGrowYourBusiness);

const useStylesheet = (props: ReadyToGrowYourBusinessProps) => {
  const { dimenStore } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: dimenStore.isSmallScreen ? "column" : "row",
          justifyContent: !dimenStore.isSmallScreen
            ? "space-between"
            : undefined,
          backgroundColor: "rgba(47, 183, 236, 0.16)",
          padding: `60px ${props.insetX}px`,
        },
        titleContainer: {
          display: "flex",
          alignItems: dimenStore.isSmallScreen ? "center" : "flex-start",
          flexDirection: "column",
        },
        title: {
          color: palettes.coreColors.WishBlue,
          marginBottom: 16,
          fontSize: 25,
          lineHeight: 1.14,
          textAlign: dimenStore.isSmallScreen ? "center" : undefined,
        },
        secondary: {
          color: palettes.textColors.Ink,
          marginBottom: 32,
          fontSize: 25,
          lineHeight: 1.14,
          textAlign: dimenStore.isSmallScreen ? "center" : undefined,
        },
        cta: {
          marginLeft: !dimenStore.isSmallScreen ? 30 : undefined,
        },
      }),
    [dimenStore.isSmallScreen, props.insetX]
  );
};
