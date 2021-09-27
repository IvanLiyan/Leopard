import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type SellingOnWishProps = BaseProps & {
  readonly insetX: number;
};

const SellingOnWish = (props: SellingOnWishProps) => {
  const { style, className } = props;
  const { dimenStore } = AppStore.instance();
  const styles = useStylesheet(props);

  return (
    <section
      className={css(
        dimenStore.isSmallScreen ? styles.rootSmallScreen : styles.root,
        className,
        style
      )}
    >
      <div className={css(styles.textContainer)}>
        <div className={css(styles.title)}>Selling on Wish</div>
        <div className={css(styles.description)}>
          <p>
            With offices around the globe from United States to Europe, Wish is
            one of the largest cross-border eCommerce marketplaces.
          </p>
          <p style={{ marginTop: 30 }}>
            For the last three years, Wish has been the most downloaded global
            shopping app*. Selling on Wish enables you to reach more than {100}+
            countries.
          </p>
          <i className={css(styles.source)}>
            * source: Sensor Tower, analysis of store intelligence platform
            data, November 2019
          </i>
        </div>
      </div>
      <Illustration
        className={css(styles.illustration)}
        name="globalPhoneLocations"
        animate={false}
        alt={i`Global reach`}
      />
    </section>
  );
};

export default observer(SellingOnWish);

const useStylesheet = (props: SellingOnWishProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          justifyContent: "space-between",
          backgroundColor: palettes.textColors.White,
          padding: `20px ${props.insetX}px`,
        },
        rootSmallScreen: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: palettes.textColors.White,
          padding: `20px ${props.insetX}px`,
        },
        illustration: {
          // eslint-disable-next-line local-rules/no-frozen-width
          height: 410,
          flexShrink: 0,
          "@media (min-width: 900px)": {
            marginRight: 50,
          },
        },
        textContainer: {
          display: "flex",
          flexDirection: "column",
          width: "50%",
          "@media (min-width: 900px)": {
            maxWidth: "50%",
            alignItems: "flex-start",
          },
          "@media (max-width: 900px)": {
            maxWidth: "100%",
            alignItems: "center",
          },
        },
        title: {
          fontSize: 31,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.2,
          color: palettes.textColors.Ink,
          marginBottom: 32,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
        },
        description: {
          fontSize: 21,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.4,
          color: palettes.textColors.DarkInk,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
        },
        source: {
          fontSize: 12,
        },
      }),
    [props.insetX]
  );
};
