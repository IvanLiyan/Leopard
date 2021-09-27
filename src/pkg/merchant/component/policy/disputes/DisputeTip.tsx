import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type DisputeTipProps = BaseProps & {
  readonly text: string;
  readonly link: {
    readonly title: string;
    readonly href: string;
  };
};

@observer
class DisputeTip extends Component<DisputeTipProps> {
  static demoProps: DisputeTipProps = {
    text: "hello world",
    link: {
      title: "view details",
      href: "#",
    },
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        userSelect: "none",
      },
      row: {
        color: palettes.textColors.Ink,
        opacity: 0.99,
        fontSize: 12,
        lineHeight: 1.5,
        margin: 0,
        padding: 0,
        maxWidth: 900,
      },
    });
  }

  render() {
    const { text, link, className } = this.props;

    return (
      <Tip
        className={css(this.styles.root, className)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        <div className={css(this.styles.root)}>
          <p className={css(this.styles.row)}>{text}</p>
          {link && (
            <Link href={link.href} openInNewTab>
              {link.title}
            </Link>
          )}
        </div>
      </Tip>
    );
  }
}
export default DisputeTip;
