import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBWShippingPrice from "@merchant/component/logistics/shipping-plan/FBWShippingPrice";
import FBWPrintLabel from "@merchant/component/logistics/shipping-plan/FBWPrintLabel";
import FBWInstruction from "@merchant/component/logistics/shipping-plan/FBWInstruction";
import FBWTrackingInfo from "@merchant/component/logistics/shipping-plan/FBWTrackingInfo";
import FBWShippingPlanDetail from "@merchant/component/logistics/shipping-plan/FBWShippingPlanDetail";
import ShippingPlanStatusLabel from "@merchant/component/logistics/shipping-plan/ShippingPlanStatusLabel";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { ShippingPlan } from "@merchant/api/fbw";
import { Tracking } from "@merchant/api/fbw";
import { ShippingPlanState, ShippingPlanType } from "@merchant/api/fbw";

@observer
class FBWShippingPlanDetailContainer extends Component<{ initialData: {} }> {
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
        marginRight: 8,
      },
    });
  }

  @computed
  get pageX(): string | number {
    const { dimenStore } = AppStore.instance();
    return dimenStore.pageGuideX;
  }

  @computed
  get shippingPlanId(): string {
    const { routeStore } = AppStore.instance();
    const { shippingPlanId } = routeStore.pathParams(
      "/fbw/shipping-plan-by-id/:shippingPlanId"
    );
    return shippingPlanId;
  }

  @computed
  get shippingPlanRequest() {
    return fbwApi.getShippingPlanById({
      shipping_plan_id: this.shippingPlanId,
    });
  }

  @computed
  get shippingPlan(): ShippingPlan | null | undefined {
    return this.shippingPlanRequest.response?.data?.shipping_plan;
  }

  @computed
  get shippingPlanType(): ShippingPlanType | undefined {
    return this.shippingPlanRequest.response?.data?.shipping_plan.shipment_type;
  }

  @computed
  get shippingPlanState(): ShippingPlanState {
    return this.shippingPlan?.state || 7;
  }

  @computed
  get trackingSubmitableState(): boolean {
    return [7, 8, 9, 10, 11, 12, 13].includes(this.shippingPlanState);
  }

  @computed
  get shippingProviders(): {
    [key: string]: string;
  } {
    return this.shippingPlanRequest.response?.data?.shipping_providers || {};
  }

  @computed
  get shippingPlanTracking(): {
    [key: string]: Tracking;
  } {
    return (
      this.shippingPlanRequest.response?.data?.shipping_plan_trackings || {}
    );
  }

  @computed
  get trackings(): ReadonlyArray<Tracking> {
    const shippingPlanTracking = this.shippingPlanTracking;
    return Object.keys(shippingPlanTracking).map((tracking) => {
      return shippingPlanTracking[tracking];
    });
  }

  render() {
    if (!this.shippingPlan) {
      return null;
    }
    const isFBSShippingPlan = this.shippingPlanType
      ? this.shippingPlanType == 2 // "FBS"
      : false;
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.title)}>
          {!isFBSShippingPlan && (
            <Text weight="bold" className={css(this.styles.sectionTitle)}>
              FBW Shipping Plan Details
            </Text>
          )}
          {isFBSShippingPlan && (
            <Text weight="bold" className={css(this.styles.sectionTitle)}>
              FBS Shipping Plan Details
            </Text>
          )}
          <ShippingPlanStatusLabel
            status={this.shippingPlan ? this.shippingPlan.state : 7}
          />
        </div>
        <FBWShippingPrice isFBSShippingPlan={isFBSShippingPlan} />
        <FBWPrintLabel shippingPlan={this.shippingPlan} />
        <FBWInstruction />
        {this.trackingSubmitableState && (
          <FBWTrackingInfo
            shippingPlanId={this.shippingPlanId}
            shippingPlanState={this.shippingPlanState}
            trackings={this.trackings}
            providers={this.shippingProviders}
          />
        )}
        {this.shippingPlan != null && (
          <FBWShippingPlanDetail
            shipping_plan={this.shippingPlan}
            showDownload={false}
            isFBSShippingPlan={isFBSShippingPlan}
          />
        )}
      </div>
    );
  }
}
export default FBWShippingPlanDetailContainer;
