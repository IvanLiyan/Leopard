import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Legacy */
import { zendeskURL } from "@legacy/core/url";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

/* SVGs */
import dollarBag from "@assets/img/dollar_bag.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WECashBackLabelDetailsProps = BaseProps;

@observer
class WECashBackLabelDetails extends Component<WECashBackLabelDetailsProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        fontSize: 13,
        display: "flex",
        cursor: "default",
        alignItems: "stretch",
        flexDirection: "column",
        borderRadius: 3,
        // eslint-disable-next-line local-rules/validate-root
        minWidth: 300,
        backgroundColor: palettes.textColors.White,
      },

      section: {
        padding: 15,
        lineHeight: 1.5,
        borderBottom: "solid 1px #eeefef",
        backgroundColor: palettes.textColors.White,
        ":last-child": {
          borderBottom: "none",
        },
      },
    });
  }

  render() {
    const { className } = this.props;

    let periodText: string | null = null;
    periodText =
      i`Applies to orders placed between February 1, 2021 ` +
      i`- March 1, 2021`;

    return (
      <div className={css(className)}>
        <div className={css(this.styles.root)}>
          <section className={css(this.styles.section)}>
            You will receive 5% cash back for non-refunded Secondary Warehouse
            orders delivered before the delivery deadline.
          </section>
          <section className={css(this.styles.section)}>{periodText}</section>
          <section
            className={css(this.styles.section)}
            style={{ textAlign: "center" }}
          >
            <Link openInNewTab href={zendeskURL("231885188")}>
              Learn more here.
            </Link>
          </section>
        </div>
      </div>
    );
  }
}

export type WECashBackLabelProps = BaseProps & {
  readonly cashBack?: string | null | undefined;
};

@observer
export default class WECashBackLabel extends Component<WECashBackLabelProps> {
  static demoProps: WECashBackLabelProps = {
    cashBack: "$250",
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
      },
      label: {
        display: "flex",
        cursor: "default",
        userSelect: "none",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 4,
        padding: "3px 7px",
        backgroundColor: palettes.greens.CashGreen,
        border: "solid 1px #5fa906",
        whiteSpace: "nowrap",
      },
      icon: {
        height: 15,
        marginRight: 5,
      },
      text: {
        color: "white",
      },
      amount: {
        color: "white",
      },
    });
  }

  render() {
    const { cashBack, className } = this.props;

    return (
      <Popover
        className={css(this.styles.root, className)}
        popoverContent={() => <WECashBackLabelDetails />}
        position="right top"
      >
        <div className={css(this.styles.label)}>
          <img
            className={css(this.styles.icon)}
            src={dollarBag}
            alt="dollar bag"
          />
          <section className={css(this.styles.text)}>
            {i`Cash Back` + ": "}
          </section>

          <Text weight="bold" className={css(this.styles.amount)}>
            {cashBack}
          </Text>
        </div>
      </Popover>
    );
  }
}
