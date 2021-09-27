import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes, white } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { settingsAppStoreBanner } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ClientSettingsAppStoreBannerProps = BaseProps;

const ClientSettingsAppStoreBanner = ({
  className,
  style,
}: ClientSettingsAppStoreBannerProps) => {
  const styles = useStylesheet();
  const url = "/merchant_apps";

  // TODO: Remove after Dec 3rd 2020
  // Keep original string so translation is not removed in pre-freeze branch
  const existingString = i`Discover new apps on the`;
  void existingString;

  return (
    <div className={css(styles.root, className, style)}>
      <Link href={url} className={css(styles.illustration)}>
        <div className={css(styles.overlay)}>
          <div className={css(styles.overlayTitle)}>Discover new apps!</div>
          <div className={css(styles.overlayStandoutTitle)}>Wish App Store</div>
        </div>
      </Link>
    </div>
  );
};

export default ClientSettingsAppStoreBanner;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          height: 160,
        },
        illustration: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          backgroundImage: `url(${settingsAppStoreBanner})`,
          borderRadius: 4,
        },
        overlay: {
          padding: 24,
          backgroundColor: "rgba(21, 41, 52, 0.7)",
          boxShadow: "0 2px 10px 0 rgba(99, 99, 99, 0.1)",
          maxWidth: 220,
          borderRadius: 4,
        },
        overlayTitle: {
          color: white,
          lineHeight: 1.4,
          fontSize: 20,
          marginBottom: 4,
        },
        overlayStandoutTitle: {
          display: "inline-block",
          color: white,
          lineHeight: 1.4,
          fontSize: 20,
          fontWeight: fonts.weightBold,
          backgroundColor: palettes.cyans.Cyan,
          padding: "1px 6px",
          borderRadius: 2,
        },
      }),
    []
  );
