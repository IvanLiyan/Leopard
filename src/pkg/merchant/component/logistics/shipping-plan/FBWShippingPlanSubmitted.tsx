import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Banner, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBWShippingPrice from "@merchant/component/logistics/shipping-plan/FBWShippingPrice";
import FBWInstruction from "@merchant/component/logistics/shipping-plan/FBWInstruction";
import FBWShippingPlanDetail from "@merchant/component/logistics/shipping-plan/FBWShippingPlanDetail";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { ShippingPlan } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWShippingPlanSubmittedProps = BaseProps & {
  readonly shippingPlans: ReadonlyArray<ShippingPlan>;
};

@observer
class FBWShippingPlanSubmitted extends Component<
  FBWShippingPlanSubmittedProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
        paddingTop: "30px",
        paddingBottom: "30px",
        paddingLeft: this.pageX,
        paddingRight: this.pageX,
      },
      title: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        transition: "opacity 0.3s linear",
        ":hover": {
          opacity: 0.8,
        },
        marginBottom: 25,
      },
      sectionTitle: {
        color: palettes.textColors.Ink,
        fontSize: 24,
      },
    });
  }

  @computed
  get pageX(): string | number {
    const { dimenStore } = AppStore.instance();
    return dimenStore.pageGuideX;
  }

  render() {
    const { className, shippingPlans } = this.props;
    if (!shippingPlans || shippingPlans.length === 0) {
      return null;
    }
    const isFBS = shippingPlans[0].shipment_type == 2; // "FBS"
    return (
      <>
        <Banner
          className={css(className)}
          text={
            isFBS
              ? i`Your FBS shipping plan is created successfully!`
              : i`Your FBW shipping plan is created successfully!`
          }
          sentiment="success"
        />
        <div className={css(this.styles.root)}>
          <div className={css(this.styles.title)}>
            {isFBS && (
              <Text className={css(this.styles.sectionTitle)} weight="bold">
                FBS Shipping Plan Details
              </Text>
            )}
            {!isFBS && (
              <Text className={css(this.styles.sectionTitle)} weight="bold">
                FBW Shipping Plan Details
              </Text>
            )}
          </div>
          <FBWShippingPrice isFBSShippingPlan={isFBS} />
          <FBWInstruction />
          {shippingPlans.map((shippingPlan) => {
            return (
              <FBWShippingPlanDetail
                key={shippingPlan.id}
                shipping_plan={shippingPlan}
                showDownload
                isFBSShippingPlan={isFBS}
              />
            );
          })}
        </div>
      </>
    );
  }
}
export default FBWShippingPlanSubmitted;
