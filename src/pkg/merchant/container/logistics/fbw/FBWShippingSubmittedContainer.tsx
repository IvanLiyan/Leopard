import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Merchant Components */
import FBWShippingPlanSubmitted from "@merchant/component/logistics/shipping-plan/FBWShippingPlanSubmitted";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

import RouteStore from "@merchant/stores/RouteStore";
import { ShippingPlan } from "@merchant/api/fbw";

@observer
class FBWShippingSubmittedContainer extends Component<{ initialData: {} }> {
  @computed
  get batchId(): string {
    const routeStore = RouteStore.instance();
    const { batchId } = routeStore.pathParams(
      "/fbw/shipping-plans-by-batch-id/:batchId"
    );
    return batchId;
  }

  @computed
  get shippingPlanIds(): string {
    const routeStore = RouteStore.instance();
    return routeStore.queryParams.ids;
  }

  @computed
  get shippingPlanRequest() {
    return fbwApi.getShippingPlanByBatchId({
      batch_id: this.batchId,
      shipping_plan_ids: this.shippingPlanIds,
    });
  }

  @computed
  get shippingPlans(): ReadonlyArray<ShippingPlan> {
    return this.shippingPlanRequest.response?.data?.shipping_plans || [];
  }

  render() {
    return <FBWShippingPlanSubmitted shippingPlans={this.shippingPlans} />;
  }
}
export default FBWShippingSubmittedContainer;
