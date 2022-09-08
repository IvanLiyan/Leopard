//
//  src/SheetItem.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 10/31/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { CopyButton, Info, Text, TextProps } from "@ContextLogic/lego";
import StringOrRender from "@ContextLogic/lego/component/helper/StringOrRender";

/* Lego Toolkit */
import { css, Style } from "@toolkit/styling";

import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import DeviceStore from "@stores/DeviceStore";

export type SheetItemProps = BaseProps & {
  readonly title: string | (() => ReactNode);
  readonly titleWidth?: string | number;
  readonly freezeTitleWidth?: boolean;
  readonly titleFontSize?: string | number;
  readonly titleFontWeight?: TextProps["weight"];
  readonly valueMinWidth?: string | number;
  readonly value?: string | (() => ReactNode);
  readonly popoverContent?: (string | null | undefined) | (() => ReactNode);
  readonly copy?: string | undefined;
  readonly contentStyles?: Style | undefined;
};

@observer
class SheetItem extends Component<SheetItemProps> {
  @computed
  get styles() {
    const { titleWidth, titleFontSize, valueMinWidth, freezeTitleWidth } =
      this.props;
    const defaultTitleWidth = 210;

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      title: {
        color: palettes.textColors.Ink,
        fontSize: titleFontSize || 16,
        lineHeight: 1.5,
        "* > div": {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
      titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        ...(freezeTitleWidth
          ? {
              flex: `0 0 ${titleWidth || defaultTitleWidth}px`,
            }
          : { width: titleWidth || defaultTitleWidth }),
      },
      info: {
        marginLeft: 7,
      },
      copyButton: {
        flex: 1,
      },
      value: {
        fontSize: 14,
        lineHeight: 1.43,
        minWidth: valueMinWidth || 150,
        color: palettes.textColors.Ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      },
      valueInCopy: {
        whiteSpace: "normal",
        flex: 1,
      },
    });
  }

  renderValue() {
    const { value, children } = this.props;

    if (React.Children.toArray(children).length > 0) {
      return children;
    }

    return <StringOrRender value={value} />;
  }

  renderTitle() {
    const { title, titleFontWeight = "semibold" } = this.props;

    return typeof title === "function" ? (
      <div className={css(this.styles.title)}>{title()}</div>
    ) : (
      <Text className={css(this.styles.title)} weight={titleFontWeight}>
        {title}
      </Text>
    );
  }

  render() {
    const { className, style, popoverContent, copy, contentStyles } =
      this.props;

    const { isSmallScreen } = DeviceStore.instance();
    return (
      <div className={css(this.styles.root, className, style)}>
        <div className={css(this.styles.titleContainer)}>
          {this.renderTitle()}
          {!isSmallScreen && popoverContent && (
            <Info
              position="top center"
              popoverMaxWidth={250}
              popoverContent={popoverContent}
              className={css(this.styles.info)}
            />
          )}
        </div>

        {copy != null ? (
          <CopyButton
            text={copy}
            showFull={false}
            className={css(this.styles.copyButton)}
          >
            <div className={css(this.styles.value, this.styles.valueInCopy)}>
              {this.renderValue()}
            </div>
          </CopyButton>
        ) : (
          <div className={css(this.styles.value, contentStyles)}>
            {this.renderValue()}
          </div>
        )}
      </div>
    );
  }
}

export default SheetItem;
