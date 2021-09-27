/* External Libraries */
import { computed, action } from "mobx";

/* Lego Toolkit */
import { params_DEPRECATED, DEPRECATED_QueryParamState } from "@toolkit/url";

export default class CampaignPerformanceFilterSetting extends DEPRECATED_QueryParamState {
  @params_DEPRECATED.array("products")
  productIds: ReadonlyArray<string> = [];

  @action
  deselectAllFilters = () => {
    this.productIds = [];
  };

  @computed
  get hasActiveFilters(): boolean {
    const { productIds } = this;
    return productIds.length > 0;
  }
}
