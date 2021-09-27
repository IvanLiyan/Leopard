import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Card, Link, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as icons from "@assets/icons";
import * as illustrations from "@assets/illustrations";

/* SVGs */
import truck from "@assets/img/truck.svg";
import checklist from "@assets/img/checklist.svg";
import yellowAward from "@assets/img/yellow-award.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PolicyCardProps = BaseProps;

@observer
export default class FulfillmentPolicyCard extends Component<PolicyCardProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      topContainer: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 16,
        color: palettes.textColors.Ink,
      },
      heading: {
        color: palettes.textColors.Ink,
        fontSize: 24,
        lineHeight: "32px",
      },
      link: {
        fontSize: 16,
      },
      container: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        padding: "24px 40px 24px 24px",
        justifyContent: "space-between",
        color: palettes.textColors.Ink,
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
        ":not(:last-child)": {
          borderBottom: 0,
        },
      },
      subContainer: {
        display: "flex",
      },
      icon: {
        alignSelf: "flex-start",
      },
      textContainer: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 16,
        marginRight: 60,
        marginTop: 4,
      },
      title: {
        color: palettes.textColors.Ink,
        fontSize: 20,
        lineHeight: "28px",
      },
      bodyText: {
        color: palettes.textColors.DarkInk,
        fontSize: 16,
        lineHeight: "24px",
        marginTop: 4,
      },
      chevron: {
        alignSelf: "center",
        display: "flex",
      },
    });
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(className)}>
        <div className={css(this.styles.topContainer)}>
          <Text weight="bold" className={css(this.styles.heading)}>
            Learn about fulfillment & shipping
          </Text>
          <Link
            href="/policy/fulfillment"
            openInNewTab
            className={css(this.styles.link)}
          >
            View more Wish Policies
          </Link>
        </div>
        <Card>
          <Link href="/policy/fulfillment#5.5" openInNewTab>
            <div className={css(this.styles.container)}>
              <div className={css(this.styles.subContainer)}>
                <img
                  src={illustrations.lightBulb}
                  className={css(this.styles.icon)}
                />
                <div className={css(this.styles.textContainer)}>
                  <div className={css(this.styles.title)}>
                    Fulfill all orders
                  </div>
                  <Text weight="medium" className={css(this.styles.bodyText)}>
                    We need to receive fulfillment confirmation and tracking
                    number from the shipping carrier within 168 hours from when
                    the order was released.
                  </Text>
                </div>
              </div>
              <img
                src={icons.chevronRight}
                className={css(this.styles.chevron)}
                draggable={false}
              />
            </div>
          </Link>
          <Link href="/policy/wish_express" openInNewTab>
            <div className={css(this.styles.container)}>
              <div className={css(this.styles.subContainer)}>
                <img src={truck} className={css(this.styles.icon)} />
                <div className={css(this.styles.textContainer)}>
                  <div className={css(this.styles.title)}>
                    Wish Express orders
                  </div>
                  <div className={css(this.styles.bodyText)}>
                    Fulfill an order within 2 business days. Customers need to
                    receive the order within 5 - 7 business days.
                  </div>
                </div>
              </div>
              <img
                src={icons.chevronRight}
                className={css(this.styles.chevron)}
                draggable={false}
              />
            </div>
          </Link>
          <Link href="/policy/fulfillment#5.4" openInNewTab>
            <div className={css(this.styles.container)}>
              <div className={css(this.styles.subContainer)}>
                <img src={checklist} className={css(this.styles.icon)} />
                <div className={css(this.styles.textContainer)}>
                  <div className={css(this.styles.title)}>
                    Orders that qualify for Confirmed Delivery
                  </div>
                  <Text weight="medium" className={css(this.styles.bodyText)}>
                    Use one of our Confirmed Delivery carriers that provides
                    last mile tracking.
                  </Text>
                </div>
              </div>
              <img
                src={icons.chevronRight}
                className={css(this.styles.chevron)}
                draggable={false}
              />
            </div>
          </Link>
          <Link href="/policy/listing" openInNewTab>
            <div className={css(this.styles.container)}>
              <div className={css(this.styles.subContainer)}>
                <img src={yellowAward} className={css(this.styles.icon)} />
                <div className={css(this.styles.textContainer)}>
                  <div className={css(this.styles.title)}>
                    Upload top quality products
                  </div>
                  <Text weight="medium" className={css(this.styles.bodyText)}>
                    Upload top-quality products to gain more impressions.
                    Product listings that are inappropriate or listed without
                    proper brand authorization will be removed and may result in
                    fines and penalties.
                  </Text>
                </div>
              </div>
              <img
                src={icons.chevronRight}
                className={css(this.styles.chevron)}
                draggable={false}
              />
            </div>
          </Link>
        </Card>
      </div>
    );
  }
}
