import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { SecondaryButton as Button } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { IllustrationName } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type StoreIdBoxProps = BaseProps & {
  readonly topBannerText?: string | null | undefined;
  readonly illustrationName: IllustrationName;
  readonly title: string;
  readonly subtitle: string;
  readonly onConnect: () => unknown;
};

const StoreIdBox = (props: StoreIdBoxProps) => {
  const {
    className,
    style,
    topBannerText,
    illustrationName,
    title,
    subtitle,
    onConnect,
  } = props;

  const styles = useStylesheet();

  const rootCSS = css(styles.root, style, className);
  return (
    <Card className={rootCSS}>
      <div className={css(styles.content)}>
        {topBannerText && (
          <div className={css(styles.topBanner)}>
            <Markdown text={topBannerText} />
          </div>
        )}
        <div className={css(styles.mainContent)}>
          <Illustration
            name={illustrationName}
            alt={illustrationName}
            className={css(styles.icon)}
          />
          <Text weight="bold" className={css(styles.title)}>
            {title}
          </Text>
          <div className={css(styles.subtitle)}>{subtitle}</div>
          <div className={css(styles.buttonContainer)}>
            <Button
              text={i`Connect`}
              onClick={onConnect}
              className={css(styles.button)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StoreIdBox;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 0,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        topBanner: {
          padding: 16,
          fontSize: 14,
          alignSelf: "stretch",
          color: palettes.textColors.White,
          backgroundColor: palettes.coreColors.DarkerWishBlue,
        },
        mainContent: {
          padding: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
        },
        icon: {
          maxWidth: 64,
          maxHeight: 64,
        },
        title: {
          marginTop: 20,
          fontSize: 24,
          lineHeight: 1.5,
          color: palettes.textColors.Ink,
        },
        subtitle: {
          marginTop: 8,
          fontSize: 16,
          lineHeight: 1.5,
          color: palettes.textColors.Ink,
        },
        buttonContainer: {
          marginTop: 40,
        },
        button: {
          fontSize: 16,
        },
      }),
    []
  );
};
