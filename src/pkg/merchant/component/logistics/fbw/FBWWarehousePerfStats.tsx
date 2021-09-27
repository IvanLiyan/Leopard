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

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBWWarehousePerfTable from "@merchant/component/logistics/fbw/FBWWarehousePerfTable";

import { WarehouseType, TimePeriod } from "@toolkit/fbw";
import RouteStore from "@merchant/stores/RouteStore";
import NavigationStore from "@merchant/stores/NavigationStore";

type BaseProps = any;

export type FBWWarehousePerfStatsProps = BaseProps & {
  readonly warehouse: WarehouseType;
  readonly merchantId: string;
  readonly currency: string;
};

const TablePageSize = 10;

@observer
class FBWWarehousePerfStats extends Component<FBWWarehousePerfStatsProps> {
  @observable
  currentEnd = 0;

  @observable
  totalCount = 0;

  @observable
  selectedTimePeriod: TimePeriod = "weekly";

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
      },
      pageIndicator: {},
      exportCSV: {
        marginLeft: 20,
      },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      buttonsRight: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        ":nth-child(1n) > *": {
          margin: "0px 10px 0px 0px",
        },
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
      timePeriodSelector: {
        marginRight: "15px",
      },
      downloadButton: {
        alignSelf: "stretch",
        marginRight: 25,
        padding: "4px 15px",
        textColor: palettes.textColors.Ink,
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

  exportCSV = () => {
    const navigationStore = NavigationStore.instance();
    navigationStore.download(
      `/fbw/stats/${this.selectedTimePeriod}/export?stats_type=warehouse_report` +
        `&warehouse_id=${this.props.warehouse.id}` +
        `&merchant_id=${this.props.merchantId}` +
        `&start_date=${this.startDate.toISOString().slice(0, 10)}` +
        `&end_date=${this.endDate.toISOString().slice(0, 10)}`
    );
  };

  renderDownloadButton() {
    return (
      <DownloadButton
        style={this.styles.downloadButton}
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

  @computed
  get fetcherParams() {
    const { endDate, startDate } = this;
    const { warehouse } = this.props;
    const params = {
      count: TablePageSize,
      start: this.offset,
      warehouse_id: warehouse.id,
      time_period: this.selectedTimePeriod,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
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
    return `fbw/warehouse-stats/${this.selectedTimePeriod}/get`;
  }

  renderWarehousePerfTable() {
    const { currency } = this.props;
    return (
      <Fetcher
        request_DEP={{
          apiPath: this.apiPath,
          params: this.fetcherParams,
        }}
        onResponse_DEP={this.onResponse}
      >
        <FBWWarehousePerfTable currency={currency} />
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
              {this.renderDownloadButton()}
            </div>
            <div className={css(this.styles.buttonsRight)}>
              {this.renderPageIndicator()}
            </div>
          </div>
          {this.renderWarehousePerfTable()}
        </div>
      </div>
    );
  }
}

export default FBWWarehousePerfStats;
