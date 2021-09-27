import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, reaction } from "mobx";
import { ApolloProvider } from "@apollo/react-hooks";

/* External Libraries */
import queryString from "query-string";

/* Lego Components */
import { Popover } from "@ContextLogic/lego";
import { FilterButton } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

/* Merchant Components */
import CampaignsTable from "@merchant/component/product-boost/list-campaign/CampaignsTable";
import CampaignsFilter from "@merchant/component/product-boost/list-campaign/CampaignsFilter";
import DownloadCSVButton from "@merchant/component/product-boost/DownloadCSVButton";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";

import UserStore from "@merchant/stores/UserStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { GetProductBoostCampaignsParams } from "@merchant/api/product-boost";
import { MarketingCampaignState } from "@schema/types";
import RouteStore from "@merchant/stores/RouteStore";
import ToastStore from "@merchant/stores/ToastStore";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import NavigationStore from "@merchant/stores/NavigationStore";

const PageSize = 15;
const BaseUrl = "/product-boost/history/list";

type CampaignsProps = BaseProps & {
  readonly maxAllowedSpending: number;
  readonly onUpdateCampaignCount: () => unknown;
  readonly onUpdateAllowedSpending: () => unknown;
};

@observer
class Campaigns extends Component<CampaignsProps> {
  dispose: (() => void) | null | undefined = null;

  componentDidMount() {
    const toastStore = ToastStore.instance();
    const routeStore = RouteStore.instance();
    const queryParams = routeStore.queryParams;
    const { action, cid } = queryParams;
    const enableCampaignId = queryParams.enable_campaign_id;
    if (enableCampaignId) {
      this.onEnableEvergreenCampaign(enableCampaignId);
    }

    if (action && cid) {
      let message;
      if (action === "created" || action === "updated") {
        message = i`Your campaign is saved successfully`;
      }
      if (message) {
        toastStore.positive(message, {
          timeoutMs: 5000,
          link: {
            title: i`View details`,
            url: `/product-boost/detail/${cid}`,
          },
        });
      }
    }

    this.dispose = reaction(
      () => this.campaignsRequest.response?.data?.results,
      (results) => {
        if (!results) {
          return;
        }
        const productBoostStore = ProductBoostStore.instance();
        const { filterSetting, listElements } = productBoostStore;
        const { offset } = filterSetting;
        const { expandedRows } = listElements;
        listElements.hasNext = !results.feed_ended;
        listElements.totalCount = results.num_results;
        listElements.currentEnd = (offset || 0) + results.rows.length || 0;
        expandedRows.clear();
        results.rows.forEach((row) =>
          productBoostStore.registerCampaign(
            new CampaignModel({
              id: row.campaign_id,
              budget: row.max_budget.toFixed(2),
              startDate: new Date(row.start_time),
              endDate: new Date(row.end_time),
              scheduledAddBudgetEnabled: row.scheduled_add_budget_enabled,
              scheduledAddBudgetDays: row.scheduled_add_budget_days,
              scheduledAddBudgetAmount: row.scheduled_add_budget_amount.toString(),
              localizedCurrency: row.localized_currency,
              flexibleBudgetEnabled: row.flexible_budget_enabled,
              merchantBudget: row.merchant_budget.toFixed(2),
              minBudgetToAdd: row.min_budget_to_add,
              isBonusBudgetCampaign: row.is_bonus_budget_campaign,
              bonusBudgetRate: row.bonus_budget_rate,
              bonusBudgetType: row.bonus_budget_type,
              bonusBudget: row.localized_bonus_budget,
              usedBonusBudget: row.localized_used_bonus_budget,
            })
          )
        );
      }
    );
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
      this.dispose = null;
    }
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      topControls: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        marginTop: 25,
        ":nth-child(1n) > *": {
          height: 30,
          margin: "0px 0px 25px 0px",
        },
      },
      searchContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      pageIndicator: {
        marginRight: 25,
        alignSelf: "stretch",
      },
      buttons: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      filterButton: {
        alignSelf: "stretch",
      },
      emailInfo: {
        marginTop: 25,
      },
      campaignFilter: {
        maxWidth: 430,
      },
    });
  }

  @computed
  get filterStatus(): ReadonlyArray<MarketingCampaignState> | null | undefined {
    const { filterSetting } = ProductBoostStore.instance();
    const { campaignStatuses } = filterSetting;
    if (campaignStatuses.length === 0) {
      return null;
    }
    return [...campaignStatuses];
  }

  @computed
  get filterAutoRenew(): ReadonlyArray<boolean> | null | undefined {
    const { filterSetting } = ProductBoostStore.instance();
    const { autoRenewFilters } = filterSetting;
    if (autoRenewFilters.length === 0) {
      return null;
    }
    const filterAutoRenew: boolean[] = [];
    if (autoRenewFilters.includes(0)) {
      filterAutoRenew.push(true);
    }
    if (autoRenewFilters.includes(1)) {
      filterAutoRenew.push(false);
    }
    return filterAutoRenew;
  }

  @computed
  get filterAutomated(): ReadonlyArray<boolean> | null | undefined {
    const { filterSetting } = ProductBoostStore.instance();
    const { automatedFilters } = filterSetting;
    if (automatedFilters.length === 0) {
      return null;
    }
    const filterAutomated: boolean[] = [];
    if (automatedFilters.includes(0)) {
      filterAutomated.push(true);
    }
    if (automatedFilters.includes(1)) {
      filterAutomated.push(false);
    }
    return filterAutomated;
  }

  @computed
  get campaignRequestParams(): GetProductBoostCampaignsParams {
    const { filterSetting, formatDate } = ProductBoostStore.instance();
    const {
      offset,
      searchedText,
      sortBy,
      orderBy,
      fromStartDate,
      toStartDate,
      fromEndDate,
      toEndDate,
    } = filterSetting;

    return {
      count: PageSize,
      start: offset,
      sort: sortBy,
      order: orderBy,
      filter_search_string: searchedText,
      filter_states: this.filterStatus,
      filter_evergreen: this.filterAutoRenew,
      filter_automated: this.filterAutomated,
      filter_from_start_date: formatDate(fromStartDate),
      filter_to_start_date: formatDate(toStartDate),
      filter_from_end_date: formatDate(fromEndDate),
      filter_to_end_date: formatDate(toEndDate),
    };
  }

  @computed
  get campaignsRequest() {
    return productBoostApi.getProductBoostCampaigns(this.campaignRequestParams);
  }

  @computed
  get data() {
    return (
      this.campaignsRequest.response?.data || {
        results: {
          feed_ended: false,
          num_results: 0,
          rows: [],
        },
      }
    );
  }

  @computed
  get searchFieldPlaceholder(): string {
    return i`Search by name or ID`;
  }

  @computed
  get merchantId(): string | null | undefined {
    const { loggedInMerchantUser } = UserStore.instance();
    return loggedInMerchantUser.merchant_id;
  }

  @action
  onPageChange = (nextPage: number) => {
    const { filterSetting, listElements } = ProductBoostStore.instance();
    const { totalCount, expandedRows } = listElements;

    const currentOffset = nextPage * PageSize;
    filterSetting.offset = currentOffset;
    expandedRows.clear();
    if (totalCount != null) {
      listElements.currentEnd = Math.min(totalCount, currentOffset + PageSize);
    }
  };

  @action
  onSearchFieldChanged = ({ text }: OnTextChangeEvent) => {
    const { filterSetting, listElements } = ProductBoostStore.instance();
    const { expandedRows } = listElements;

    filterSetting.offset = 0;
    if (text && text.trim().length >= 0) {
      filterSetting.searchedText = text;
    } else {
      filterSetting.searchedText = "";
    }
    expandedRows.clear();
  };

  @action
  onCampaignUpdated = async () => {
    const { onUpdateCampaignCount } = this.props;
    this.campaignsRequest.refresh();
    onUpdateCampaignCount();
  };

  @action
  onEnableEvergreenCampaign = async (enableCampaignId: string) => {
    // TODO: Create a loading interface for <Table> and remove
    // `ajaxloading/finished`

    ($("#page-content") as any).ajaxloading();
    await this.enableEvergreenCampaign(enableCampaignId);

    ($("#page-content") as any).ajaxloading();
  };

  @action
  enableEvergreenCampaign = async (campaignId: string) => {
    const toastStore = ToastStore.instance();
    const routeStore = RouteStore.instance();
    const navigationStore = NavigationStore.instance();

    let resp;
    try {
      resp = await productBoostApi
        .enableCampaign({
          campaign_id: campaignId,
          caller_source: "ListPageEnable",
        })
        .call();
    } catch (e) {
      resp = e;
    }

    const currentQuery = queryString.stringify(routeStore.queryParams);

    if (resp.code !== 0) {
      if (resp.msg) {
        toastStore.error(resp.msg);
      }
      navigationStore.navigate(`/product-boost/edit/${campaignId}`);
    } else {
      toastStore.positive(i`Your campaign is enabled successfully`, {
        timeoutMs: 5000,
        link: {
          title: i`View details`,
          url: `/product-boost/detail/${campaignId}`,
        },
      });
      this.setUrl(`${BaseUrl}?${currentQuery}`);
      this.props.onUpdateAllowedSpending();
      // Force campaign list reload
      this.onCampaignUpdated();
    }
  };

  @action
  setUrl = (path: string) => {
    const routeStore = RouteStore.instance();
    routeStore.pushPath(path);
  };

  renderSearchBar() {
    const { filterSetting } = ProductBoostStore.instance();
    const { searchFieldPlaceholder, onSearchFieldChanged } = this;
    return (
      <div className={css(this.styles.searchContainer)}>
        <TextInput
          icon="search"
          placeholder={searchFieldPlaceholder}
          height={28}
          onChange={onSearchFieldChanged}
          value={filterSetting.searchedText}
          style={{ minWidth: 400 }}
        />
      </div>
    );
  }

  renderPageIndicator() {
    const { filterSetting, listElements } = ProductBoostStore.instance();
    const { totalCount, currentEnd, hasNext } = listElements;

    const currentOffset = filterSetting.offset || 0;
    return (
      <PageIndicator
        className={css(this.styles.pageIndicator)}
        totalItems={totalCount}
        rangeStart={(filterSetting.offset || 0) + 1}
        rangeEnd={currentEnd}
        hasNext={hasNext}
        hasPrev={totalCount != null && currentOffset >= PageSize}
        currentPage={currentOffset / PageSize}
        onPageChange={this.onPageChange}
      />
    );
  }

  renderCampaignFilters() {
    const { client } = ApolloStore.instance();
    const { filterSetting } = ProductBoostStore.instance();
    const { hasActiveFilters } = filterSetting;
    return (
      <Popover
        popoverContent={() => (
          <ApolloProvider client={client}>
            <CampaignsFilter
              className={css(this.styles.campaignFilter)}
              onCampaignUpdated={this.onCampaignUpdated}
            />
          </ApolloProvider>
        )}
        position="bottom"
        on="click"
        closeOnMouseLeave={false}
      >
        <FilterButton
          style={[
            this.styles.filterButton,
            {
              padding: "4px 15px",
              color: hasActiveFilters
                ? palettes.coreColors.WishBlue
                : palettes.textColors.Ink,
            },
          ]}
          isActive={hasActiveFilters}
          borderColor={
            hasActiveFilters
              ? palettes.coreColors.WishBlue
              : palettes.greyScaleColors.DarkGrey
          }
        />
      </Popover>
    );
  }

  renderCampaignsTable() {
    const { maxAllowedSpending, onUpdateAllowedSpending } = this.props;
    if (this.campaignsRequest.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <CampaignsTable
        campaigns={this.data.results.rows}
        maxAllowedSpending={maxAllowedSpending}
        enableEvergreenCampaign={this.enableEvergreenCampaign}
        onUpdateAllowedSpending={onUpdateAllowedSpending}
        onCampaignUpdated={this.onCampaignUpdated} // new campaign list page
        fromNoti={7}
      />
    );
  }

  renderEmailInfo() {
    return (
      <Alert
        className={css(this.styles.emailInfo)}
        text={i`Questions/Bugs/Feedback?`}
        sentiment="info"
        link={{
          text: i`Contact us at productboost@wish.com`,
          url: "mailto:productboost@wish.com",
        }}
      />
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.topControls)}>
          {this.renderSearchBar()}
          <div className={css(this.styles.buttons)}>
            {this.renderPageIndicator()}
            <DownloadCSVButton />
            {this.renderCampaignFilters()}
          </div>
        </div>
        {this.renderCampaignsTable()}
        {this.renderEmailInfo()}
      </div>
    );
  }
}
export default Campaigns;
