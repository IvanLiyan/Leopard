import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const NonCNProductUploadTip = (props: BaseProps) => {
  const styles = useStylesheet();

  return (
    <Tip color={palettes.coreColors.WishBlue} icon="tip">
      <div className={css(styles.bannerText)}>
        <div className={css(styles.tipText)}>
          <span>
            Did you know? Your products are receiving additional free
            impressions now. Take advantage by stocking more inventory for your
            existing listings, and upload new and unique products to potentially
            further boost your impressions and related sales.
          </span>
          <Link className={css(styles.link)} href="/feed-upload" openInNewTab>
            Add new products
          </Link>
        </div>
      </div>
    </Tip>
  );
};

export default NonCNProductUploadTip;

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
