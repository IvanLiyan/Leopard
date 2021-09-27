import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import queryString from "query-string";

/* Lego Components */
import { TextInput } from "@ContextLogic/lego";
import { DownloadButton } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductsTable from "@merchant/component/product-boost/ProductsTable";

/* Merchant API */
import { getProductBoostCampaignProductStats } from "@merchant/api/product-boost";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { CampaignProductStatsEntry } from "@merchant/api/product-boost";
import { CurrencyCode } from "@toolkit/currency";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import NavigationStore from "@merchant/stores/NavigationStore";

type ProductsSectionProps = BaseProps;

@observer
class ProductsSection extends Component<ProductsSectionProps> {
  @observable
  searchValue = "";

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      productsTopControl: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
        justifyContent: "space-between",
        margin: "0px 0px 20px 0px",
      },
      productsTopButtons: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        margin: "5px 0px",
      },
      pageIndicator: {
        marginRight: 25,
        alignSelf: "stretch",
      },
      searchInput: {
        // eslint-disable-next-line local-rules/no-frozen-width
        minWidth: 320,
        margin: "5px 0px",
      },
      downloadCSVButton: {
        alignSelf: "stretch",
        marginRight: 25,
        padding: "4px 15px",
      },
    });
  }

  @computed
  get campaign(): CampaignModel | null | undefined {
    const productBoostStore = ProductBoostStore.instance();
    return productBoostStore.currentCampaign;
  }

  @computed
  get request() {
    const { campaign } = this;
    if (campaign != null) {
      return getProductBoostCampaignProductStats({
        campaign_id: campaign.id,
      });
    }
  }

  @computed
  get localizedCurrency(): CurrencyCode {
    const { campaign } = this;
    return campaign?.localizedCurrency || "USD";
  }

  @computed
  get performanceFilterIds(): ReadonlyArray<string> {
    const productBoostStore = ProductBoostStore.instance();
    const { campaignsPerformanceFilters } = productBoostStore;
    return campaignsPerformanceFilters.productIds;
  }

  @computed
  get aggregatedData(): ReadonlyArray<CampaignProductStatsEntry> {
    return this.request?.response?.data?.aggregate_data || [];
  }

  @computed
  get filteredAggregatedData(): ReadonlyArray<CampaignProductStatsEntry> {
    const { aggregatedData, searchValue, performanceFilterIds } = this;
    const lowerCaseSearchValue = searchValue.toLowerCase();
    if (performanceFilterIds.length > 0) {
      return aggregatedData
        .filter((data) => performanceFilterIds.includes(data.product_id))
        .filter(
          (data) =>
            data.product_id.toLowerCase().includes(lowerCaseSearchValue) ||
            data.product_name.toLowerCase().includes(lowerCaseSearchValue)
        );
    }
    return aggregatedData.filter(
      (data) =>
        data.product_id.toLowerCase().includes(lowerCaseSearchValue) ||
        data.product_name.toLowerCase().includes(lowerCaseSearchValue)
    );
  }

  @computed
  get finishedLoadingAPI(): boolean {
    const { request } = this;
    return request?.isSuccessful === true;
  }

  @computed
  get productsCount(): number {
    return this.filteredAggregatedData.length;
  }

  @computed
  get hasProducts(): boolean {
    return this.aggregatedData.length > 0;
  }

  @computed
  get renderSearchBar() {
    const { onSearchFieldChanged, searchValue } = this;
    return (
      <TextInput
        className={css(this.styles.searchInput)}
        icon="search"
        placeholder={i`Search`}
        height={28}
        onChange={onSearchFieldChanged}
        value={searchValue}
      />
    );
  }

  @action
  onSearchFieldChanged = ({ text }: OnTextChangeEvent) => {
    this.searchValue = text;
  };

  @computed
  get renderPageIndicator() {
    const { productsCount } = this;
    return (
      <PageIndicator
        className={css(this.styles.pageIndicator)}
        totalItems={productsCount}
        rangeStart={1}
        rangeEnd={productsCount}
        hasNext={false}
        hasPrev={false}
        currentPage={1}
        onPageChange={() => {}}
      />
    );
  }

  @computed
  get renderProductsTable() {
    const {
      campaign,
      filteredAggregatedData,
      hasProducts,
      localizedCurrency,
    } = this;
    if (!campaign) {
      return null;
    }
    const { id, isV2 } = campaign;
    return (
      <ProductsTable
        aggregateData={filteredAggregatedData}
        currency={localizedCurrency}
        campaignId={id}
        isV2={isV2 || false}
        noDataMessage={hasProducts ? i`No Matching Product` : null}
        handleViewProductPerformance={(
          campaignId: string,
          productId: string
        ) => {
          const { campaignsPerformanceFilters } = ProductBoostStore.instance();
          campaignsPerformanceFilters.productIds = [productId];
          NavigationStore.instance().pushPath(
            `/product-boost/detail/${campaignId}?tab=performance&products=${productId}`
          );
        }}
      />
    );
  }

  @action
  downloadProductsPerformanceCSV = () => {
    const navigationStore = NavigationStore.instance();
    const campaignId = this.campaign?.id;
    const { performanceFilterIds } = this;
    if (campaignId != null) {
      const exportUrl =
        "/product-boost/export-campaign-products-detail-performance";
      const queryParams = {
        campaign_id: campaignId,
        product_ids: performanceFilterIds.join(","),
      };
      navigationStore.download(
        `${exportUrl}?${queryString.stringify(queryParams)}`
      );
    }
  };

  render() {
    const { campaign, finishedLoadingAPI } = this;
    if (!campaign) {
      return null;
    }

    if (!finishedLoadingAPI) {
      return <LoadingIndicator />;
    }
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.productsTopControl)}>
          {this.renderSearchBar}
          <div className={css(this.styles.productsTopButtons)}>
            {this.renderPageIndicator}
            <DownloadButton
              style={this.styles.downloadCSVButton}
              onClick={this.downloadProductsPerformanceCSV}
            />
          </div>
        </div>
        {this.renderProductsTable}
      </div>
    );
  }
}
export default ProductsSection;
