import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Lego Components */
import Illustration from "@merchant/component/core/Illustration";
import { IllustrationName } from "@merchant/component/core/Illustration";
import { Text } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "next/image";

export type PromotionCardBannerProps = BaseProps & {
  readonly logoSource?: string | null | undefined;
  readonly title: string | null | undefined;
  readonly subtitle: string | null | undefined;
  readonly defaultIllustration?: IllustrationName;
  readonly logoBackground?: string;
};

export default observer((props: PromotionCardBannerProps) => {
  const {
    className,
    style,
    logoSource,
    title,
    subtitle,
    defaultIllustration,
    logoBackground,
  } = props;
  const styles = useStylesheet(logoBackground);
  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.imgContainer)}>
        {logoSource ? (
          <NextImage className={css(styles.illustration)} src={logoSource} />
        ) : (
          defaultIllustration && (
            <Illustration
              name={defaultIllustration}
              className={css(styles.illustration)}
              alt={`Default image`}
            />
          )
        )}
      </div>
      <div className={css(styles.bannerTextWrapper)}>
        <Text weight="bold" className={css(styles.bannerTextTitle)}>
          {title}
        </Text>
        <Text weight="regular" className={css(styles.bannerTextSubTitle)}>
          {subtitle}
        </Text>
      </div>
    </div>
  );
});

const useStylesheet = (
  logoBackground: PromotionCardBannerProps["logoBackground"]
) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          minHeight: 56,
          backgroundColor: palettes.coreColors.DarkerWishBlue,
          display: "flex",
          padding: 24,
          borderRadius: "4px 4px 0 0",
          alignItems: "center",
        },
        imgContainer: {
          display: "flex",
          backgroundColor: logoBackground ? logoBackground : "inherit",
          height: 56,
          width: 56,
          minWidth: 56,
          justifyContent: "center",
          borderRadius: 4,
        },
        illustration: {
          alignSelf: "center",
          maxWidth: "100%",
          maxHeight: "100%",
        },
        bannerTextWrapper: {
          display: "flex",
          color: palettes.textColors.White,
          flexDirection: "column",
          marginLeft: 16,
          maxHeight: "100%",
        },
        bannerTextTitle: {
          fontSize: 20,
          lineHeight: 1.4,
        },
        bannerTextSubTitle: {
          fontSize: 16,
          lineHeight: 1.1,
        },
      }),
    [logoBackground]
  );
};
