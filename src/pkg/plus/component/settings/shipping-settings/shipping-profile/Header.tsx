/*
 *
 * Header.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/25/2020
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
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {};

const Header: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className } = props;

  const link = zendeskURL("360050728594");
  return (
    <section className={css(styles.root, style, className)}>
      <div className={css(styles.topSection)}>
        <div className={css(styles.left)}>
          <div className={css(styles.title)}>Shipping profiles</div>
          <Markdown
            className={css(styles.description)}
            text={
              i`You can re-use shipping profiles for multiple product listings. ` +
              i`Once products are linked to a shipping profile, any changes ` +
              i`to the profile will update shipping for all linked products. ` +
              i`[Learn more](${link})`
            }
          />
        </div>
        <Illustration
          name="yellowTruckBoxesInside"
          alt={i`Configure your shipping destinations`}
          className={css(styles.illustration)}
        />
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
          padding: 20,
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
      }),
    [textBlack, textDark]
  );
};

export default observer(Header);
