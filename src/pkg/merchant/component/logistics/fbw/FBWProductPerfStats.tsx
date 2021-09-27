import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Deprecated */
import Fetcher from "@merchant/component/__deprecated__/Fetcher";

/* Lego Components */
import { Select } from "@ContextLogic/lego";
import { DownloadButton } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as illustrations from "@assets/illustrations";

/* Merchant Components */
import FBWProductPerfTable from "@merchant/component/logistics/fbw/FBWProductPerfTable";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { WarehouseType, TimePeriod } from "@toolkit/fbw";
import NavigationStore from "@merchant/stores/NavigationStore";
import RouteStore from "@merchant/stores/RouteStore";

type BaseProps = any;

export type FBWProductPerfStatsProps = BaseProps & {
  readonly warehouse: WarehouseType;
};

const TablePageSize = 10;

@observer
class FBWProductPerfStats extends Component<FBWProductPerfStatsProps> {
  @observable
  totalCount = 0;

  @observable
  selectedTimePeriod: TimePeriod = "weekly";

  @observable
  selectedSearchField = "product_id";

  @observable
  searchText = "";

  @observable
  currentPage = 0;

  startDate: Date = new Date("2010-01-01");
  endDate = new Date();

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
      },
      tableRoot: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
      },
      title: {
        fontSize: 25,
        fontWeight: fonts.weightMedium,
        userSelect: "none",
        color: colors.black,
      },
      buttonsRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "30px 0px",
        flexWrap: "wrap",
      },
      pageIndicator: {},
      exportCSV: {
        marginLeft: 20,
      },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
      },
      buttonsRight: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        ":nth-child(1n) > *": {
          margin: "0px 10px 0px 0px",
        },
      },
      radioGroup: {
        alignSelf: "flex-end",
        margin: "30px 0px",
      },
      pageIndicatorContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      tableContainer: {},
      filterButton: {
        alignSelf: "stretch",
      },
      buttonImg: {
        width: 13,
        height: 13,
        marginRight: 8,
      },
      buttonInner: {
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
      },
      buttons: {
        display: "flex",
        flexDirection: "row",
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
      timePeriodSelector: {
        marginRight: "15px",
      },
      downloadButton: {
        alignSelf: "stretch",
        padding: "4px 15px",
        color: palettes.textColors.Ink,
      },
      searchContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: "15px",
      },
    });
  }

  @computed
  get offset(): number {
    return this.currentPage * TablePageSize;
  }

  @action
  setUrl = (path: string) => {
    const routeStore = RouteStore.instance();
    routeStore.pushPath(path);
  };

  renderPageIndicator() {
    return (
      <PageIndicator
        className={css(this.styles.pageIndicator)}
        hasNext={this.currentPage < this.totalCount / TablePageSize - 1}
        hasPrev={this.currentPage > 0}
        totalItems={this.totalCount}
        rangeStart={this.currentPage * TablePageSize + 1}
        rangeEnd={Math.min(
          this.currentPage * TablePageSize + TablePageSize,
          this.totalCount
        )}
        onPageChange={(page) => (this.currentPage = page)}
        currentPage={this.currentPage}
      />
    );
  }

  exportCSV = () => {
    const navigationStore = NavigationStore.instance();
    navigationStore.download(
      `/fbw/stats/${this.selectedTimePeriod}/export?stats_type=product_report` +
        `&warehouse_id=${this.props.warehouse.id}` +
        `&merchant_id=${this.props.merchantId}` +
        `&search_type=${this.selectedSearchField}` +
        `&search_text=${this.searchText}` +
        `&start_date=${this.startDate.toISOString().slice(0, 10)}` +
        `&end_date=${this.endDate.toISOString().slice(0, 10)}`
    );
  };

  renderDownloadButton() {
    return (
      <DownloadButton
        style={[this.styles.downloadButton]}
        onClick={() => {
          this.exportCSV();
        }}
        popoverContent={i`Download your warehouse performance in a CSV spreadsheet.`}
        disabled={this.totalCount === 0}
      />
    );
  }

  changeSelectedTimePeriod = (timePeriod: TimePeriod) => {
    this.selectedTimePeriod = timePeriod;
  };

  selectTimePeriod = (timePeriod: TimePeriod) => {
    this.changeSelectedTimePeriod(timePeriod);
  };

  renderTimePeriodSelect() {
    return (
      <Select
        className={css(this.styles.timePeriodSelector)}
        options={[
          { value: "weekly", text: i`Weekly` },
          { value: "monthly", text: i`Monthly` },
          { value: "yearly", text: i`Yearly` },
        ]}
        onSelected={this.selectTimePeriod}
        selectedValue={this.selectedTimePeriod}
        buttonHeight={30}
      />
    );
  }

  @action
  onSearchFieldChanged = ({ text }: OnTextChangeEvent) => {
    if (text && text.trim().length >= 0) {
      this.searchText = text.trim();
    } else {
      this.searchText = "";
    }
  };

  @action
  onSelectedSearchFieldChanged = (selectedSearchField: string) => {
    this.selectedSearchField = selectedSearchField;
  };

  renderSearch() {
    return (
      <div className={css(this.styles.searchContainer)}>
        <TextInputWithSelect
          selectProps={{
            onSelected: this.onSelectedSearchFieldChanged,
            selectedValue: this.selectedSearchField,
            options: [
              {
                value: "variation_id",
                text: i`Product SKU`,
              },
              {
                value: "product_id",
                text: i`Product ID`,
              },
            ],
          }}
          textInputProps={{
            icon: illustrations.search,
            placeholder: i`Search`,
            height: 28,
            onChange: this.onSearchFieldChanged,
            value: this.searchText,
            style: {
              "@media (max-width: 900px)": {
                minWidth: 150,
              },
              "@media (min-width: 900px)": {
                minWidth: 350,
              },
            },
            tokenize: true,
            maxTokens: 1,
          }}
        />
      </div>
    );
  }

  @computed
  get fetcherParams() {
    const { endDate, startDate } = this;
    const { warehouse } = this.props;
    let filterProductID: string | null = null;
    let filterSKU: string | null = null;

    switch (this.selectedSearchField) {
      case "product_id":
        filterProductID = this.searchText;
        break;
      case "variation_id":
        filterSKU = this.searchText;
        break;
    }

    if (filterProductID == null && filterSKU == null) {
      return {};
    }
    const params = {
      count: TablePageSize,
      start: this.offset,
      warehouse_id: warehouse.id,
      time_period: this.selectedTimePeriod,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      product_id: filterProductID,
      variation_id: filterSKU,
    };

    return params;
  }

  @action
  onResponse = (response: any) => {
    this.totalCount = 0; // reset total count
    if (response.code !== 0) {
      return;
    }

    const results = response.data.results;
    if (!results || results.num_results == 0) {
      return;
    }
    this.totalCount = results.num_results;
  };

  @computed
  get apiPath(): string {
    return `fbw/product-stats/${this.selectedTimePeriod}/get`;
  }

  renderProductTable() {
    return (
      <Fetcher
        request_DEP={{
          apiPath: this.apiPath,
          params: this.fetcherParams,
        }}
        onResponse_DEP={this.onResponse}
      >
        <FBWProductPerfTable />
      </Fetcher>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.tableContainer)}>
          <div className={css(this.styles.buttonsRow)}>
            <div className={css(this.styles.buttonsLeft)}>
              {this.renderTimePeriodSelect()}
              {this.renderSearch()}
              {this.renderDownloadButton()}
            </div>
            <div className={css(this.styles.buttonsRight)}>
              {this.renderPageIndicator()}
            </div>
          </div>
          {this.renderProductTable()}
        </div>
      </div>
    );
  }
}

export default FBWProductPerfStats;
