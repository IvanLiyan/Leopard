import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import Color from "color";

import * as fonts from "@core/toolkit/fonts";
/* Lego Components */
import {
  Markdown,
  StaggeredFadeIn,
  H4Markdown,
  Breadcrumbs,
  BreadcrumbItem,
} from "@ContextLogic/lego";
import { IllustrationName } from "@core/components/Illustration";
import IllustrationOrRender from "./IllustrationOrRender";

import { css } from "@ContextLogic/lego/toolkit/styling";

import { useDeviceStore } from "@core/stores/DeviceStore";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WelcomeHeaderProps = BaseProps & {
  readonly title?: string | (() => ReactNode);
  readonly body?: string | (() => ReactNode);
  readonly actions?: ReactNode;
  readonly breadcrumbs?: ReadonlyArray<BreadcrumbItem>;
  readonly maxIllustrationWidth?: number | string;
  readonly maxIllustrationHeight?: number | string;
  readonly illustration?:
    | (IllustrationName | (() => ReactNode))
    | null
    | undefined;
  readonly paddingX?: string | number;
  readonly paddingY?: string;
  readonly hideBorder?: boolean;
  readonly animate?: boolean;
  readonly openLinksInNewTabForMarkdown?: boolean;
};

const WelcomeHeader: React.FC<WelcomeHeaderProps> = (props) => {
  const styles = useStylesheet(props);
  const {
    actions: actionsProp,
    body: bodyProp,
    openLinksInNewTabForMarkdown,
    title,
    illustration,
    children,
    className,
    style,
    animate = true,
    breadcrumbs,
  } = props;
  const { isSmallScreen } = useDeviceStore();

  const actions = actionsProp && (
    <div className={css(styles.actionsContainer)}>{actionsProp}</div>
  );

  let body = null;
  if (bodyProp) {
    body =
      typeof bodyProp === "function" ? (
        bodyProp()
      ) : (
        <Markdown
          className={css(styles.textBody)}
          text={bodyProp}
          openLinksInNewTab={openLinksInNewTabForMarkdown}
        />
      );
  }

  return (
    <StaggeredFadeIn
      className={css(styles.root, className, style)}
      deltaY={10}
      disabled={!animate}
    >
      <div className={css(styles.content)}>
        {breadcrumbs && (
          <Breadcrumbs
            className={css(styles.breadcrumbs)}
            items={breadcrumbs}
          />
        )}
        <div className={css(styles.row)}>
          {title && (
            <div className={css(styles.textContainer)}>
              {typeof title === "function" ? (
                title()
              ) : (
                <H4Markdown text={title} />
              )}
              {body && (
                <>
                  <div style={{ marginTop: "8px" }} />
                  {body}
                </>
              )}
            </div>
          )}
          {actions}
        </div>
        {children}
      </div>
      {!isSmallScreen && illustration != null && (
        <IllustrationOrRender
          className={css(styles.image)}
          value={illustration}
          alt="image of page header"
          animate={false}
        />
      )}
    </StaggeredFadeIn>
  );
};

export default observer(WelcomeHeader);

const useStylesheet = ({
  hideBorder,
  maxIllustrationWidth,
  maxIllustrationHeight,
  paddingX: paddingXProp,
  paddingY = "20px",
}: WelcomeHeaderProps) => {
  const { pageGuideX } = useDeviceStore();
  const { surfaceLightest, textBlack, pageBackground } = useTheme();
  const paddingX =
    typeof paddingXProp === "undefined" ? pageGuideX : paddingXProp;
  const borderColor = new Color(pageBackground).darken(0.05);

  return useMemo(() => {
    return StyleSheet.create({
      root: {
        fontFamily: fonts.ginto,
        display: "flex",
        WebkitFlexShrink: 0,
        WebkitFlexBasis: "auto",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: `${paddingY} ${paddingX}`,
        backgroundColor: surfaceLightest,
        borderBottom: !hideBorder ? `1px solid ${borderColor}` : undefined,
      },
      content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
      },
      textContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        transform: "translateZ(0)",
      },
      row: {
        display: "flex",
        "@media (max-width: 900px)": {
          flexDirection: "column",
        },
        "@media (min-width: 900px)": {
          flexDirection: "row",
          justifyContent: "space-between",
        },
      },
      image: {
        display: "flex",
        transform: "translateZ(0)",
        maxWidth: maxIllustrationWidth || "18%",
        maxHeight: maxIllustrationHeight || undefined,
        flexShrink: 2,
        marginLeft: 80,
      },
      textBody: {
        fontSize: 20,
        lineHeight: 1.4,
        color: textBlack,
        fontFamily: fonts.ginto,
        marginTop: 20,
      },
      imageContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      },
      actionsContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        "@media (max-width: 900px)": {
          marginTop: 15,
        },
        ":nth-child(1n) > *": {
          ":not(:first-child)": {
            paddingLeft: 12,
          },
        },
      },
      breadcrumbs: {
        margin: "10px 0px",
      },
    });
  }, [
    hideBorder,
    maxIllustrationWidth,
    maxIllustrationHeight,
    paddingX,
    paddingY,
    surfaceLightest,
    textBlack,
    borderColor,
  ]);
};
