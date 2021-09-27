/* External Libraries */
import moment, { Moment } from "moment/moment";

/* Merchant API */
import {
  CampaignDetailByDateStats,
  CampaignDetailStats,
  ProductBoostCampaignAdminDetail,
  ProductBoostCampaignAdminStat,
} from "@merchant/api/product-boost";

export type PerformanceStats = {
  impressions: number | null | undefined;
  sales: number | null | undefined;
  gmv: number | null | undefined;
  spend: number | null | undefined;
  paid_impressions: number | null | undefined;
  external_impressions: number | null | undefined;
  external_spend: number | null | undefined;
};

export type PerformanceDailyStats = PerformanceStats & {
  date: string;
  dateKey: string;
  available_budget: number | null | undefined;
  spend_per_gmv: number | null | undefined;
  sales_per_1k_impressions: number | null | undefined;
  gmv_per_1k_impressions: number | null | undefined;
};

export type ProductDailyStats = PerformanceStats & {
  pid: string;
  dateKey: string;
  spend_per_gmv: number | null | undefined;
  sales_per_1k_impressions: number | null | undefined;
  gmv_per_1k_impressions: number | null | undefined;
};

export class CampaignPerformanceStats {
  isMaxBoost: boolean;
  isSimpleBoost: boolean;
  campaignStats: CampaignDetailStats | null | undefined;
  campaignDetailByDateStats: CampaignDetailByDateStats | null | undefined;
  startDate: Moment | null | undefined;
  endDate: Moment | null | undefined;
  productIds: ReadonlyArray<string> | null | undefined;

  constructor(params: {
    isMaxBoost: boolean;
    isSimpleBoost: boolean;
    campaignStats: CampaignDetailStats | null | undefined;
    campaignDetailByDateStats?: CampaignDetailByDateStats | null | undefined;
    startDate: Moment | null | undefined;
    endDate: Moment | null | undefined;
    productIds?: ReadonlyArray<string> | null | undefined;
  }) {
    this.isMaxBoost = params.isMaxBoost;
    this.isSimpleBoost = params.isSimpleBoost;
    this.campaignStats = params.campaignStats;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.productIds = params.productIds;
    this.campaignDetailByDateStats = params.campaignDetailByDateStats;
  }

  getDailyStats(): ReadonlyArray<PerformanceDailyStats> {
    const {
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      campaignDetailByDateStats,
      startDate,
      endDate,
      productIds,
    } = this;
    const dailyStats: PerformanceDailyStats[] = [];

    if (campaignStats != null && startDate != null && endDate != null) {
      const dataDate = moment(startDate);
      dataDate.subtract(7, "d");
      const dataEndDate = moment(endDate);
      dataEndDate.add(7, "d");

      let cumulativeSpend = 0;
      while (dataDate.isBefore(dataEndDate)) {
        const dateKey = dataDate.format("YYYY_MM_DD");
        const products = campaignStats[dateKey];

        const duringCampaign =
          dataDate.isBefore(endDate) && dataDate.isSameOrAfter(startDate);

        let dailyStat: PerformanceDailyStats = {
          date: dataDate.format("M/D"),
          dateKey,
          impressions: null,
          sales: null,
          gmv: null,
          spend: null,
          available_budget: null,
          paid_impressions: null,
          external_impressions: null,
          external_spend: null,
          spend_per_gmv: null,
          sales_per_1k_impressions: null,
          gmv_per_1k_impressions: null,
        };

        if (products != null) {
          let totalImpressions = 0;
          let totalSales = 0;
          let totalGMV = 0;
          let totalSpend = 0;
          let totalPaidImpressions = 0;
          let totalExternalImpressions = 0;
          let totalExternalSpend = 0;
          let totalBudget = 0;
          let totalSpendForAllProducts = 0;

          if (
            duringCampaign &&
            campaignDetailByDateStats != null &&
            campaignDetailByDateStats[dateKey]
          ) {
            totalBudget = campaignDetailByDateStats[dateKey].total_budget;
          }

          for (const pid of Object.keys(products)) {
            const productData = products[pid];
            totalSpendForAllProducts += productData.spend;
            if (
              productIds != null &&
              productIds.length > 0 &&
              !productIds.includes(pid)
            ) {
              continue;
            }

            totalImpressions += productData.impressions;
            totalSales += productData.sales;
            totalGMV += productData.gmv;
            totalSpend += productData.spend;
            if (!isSimpleBoost) {
              totalPaidImpressions += productData.paid_impressions || 0;
            }
            if (!isSimpleBoost && isMaxBoost) {
              totalExternalImpressions += productData.external_impressions || 0;
            }
            if (isMaxBoost) {
              totalExternalSpend += productData.external_spend || 0;
            }
          }

          dailyStat = {
            date: dataDate.format("M/D"),
            dateKey,
            impressions: totalImpressions,
            sales: totalSales,
            gmv: totalGMV,
            spend: duringCampaign ? totalSpend : null,
            available_budget:
              duringCampaign && totalBudget > 0
                ? Math.max(totalBudget - cumulativeSpend, 0)
                : null,
            paid_impressions:
              !isSimpleBoost && duringCampaign ? totalPaidImpressions : null,
            external_impressions:
              !isSimpleBoost && isMaxBoost && duringCampaign
                ? totalExternalImpressions
                : null,
            external_spend:
              isMaxBoost && duringCampaign ? totalExternalSpend : null,
            spend_per_gmv:
              duringCampaign && totalGMV > 0
                ? Math.round((totalSpend * 10000 + Number.EPSILON) / totalGMV) /
                  10000
                : null,
            sales_per_1k_impressions:
              totalImpressions > 0
                ? (totalSales * 1000) / totalImpressions
                : null,
            gmv_per_1k_impressions:
              totalImpressions > 0
                ? (totalGMV * 1000) / totalImpressions
                : null,
          };
          if (duringCampaign) {
            cumulativeSpend += totalSpendForAllProducts;
          }
        }
        dailyStats.push(dailyStat);
        dataDate.add(1, "d");
      }
    }
    return dailyStats;
  }

  getCumulativeStats(): PerformanceStats {
    const { isMaxBoost, isSimpleBoost, startDate, endDate } = this;
    const cumulativeStats: PerformanceStats = {
      impressions: 0,
      sales: 0,
      gmv: 0.0,
      spend: 0.0,
      paid_impressions: null,
      external_impressions: null,
      external_spend: null,
    };

    if (!isSimpleBoost) {
      cumulativeStats.paid_impressions = 0;
    }
    if (!isSimpleBoost && isMaxBoost) {
      cumulativeStats.external_impressions = 0;
    }
    if (isMaxBoost) {
      cumulativeStats.external_spend = 0;
    }

    const dailyStats = this.getDailyStats();
    if (startDate != null && endDate != null) {
      const duringCampaignStats = dailyStats.filter((stat) => {
        const dataDate = moment(stat.dateKey, "YYYY_MM_DD");
        return dataDate.isBefore(endDate) && dataDate.isSameOrAfter(startDate);
      });

      for (const stat of duringCampaignStats) {
        cumulativeStats.impressions =
          (stat.impressions || 0) + (cumulativeStats.impressions || 0);
        cumulativeStats.sales =
          (stat.sales || 0) + (cumulativeStats.sales || 0);
        cumulativeStats.gmv = (stat.gmv || 0) + (cumulativeStats.gmv || 0);
        if (stat.spend != null) {
          cumulativeStats.spend =
            (stat.spend || 0) + (cumulativeStats.spend || 0);
        }
        if (!isSimpleBoost) {
          cumulativeStats.paid_impressions =
            (stat.paid_impressions || 0) +
            (cumulativeStats.paid_impressions || 0);
        }
        if (!isSimpleBoost && isMaxBoost) {
          cumulativeStats.external_impressions =
            (stat.external_impressions || 0) +
            (cumulativeStats.external_impressions || 0);
        }
        if (isMaxBoost) {
          cumulativeStats.external_spend =
            (stat.external_spend || 0) + (cumulativeStats.external_spend || 0);
        }
      }
    }
    return cumulativeStats;
  }

  getProductsStatsForDate(dateKey: string): ReadonlyArray<ProductDailyStats> {
    const {
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      startDate,
      endDate,
      productIds,
    } = this;
    const productStats: ProductDailyStats[] = [];

    if (campaignStats != null && startDate != null && endDate != null) {
      const dataDate = moment(dateKey, "YYYY_MM_DD");
      const duringCampaign =
        dataDate.isBefore(endDate) && dataDate.isSameOrAfter(startDate);
      const products = campaignStats[dateKey];

      if (products != null) {
        for (const pid of Object.keys(products)) {
          if (
            productIds != null &&
            productIds.length > 0 &&
            !productIds.includes(pid)
          ) {
            continue;
          }
          const productData = products[pid];
          const { impressions, sales, gmv, spend } = productData;

          productStats.push({
            pid,
            dateKey,
            impressions,
            sales,
            gmv,
            spend: duringCampaign ? spend : null,
            paid_impressions:
              !isSimpleBoost && duringCampaign
                ? productData.paid_impressions
                : null,
            external_impressions:
              !isSimpleBoost && isMaxBoost && duringCampaign
                ? productData.external_impressions
                : null,
            external_spend:
              isMaxBoost && duringCampaign ? productData.external_spend : null,
            spend_per_gmv: duringCampaign && gmv > 0 ? spend / gmv : null,
            sales_per_1k_impressions:
              impressions > 0 ? (sales * 1000) / impressions : null,
            gmv_per_1k_impressions:
              impressions > 0 ? (gmv * 1000) / impressions : null,
          });
        }
      }
    }
    return productStats;
  }
}

export class CampaignAdminPerformanceStats {
  campaignDetailByDateStats: ProductBoostCampaignAdminDetail | null | undefined;
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;

  constructor(params: {
    campaignDetailByDateStats:
      | ProductBoostCampaignAdminDetail
      | null
      | undefined;
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
  }) {
    this.campaignDetailByDateStats = params.campaignDetailByDateStats;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
  }

  getAdminDailyStats(): ProductBoostCampaignAdminStat[] {
    const dailyStats: ProductBoostCampaignAdminStat[] = [];

    if (
      this.campaignDetailByDateStats != null &&
      this.startDate != null &&
      this.endDate != null
    ) {
      const dataDate = moment(this.startDate);
      const dataEndDate = moment(this.endDate);
      while (dataDate.isBefore(dataEndDate)) {
        const dateKey = dataDate.format("YYYY_MM_DD");

        let dailyStat: ProductBoostCampaignAdminStat = {
          date: dataDate.format("M/D"),
          dateKey,
          total_server_side_impressions: null,
          total_client_side_impressions: null,
          total_click_impressions: null,
          total_impressions: null,
          average_server_side_bid: null,
          average_client_side_bid: null,
          average_client_click_bid: null,
          pb_attributed_gmv: null,
          pb_roas: null,
        };

        const stats = this.campaignDetailByDateStats[dateKey];
        if (stats != null) {
          dailyStat = {
            date: dataDate.format("M/D"),
            dateKey,
            total_server_side_impressions: stats.total_server_side_impressions,
            total_client_side_impressions: stats.total_client_side_impressions,
            total_click_impressions: stats.total_click_impressions,
            total_impressions: stats.total_impressions,
            average_server_side_bid: stats.average_server_side_bid,
            average_client_side_bid: stats.average_client_side_bid,
            average_client_click_bid: stats.average_client_click_bid,
            pb_attributed_gmv: stats.pb_attributed_gmv,
            pb_roas: stats.pb_roas,
          };
        }

        dailyStats.push(dailyStat);
        dataDate.add(1, "d");
      }
    }

    return dailyStats;
  }
}
