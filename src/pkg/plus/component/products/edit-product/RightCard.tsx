import React, { useMemo, ReactNode } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Markdown, Info } from "@ContextLogic/lego";
import { InfoProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type RightCardProps = BaseProps & {
  readonly title?: string;
  readonly description?: InfoProps["popoverContent"];
  readonly titleRight?: () => ReactNode;
  readonly isOptional?: boolean;
  readonly contentContainerStyle?: CSSProperties | string;
  readonly hasInvalidData?: boolean;
};

const RightCard = (props: RightCardProps) => {
  const {
    className,
    style,
    title,
    description,
    children,
    titleRight,
    isOptional,
    hasInvalidData,
    contentContainerStyle,
  } = props;

  const styles = useStylesheet(props);

  return (
    <Card className={css(className, style)} style={{ boxShadow: "none" }}>
      <div
        className={css(styles.root, hasInvalidData ? styles.invalidData : null)}
      >
        {title && (
          <div className={css(styles.titleContainer)}>
            <Markdown
              className={css(styles.title)}
              text={isOptional ? i`**${title}** (optional)` : `**${title}**`}
            />
            {description && (
              <Info
                className={css(styles.info)}
                popoverContent={description}
                size={14}
                position={"top center"}
              />
            )}
            <div className={css(styles.titleRight)}>
              {titleRight && titleRight()}
            </div>
          </div>
        )}
        {children && (
          <div className={css(contentContainerStyle)}>{children}</div>
        )}
      </div>
    </Card>
  );
};

export default observer(RightCard);

const useStylesheet = ({ title, children }: RightCardProps) => {
  const { negative, surfaceLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 15,
          backgroundColor: surfaceLight,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        title: {
          color: textBlack,
          fontSize: 15,
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: title && children ? 10 : undefined,
        },
        info: {
          marginLeft: 8,
          alightSelf: "stretch",
        },
        titleRight: {
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
        },
        invalidData: {
          border: `1px solid ${negative}`,
        },
      }),
    [title, children, negative, surfaceLight, textBlack],
  );
};
