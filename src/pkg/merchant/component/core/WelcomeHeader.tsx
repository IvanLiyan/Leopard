import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import Color from "color";

import * as fonts from "@toolkit/fonts";
/* Lego Components */
import {
  Markdown,
  StaggeredFadeIn,
  H4Markdown,
  Breadcrumbs,
  BreadcrumbItem,
} from "@ContextLogic/lego";
import { IllustrationName } from "./Illustration";
import IllustrationOrRender from "./IllustrationOrRender";

import { css } from "@ContextLogic/lego/toolkit/styling";

import DeviceStore from "@stores/DeviceStore";
import { ThemeContext } from "@stores/ThemeStore";
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

@observer
class WelcomeHeader extends Component<WelcomeHeaderProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @computed
  get styles() {
    const DeviceStore = DeviceStore.instance();
    const {
      hideBorder,
      maxIllustrationWidth,
      maxIllustrationHeight,
      paddingX = DeviceStore.pageGuideX,
      paddingY = "20px",
    } = this.props;

    const { surfaceLightest, textBlack, pageBackground } = this.context;

    const borderColor = new Color(pageBackground).darken(0.05);
    return StyleSheet.create({
      root: {
        fontFamily: fonts.proxima,
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
        fontFamily: fonts.proxima,
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
  }

  renderActions() {
    const { actions } = this.props;
    return (
      actions && (
        <div className={css(this.styles.actionsContainer)}>{actions}</div>
      )
    );
  }

  renderBody() {
    const { body, openLinksInNewTabForMarkdown } = this.props;
    if (!body) {
      return null;
    }

    return typeof body === "function" ? (
      body()
    ) : (
      <Markdown
        className={css(this.styles.textBody)}
        text={body}
        openLinksInNewTab={openLinksInNewTabForMarkdown}
      />
    );
  }

  render() {
    const {
      title,
      illustration,
      children,
      className,
      style,
      animate = true,
      breadcrumbs,
    } = this.props;

    const DeviceStore = DeviceStore.instance();
    return (
      <StaggeredFadeIn
        className={css(this.styles.root, className, style)}
        deltaY={10}
        disabled={!animate}
      >
        <div className={css(this.styles.content)}>
          {breadcrumbs && (
            <Breadcrumbs
              className={css(this.styles.breadcrumbs)}
              items={breadcrumbs}
            />
          )}
          <div className={css(this.styles.row)}>
            {title && (
              <div className={css(this.styles.textContainer)}>
                {typeof title === "function" ? (
                  title()
                ) : (
                  <H4Markdown text={title} />
                )}
                {this.renderBody()}
              </div>
            )}
            {this.renderActions()}
          </div>
          {children}
        </div>
        {!DeviceStore.isSmallScreen && illustration != null && (
          <IllustrationOrRender
            className={css(this.styles.image)}
            value={illustration}
            alt="image of page header"
            animate={false}
          />
        )}
      </StaggeredFadeIn>
    );
  }
}

export default WelcomeHeader;
