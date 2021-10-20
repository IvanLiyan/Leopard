/*
 *
 * Header.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/27/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly enabledCountryCount: number;
};

const Header: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, enabledCountryCount } = props;

  const link = `[${i`Learn more`}](${zendeskURL("360050728594")})`;
  return (
    <section className={css(styles.root, style, className)}>
      <div className={css(styles.topSection)}>
        <div className={css(styles.left)}>
          <div className={css(styles.title)}>Shipping destinations</div>
          <Markdown
            className={css(styles.description)}
            text={
              i`Reach new customers and grow your business by selling and shipping ` +
              i`internationally. Choose where you would like to ship your products ` +
              i`below. Enabling a country or region will allow customers in that ` +
              i`country or region to view all your product listings. ${link} `
            }
          />
        </div>
        <Illustration
          name="yellowTruckBoxesInside"
          alt={i`Configure your shipping destinations`}
          className={css(styles.illustration)}
        />
      </div>
      <div className={css(styles.enabledCountriesContainer)}>
        <div className={css(styles.enabledCountries)}>Enabled countries</div>
        {enabledCountryCount}
      </div>
    </section>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "10px 20px",
        },
        topSection: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        left: {
          display: "flex",
          flexDirection: "column",
          "@media (min-width: 900px)": {
            maxWidth: "60%",
          },
        },
        illustration: {
          "@media (max-width: 900px)": {
            display: "none",
          },
          "@media (min-width: 900px)": {
            width: 350,
            marginLeft: 20,
          },
        },
        title: {
          fontSize: 22,
          fontWeight: fonts.weightBold,
          marginBottom: 15,
          color: textBlack,
        },
        description: {
          fontSize: 16,
          color: textDark,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
        },
        enabledCountries: {
          fontWeight: fonts.weightBold,
          marginRight: 20,
          color: textBlack,
        },
        enabledCountriesContainer: {
          margin: "15px 0px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 17,
        },
      }),
    [textBlack, textDark],
  );
};

export default observer(Header);
