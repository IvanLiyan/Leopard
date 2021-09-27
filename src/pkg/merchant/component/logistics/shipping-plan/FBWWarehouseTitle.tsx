import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBWWarehouseTitleProps = BaseProps & {
  readonly value: any | null | undefined;
  readonly title: string;
  readonly imgUrl: string;
  readonly titlePadding: string | null | undefined;
};

@observer
class FBWWarehouseTitle extends Component<FBWWarehouseTitleProps> {
  @computed
  get styles() {
    const { titlePadding } = this.props;
    return StyleSheet.create({
      root: {
        position: "relative",
        backgroundColor: palettes.textColors.White,
        padding: titlePadding ? titlePadding : 20,
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      title: {
        fontSize: 17,
        cursor: "default",
        userSelect: "none",
        color: palettes.textColors.Ink,
        opacity: 0.5,
      },
      value: {
        fontSize: 30,
        fontWeight: fonts.weightBold,
        cursor: "default",
        margin: "10px 0px",
        userSelect: "none",
      },
      image: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        transform: "translateZ(0)",
        maxWidth: "50%",
        flexShrink: 2,
      },
      contentText: {
        display: "flex",
        flexDirection: "column",
        margin: "0px 0px 0px 10px",
      },
    });
  }

  render() {
    const { title, value, className } = this.props;
    const { dimenStore } = AppStore.instance();
    return (
      <div className={css(this.styles.root)}>
        {!dimenStore.isSmallScreen && (
          <Illustration name="warehouse" alt="warehouse" />
        )}
        <div className={css(this.styles.contentText)}>
          <section className={css(this.styles.title)}>{title}</section>
          <div className={css(this.styles.value, className)}>{value}</div>
        </div>
      </div>
    );
  }
}

export default FBWWarehouseTitle;
