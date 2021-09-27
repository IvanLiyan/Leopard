/* eslint-disable local-rules/unwrapped-i18n */

import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { observable, computed, action } from "mobx";

/* External Libraries */
import queryString from "query-string";

/* Lego Components */
import {
  Button,
  Popover,
  TextInput,
  RadioGroup,
  PrimaryButton,
  DownloadButton,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import {
  RequiredValidator,
  NumbersOnlyValidator,
  MinMaxValueValidator,
} from "@toolkit/validators";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import NavigationStore from "@merchant/stores/NavigationStore";

type DownloadCSVButtonProps = BaseProps;

@observer
class DownloadCSVButton extends Component<DownloadCSVButtonProps> {
  @observable
  csvCustomCountText = "1";

  @observable
  validCustomCount = false;

  componentDidMount() {
    const productBoostStore = ProductBoostStore.instance();
    productBoostStore.filterSetting.csvCustomCount = 1;
  }

  closePopover() {
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
  }

  @action
  downloadCSV = () => {
    const { filterSetting, formatDate } = ProductBoostStore.instance();
    const navigationStore = NavigationStore.instance();
    const {
      sortBy,
      orderBy,
      searchedText,
      campaignTypes,
      campaignStatuses,
      autoRenewFilters,
      automatedFilters,
      fromStartDate,
      toStartDate,
      fromEndDate,
      toEndDate,
    } = filterSetting;

    const exportUrl = "/product-boost/export-campaign-history";
    const queryParams = {
      offset: filterSetting.offset,
      count: this.selectedCSVCount,
      sort: sortBy,
      order: orderBy,
      search_string: searchedText,
      states: campaignStatuses.join(","),
      auto_renew: autoRenewFilters.join(","),
      automated: automatedFilters.join(","),
      type: campaignTypes.join(","),
      from_start_date: formatDate(fromStartDate),
      to_start_date: formatDate(toStartDate),
      from_end_date: formatDate(fromEndDate),
      to_end_date: formatDate(toEndDate),
    };
    navigationStore.download(
      `${exportUrl}?${queryString.stringify(queryParams)}`
    );
    this.closePopover();
  };

  @computed
  get selectedCSVCount(): number | null | undefined {
    const {
      filterSetting: { csvCustomCount, csvCountType },
      maxNumRowsCSV,
    } = ProductBoostStore.instance();
    let csvCount: number | null | undefined = null;
    switch (csvCountType) {
      case "ALL_CAMPAIGNS":
        csvCount = Math.min(this.totalCount, maxNumRowsCSV);
        break;
      case "CUSTOM_COUNT":
        csvCount = csvCustomCount;
        break;
    }
    return csvCount;
  }

  @computed
  get totalCount(): number {
    const {
      listElements: { totalCount },
    } = ProductBoostStore.instance();
    if (totalCount) {
      return totalCount;
    }
    return 0;
  }

  @computed
  get validators() {
    const { maxNumRowsCSV } = ProductBoostStore.instance();
    const maxAllowedValue = Math.min(this.totalCount, maxNumRowsCSV);
    return [
      new RequiredValidator(),
      new NumbersOnlyValidator(),
      new MinMaxValueValidator({
        customMessage: i`Count must be between 1 and ${maxAllowedValue}`,
        minAllowedValue: 1,
        maxAllowedValue,
      }),
    ];
  }

  @computed
  get csvResultCountType(): ReadonlyArray<{
    readonly value: string;
    readonly text: string | (() => React.ReactNode);
  }> {
    const { filterSetting, maxNumRowsCSV } = ProductBoostStore.instance();
    const { csvCountType } = filterSetting;
    const { totalCount } = this;
    return [
      {
        value: "ALL_CAMPAIGNS",
        text: i`All campaigns (${Math.min(totalCount, maxNumRowsCSV)})`,
      },
      {
        value: "CUSTOM_COUNT",
        text: () => {
          return (
            <TextInput
              value={this.csvCustomCountText}
              placeholder={i`Custom number`}
              validators={this.validators}
              onChange={({ text }: OnTextChangeEvent) => {
                this.csvCustomCountText = text;
                filterSetting.csvCustomCount = parseInt(text);
              }}
              onValidityChanged={(isValid: boolean) => {
                this.validCustomCount = isValid;
              }}
              disabled={csvCountType === "ALL_CAMPAIGNS"}
            />
          );
        },
      },
    ];
  }

  renderResultCountField() {
    const { filterSetting } = ProductBoostStore.instance();
    return (
      <div className={css(this.styles.container)}>
        <label className={css(this.styles.countText)}>Count</label>
        <RadioGroup
          className={css(this.styles.filter)}
          onSelected={(option) => {
            filterSetting.csvCountType = option;
          }}
          selectedValue={filterSetting.csvCountType}
        >
          {this.csvResultCountType.map((item) => (
            <RadioGroup.Item
              key={item.value}
              value={item.value}
              text={item.text}
            />
          ))}
        </RadioGroup>
      </div>
    );
  }

  renderFilterHeader() {
    return (
      <div className={css(this.styles.header)}>
        <section className={css(this.styles.title)}>Download Filter</section>
      </div>
    );
  }

  renderFilterBody() {
    return (
      <div className={css(this.styles.body)}>
        {this.renderResultCountField()}
      </div>
    );
  }

  renderFilterFooter() {
    const {
      filterSetting: { csvCountType },
    } = ProductBoostStore.instance();
    return (
      <div className={css(this.styles.footer)}>
        <Button
          onClick={() => {
            this.closePopover();
          }}
          className={css(this.styles.cancelButton)}
        >
          Cancel
        </Button>
        <PrimaryButton
          onClick={this.downloadCSV}
          isDisabled={
            csvCountType !== "ALL_CAMPAIGNS" && !this.validCustomCount
          }
          className={css(this.styles.downloadButton)}
        >
          Download
        </PrimaryButton>
      </div>
    );
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "20px 20px 0px 20px",
      },
      body: {
        maxHeight: 340,
        overflow: "hidden",
        padding: "0px 20px",
      },
      footer: {
        borderTop: "1px solid #c4cdd5",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-end",
        padding: 16,
      },
      title: {
        color: palettes.textColors.Ink,
        fontSize: 20,
        height: 28,
        cursor: "default",
        userSelect: "none",
        alignSelf: "center",
        textAlign: "center",
      },
      filter: {
        paddingBottom: 16,
        marginTop: 16,
      },
      countText: {
        fontSize: 16,
        color: palettes.textColors.Ink,
        margin: 0,
        paddingTop: 15,
        paddingRight: 50,
      },
      cancelButton: {
        margin: 4,
        padding: "7px 20px",
        borderRadius: 3,
        color: palettes.textColors.DarkInk,
      },
      container: {
        display: "flex",
        flexDirection: "row",
      },
      downloadButton: {
        margin: 4,
      },
      downloadCSVButton: {
        alignSelf: "stretch",
        marginRight: 25,
        padding: "4px 15px",
        color: palettes.textColors.Ink,
      },
    });
  }

  render() {
    return (
      <Popover
        closeOnMouseLeave={false}
        position="bottom right"
        on="click"
        popoverContent={() => (
          <div className={css(this.styles.root)}>
            {this.renderFilterHeader()}
            {this.renderFilterBody()}
            {this.renderFilterFooter()}
          </div>
        )}
      >
        <DownloadButton
          style={this.styles.downloadCSVButton}
          popoverContent={i`Download your campaign history in a CSV spreadsheet.`}
          disabled={this.totalCount === 0}
        />
      </Popover>
    );
  }
}
export default DownloadCSVButton;
