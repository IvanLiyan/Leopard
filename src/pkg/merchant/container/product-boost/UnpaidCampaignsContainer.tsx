import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as dimen from "@toolkit/lego-legacy/dimen";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import ProductBoostHeader from "@merchant/component/product-boost/ProductBoostHeader";
import UnpaidCampaignsTable from "@merchant/component/product-boost/list-campaign/UnpaidCampaignsTable";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { StatsColumnItem } from "@merchant/component/product-boost/ProductBoostHeader";

@observer
export default class UnpaidCampaignsContainer extends Component<{
  initialData: {};
}> {
  @computed
  get pageX(): string | number {
    const { dimenStore } = AppStore.instance();
    return dimenStore.pageGuideXForPageWithTable;
  }

  @computed
  get statsColumns(): ReadonlyArray<StatsColumnItem> {
    return [
      {
        columnTitle: i`Pending campaigns`,
        columnStats: `${this.campaigns.length}`,
      },
      {
        columnTitle: i`Pending charges`,
        columnStats: this.unpaidAmountFormatted,
      },
    ];
  }

  @computed
  get campaignRequest() {
    return productBoostApi.getUnpaidCampaigns();
  }

  @computed
  get campaigns() {
    return this.campaignRequest.response?.data?.campaigns || [];
  }

  @computed
  get statsRequest() {
    return productBoostApi.getMerchantSpendingStats({});
  }

  @computed
  get unpaidAmountFormatted() {
    const spendingBreakdown = this.statsRequest.response?.data
      ?.max_spending_breakdown;
    if (!spendingBreakdown) {
      return formatCurrency(0.0);
    }
    const unpaidAmount = spendingBreakdown.current_unpaid;
    const currency = spendingBreakdown.currency || "USD";
    return formatCurrency(unpaidAmount, currency);
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      content: {
        padding: `20px ${this.pageX} ${dimen.pageGuideBottom} ${this.pageX}`,
      },
    });
  }

  render() {
    return (
      <div className={css(this.styles.root)}>
        <ProductBoostHeader
          title={i`Pending ProductBoost Campaigns`}
          body={
            i`Pending ProductBoost campaigns are campaigns that haven't ` +
            i`been charged from your ProductBoost budget. We will charge ` +
            i`these campaigns when they are completed.`
          }
          paddingX={this.pageX}
          illustration="productBoostTransaction"
          statsColumns={this.statsColumns}
        />
        <LoadingIndicator
          loadingComplete={this.campaignRequest.response != null}
        >
          <UnpaidCampaignsTable
            campaigns={this.campaigns}
            className={css(this.styles.content)}
          />
        </LoadingIndicator>
      </div>
    );
  }
}
