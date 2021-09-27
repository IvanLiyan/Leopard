import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ClientSettingsSectionProps = BaseProps & {
  readonly title: string;
  readonly isPrivate?: boolean;
};

const ClientSettingsSection = ({
  title,
  children,
  className,
  isPrivate = false,
  style,
}: ClientSettingsSectionProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(className, styles.root, style)}>
      <div className={css(styles.rootContent)}>
        <div className={css(styles.titleWrapper)}>
          <div className={css(styles.title)}>{title}</div>
          {isPrivate && (
            <Link
              openInNewTab
              href="/partner-developer"
              className={css(styles.promotionAction)}
            >
              Learn more about creating an app.
            </Link>
          )}
        </div>
        <div className={css(styles.sectionContent)}>
          <div className={css(styles.sectionBackground)}>
            <div className={css(styles.content)}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSettingsSection;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        rootContent: {
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        titleWrapper: {
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          marginBottom: 20,
        },
        title: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          lineHeight: 1.4,
        },
        sectionContent: {
          width: "100%",
        },
        sectionBackground: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          backgroundColor: palettes.greyScaleColors.LighterGrey,
          borderRadius: "4px",
          padding: "24px",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        promotionAction: {
          fontSize: 14,
        },
      }),
    []
  );
};
