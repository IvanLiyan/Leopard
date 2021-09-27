import React, { Component } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type InfoRowProps = BaseProps & {
  readonly title: string;
  readonly titleWidth?: number;
  readonly spaceAfterTitle?: number;
  readonly verticalAlign?: "top" | "center" | "bottom";
};

@observer
class InfoRow extends Component<InfoRowProps> {
  @computed
  get styles() {
    const { titleWidth, spaceAfterTitle, verticalAlign } = this.props;
    const { dimenStore } = AppStore.instance();
    let flexAlignItems: CSSProperties["alignItems"] = "flex-start";
    if (verticalAlign == "center") {
      flexAlignItems = "center";
    } else if (verticalAlign == "bottom") {
      flexAlignItems = "flex-end";
    }

    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: flexAlignItems,
      },
      title: {
        width: titleWidth || 300,
        textAlign: "left",
        fontSize: 14,
        fontWeight: fonts.weightMedium,
      },
      content: {
        flex: 1,
        fontSize: 14,
        marginLeft: spaceAfterTitle || (dimenStore.isSmallScreen ? 0 : 40),
        display: "flex",
      },
    });
  }

  render() {
    const { children, style, title } = this.props;
    return (
      <div className={css(this.styles.root, style)}>
        <div className={css(this.styles.title)}>{title}</div>
        <div className={css(this.styles.content)}>{children}</div>
      </div>
    );
  }
}

export default InfoRow;
