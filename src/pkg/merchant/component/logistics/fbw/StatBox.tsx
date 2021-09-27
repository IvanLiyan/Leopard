import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Info, Link, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type BaseProps = any;

export type StatBoxProps = BaseProps & {
  readonly value: any | null | undefined;
  readonly title: string;
  readonly footer?: string;
  readonly description?: string;
  readonly linkText?: string;
  readonly linkUrl?: string;
  readonly imgUrl: string;
};

@observer
class StatBox extends Component<StatBoxProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        position: "relative",
        backgroundColor: palettes.textColors.White,
        padding: 20,
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
        flexDirection: "row",
        display: "flex",
        alignItems: "flex-start",
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
        opacity: 0.5,
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
      info: {
        display: "flex",
        alignSelf: "flex-end",
        flexDirection: "column",
        marginLeft: "3px",
      },
    });
  }

  render() {
    const {
      title,
      value,
      footer,
      linkText,
      linkUrl,
      imgUrl,
      className,
      description,
    } = this.props;
    const { dimenStore } = AppStore.instance();
    return (
      <div className={css(this.styles.root)}>
        {!dimenStore.isSmallScreen && (
          <img
            className={css(this.styles.image)}
            src={imgUrl}
            draggable="false"
          />
        )}
        <div className={css(this.styles.contentText)}>
          <section className={css(this.styles.title)}>
            <div>{title}</div>
            {description && (
              <Info
                className={css(this.styles.info)}
                text={description}
                size={16}
                position="top center"
                sentiment="info"
              />
            )}
          </section>
          <Text weight="bold" className={css(this.styles.value, className)}>
            {value}
          </Text>
          <div className={css(this.styles.footer)}>{footer}</div>
          <Link href={linkUrl}>{linkText}</Link>
        </div>
      </div>
    );
  }
}

export default StatBox;
