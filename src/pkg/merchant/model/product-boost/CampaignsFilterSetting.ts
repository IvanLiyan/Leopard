/* External Libraries */
import { observable, computed, action } from "mobx";

/* Lego Components */
import { SortOrder } from "@ContextLogic/lego";

/* Lego Toolkit */
import { params_DEPRECATED, DEPRECATED_QueryParamState } from "@toolkit/url";
import { MarketingCampaignState } from "@schema/types";

export type CSVCountType = "ALL_CAMPAIGNS" | "CUSTOM_COUNT";

export default class CampaignsFilterSetting extends DEPRECATED_QueryParamState {
  @params_DEPRECATED.int("offset")
  offset: number | null | undefined;

  @params_DEPRECATED.string("search")
  searchedText: string | null | undefined;

  @params_DEPRECATED.string("sort")
  sortBy: string | null | undefined;

  @params_DEPRECATED.string("order")
  orderBy: SortOrder | null | undefined;

  @params_DEPRECATED.intArray("type")
  campaignTypes: ReadonlyArray<number> = [];

  @params_DEPRECATED.array("states")
  campaignStatuses: ReadonlyArray<MarketingCampaignState> = [];

  @params_DEPRECATED.intArray("auto_renew")
  autoRenewFilters: ReadonlyArray<number> = [];

  @params_DEPRECATED.intArray("automated")
  automatedFilters: ReadonlyArray<number> = [];

  @params_DEPRECATED.date("from_start_date")
  fromStartDate: Date | null | undefined;

  @params_DEPRECATED.date("to_start_date")
  toStartDate: Date | null | undefined;

  @params_DEPRECATED.date("from_end_date")
  fromEndDate: Date | null | undefined;

  @params_DEPRECATED.date("to_end_date")
  toEndDate: Date | null | undefined;

  @observable
  csvCountType: CSVCountType = "ALL_CAMPAIGNS";

  @observable
  csvCustomCount: number | null | undefined;

  @action
  deselectAllFilters = () => {
    this.offset = 0;
    this.sortBy = null;
    this.orderBy = null;
    this.campaignTypes = [];
    this.campaignStatuses = [];
    this.autoRenewFilters = [];
    this.automatedFilters = [];
    this.fromStartDate = null;
    this.toStartDate = null;
    this.fromEndDate = null;
    this.toEndDate = null;
  };

  @computed
  get hasActiveFilters(): boolean {
    const {
      campaignTypes,
      campaignStatuses,
      autoRenewFilters,
      automatedFilters,
      fromStartDate,
      toStartDate,
      fromEndDate,
      toEndDate,
    } = this;
    return (
      campaignTypes.length > 0 ||
      campaignStatuses.length > 0 ||
      autoRenewFilters.length > 0 ||
      automatedFilters.length > 0 ||
      fromStartDate != null ||
      toStartDate != null ||
      fromEndDate != null ||
      toEndDate != null
    );
  }
}
