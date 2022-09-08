//
//  component/modal/ModalHeader.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 10/31/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import Icon from "@merchant/component/core/DEPRECATED_Icon";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "@next-toolkit/Image";

export type ModalHeaderProps = BaseProps & {
  readonly title?: string | (() => ReactNode);
  readonly icon?: string | null | undefined;
  readonly onClose?: () => unknown;
};

@observer
class ModalHeader extends Component<ModalHeaderProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "row",
        backgroundImage: "linear-gradient(to bottom, #eef2f5, #eef2f5)",
        padding: "12px 20px",

        // make the title text at the center of the modal
        position: "relative",
        left: 0,
        top: 0,
      },
      content: {
        backgroundColor: palettes.textColors.White,
      },
      icon: {
        marginRight: 10,
        height: 25,
      },
      title: {
        flex: 1,
        cursor: "default",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 19,
        lineHeight: "22px",
        userSelect: "none",
        fontWeight: fonts.weightSemibold,
        fontStyle: "normal",
        fontStretch: "normal",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: 10,
        paddingRight: 10,
        color: palettes.textColors.Ink,
      },
      closeContainer: {
        cursor: "pointer",
        fill: palettes.textColors.Ink,
        opacity: 0.5,
        right: 20,
        top: 0,
        bottom: 0,
        display: "flex",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        ":hover": {
          opacity: 1,
        },
      },
    });
  }

  render() {
    const { title, icon, onClose, className, style } = this.props;
    if (!title) {
      return null;
    }

    return (
      <div className={css(this.styles.root, className, style)}>
        <div className={css(this.styles.title)}>
          {icon && (
            <NextImage
              src={icon}
              className={css(this.styles.icon)}
              alt="icon"
            />
          )}
          {typeof title === "string" ? title : title()}
        </div>
        <div className={css(this.styles.closeContainer)} onClick={onClose}>
          <Icon name="closeIcon" style={{ height: "40%" }} />
        </div>
      </div>
    );
  }
}

export default ModalHeader;
