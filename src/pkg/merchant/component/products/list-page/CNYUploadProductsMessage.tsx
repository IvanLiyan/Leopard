/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* SVGs */
import boxesIcon from "@assets/img/boxes_ill.svg";
import uploadIcon from "@assets/img/upload_products_ill.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const CNYUploadProductsMessage: React.FC<BaseProps> = (props: BaseProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.leftItem)}>
        <img src={boxesIcon} />
      </div>
      <div className={css(styles.centerItem)}>
        <div className={css(styles.title)}>
          Get bonus impressions by adding new products!
        </div>
        <div className={css(styles.bottomText)}>
          Take advantage of your current additional free impressions now. Upload
          new products and stock up on inventory for an opportunity to boost
          your impressions further!
        </div>
      </div>
      <div className={css(styles.rightItem)}>
        <img src={uploadIcon} />
      </div>
    </div>
  );
};

export default CNYUploadProductsMessage;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        leftItem: {
          display: "flex",
          margin: "0px 70px",
        },
        centerItem: {
          display: "flex",
          flexDirection: "column",
        },
        rightItem: {
          display: "flex",
          margin: "0px 70px",
          marginTop: 11,
        },
        root: {
          flexDirection: "row",
          minHeight: 130,
          display: "flex",
          alignItems: "center",
          borderRadius: 10,
          backgroundImage: "linear-gradient(#5685f1, #1d4bea)",
        },
        title: {
          fontFamily: fonts.proxima,
          fontSize: 32,
          fontWeight: fonts.weightBold,
          lineHeight: 1.5,
          letterSpacing: "normal",
          display: "flex",
          flexDirection: "row",
          color: palettes.textColors.White,
        },
        bottomText: {
          color: palettes.textColors.White,
          fontSize: 16,
          display: "flex",
          flexDirection: "row",
          fontFamily: fonts.proxima,
        },
      }),
    [],
  );
