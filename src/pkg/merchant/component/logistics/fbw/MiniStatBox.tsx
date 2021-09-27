import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

type BaseProps = any;

export type MiniStatBoxProps = BaseProps & {
  readonly value: string | null | undefined;
  readonly title: string;
  readonly description?: string;
};

@observer
class MiniStatBox extends Component<MiniStatBoxProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        backgroundColor: palettes.textColors.White,
        display: "flex",
        flexDirection: "row",
      },
      title: {
        fontSize: 17,
        cursor: "default",
        userSelect: "none",
        color: palettes.textColors.Ink,
        opacity: 0.5,
      },
      value: {
        fontSize: 37,
        cursor: "default",
        margin: "30px 0px",
        userSelect: "none",
      },
      footer: {
        fontSize: 17,
        cursor: "default",
        userSelect: "none",
        color: palettes.textColors.Ink,
      },
      content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      },
      contentInner: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 5,
      },
      target: {
        alignSelf: "flex-end",
        fontSize: 13,
      },
      image: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        transform: "translateZ(0)",
        maxWidth: "25%",
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
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.contentText)}>
          <Text weight="bold" className={css(this.styles.value)}>
            {value}
          </Text>
          <section className={css(this.styles.title)}>{title}</section>
        </div>
      </div>
    );
  }
}

export default MiniStatBox;
