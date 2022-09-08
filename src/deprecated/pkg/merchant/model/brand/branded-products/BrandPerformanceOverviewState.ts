/* External Libraries */
import { observable, action } from "mobx";

/* Merchant API */
import {
  GetBrandPerformanceOverviewMetcisResponse,
  ChartDataEntry,
  BrandDataEntry,
} from "@merchant/api/brand/branded-product-overview";

export type TabKey = "gmv" | "orders" | "impressions";

type BrandPerformanceOverviewStateProps = {
  readonly currencyCode: string;
  readonly tabKey: TabKey;
};

export default class BrandPerformanceOverviewState {
  @observable currencyCode: string;
  @observable tabKey: TabKey;

  @observable totalGMV: number = 0;
  @observable totalOrders: number = 0;
  @observable totalImpressions: number = 0;
  @observable chartData: ReadonlyArray<ChartDataEntry> = [];
  @observable brandData: ReadonlyArray<BrandDataEntry> = [];

  @observable isLoading: boolean = false;

  constructor(props: BrandPerformanceOverviewStateProps) {
    const { currencyCode, tabKey } = props;
    this.currencyCode = currencyCode;
    this.tabKey = tabKey;
  }

  @action
  processResponse(data: GetBrandPerformanceOverviewMetcisResponse) {
    this.totalGMV = data.total_gmv;
    this.totalOrders = data.total_orders;
    this.totalImpressions = data.total_impressions;
    this.chartData = data.chart_data;
    this.brandData = data.brand_data;
  }
}
