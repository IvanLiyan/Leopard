import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Link from "@next-toolkit/Link";

const ProductUploadTip = (props: BaseProps) => {
  const styles = useStylesheet();

  return (
    <Tip color={palettes.coreColors.WishBlue} icon="tip">
      <div className={css(styles.bannerText)}>
        <div className={css(styles.tipText)}>
          <span>
            Did you know? Newly-uploaded product listings may receive free
            impressions. Add new products now to take advantage of the
            impression bonuses, expand your product offerings to customers
            worldwide, and grow your business.
          </span>
          <Link className={css(styles.link)} href="/products/csv" openInNewTab>
            Add new products
          </Link>
        </div>
      </div>
    </Tip>
  );
};

export default ProductUploadTip;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 4,
        },
        bannerText: {
          alignItems: "flex-start",
          color: palettes.textColors.Ink,
          display: "flex",
          flexDirection: "column",
          fontSize: 14,
          fontFamily: fonts.proxima,
        },
        tipText: {
          fontWeight: fonts.weightMedium,
        },
      }),
    []
  );
