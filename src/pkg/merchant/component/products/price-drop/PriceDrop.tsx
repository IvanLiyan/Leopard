import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed } from "mobx";

/* Lego Components */
import {
  DownloadButton,
  OnTextChangeEvent,
  PageIndicator,
  FormSelectProps,
  TextInputProps,
  TextInputWithSelect,
  Layout,
} from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant Components */
import PriceDropImprBoostTable from "@merchant/component/products/price-drop/PriceDropImprBoostTable";

/* Toolkit */
import { PriceDropTooltip } from "@toolkit/price-drop/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  SelectedTab,
  ImprBoosterItem,
  CurrencyCode,
  downloadPriceDropCampaignCsv,
  PriceDropSearchType,
} from "@merchant/api/price-drop";
import { GetPriceDropRecordsResponse } from "@merchant/api/price-drop";
import { SelectProps } from "@ContextLogic/lego";
import ConfirmDownloadModal from "@plus/component/orders/bulk-fulfill/ConfirmDownloadModal";
import ToastStore from "@merchant/stores/ToastStore";

export type PriceDropProps = BaseProps & {
  readonly response: GetPriceDropRecordsResponse | null | undefined;
  readonly offset: number;
  readonly pageSize: number;
  readonly pageX: string | number;
  readonly currencyCode: CurrencyCode;
  readonly showGMVGain: boolean;
  readonly selectAll: boolean;
  readonly resetSelectAll: () => void;
  readonly selectedTab: SelectedTab;
  readonly onPriceDropActionUpdated: (arg0: any) => void;
  readonly onPageChange: (arg0: number) => void;
  readonly priceDropDeprecateV1?: boolean;
  readonly historyStateSelectProps?: SelectProps;
  readonly onSearchTypeSelect: (newSearchType: PriceDropSearchType) => void;
  readonly searchOption: PriceDropSearchType;
  readonly onSearchValueChange: (event: OnTextChangeEvent) => void;
  readonly searchValue: string;
};

@observer
class PriceDrop extends Component<PriceDropProps> {
  @computed
  get isLoading(): boolean {
    const { response } = this.props;
    return !response;
  }

  @computed
  get priceDropRecords(): ReadonlyArray<ImprBoosterItem> {
    const { response } = this.props;
    return response?.price_drop_records || [];
  }

  @computed
  get hasNext(): boolean {
    const { response } = this.props;
    return response?.has_more || false;
  }

  @computed
  get currentEnd(): number {
    const { response } = this.props;
    return response?.end || 0;
  }

  @computed
  get totalCount(): number {
    const { response } = this.props;
    return response?.total_count || 0;
  }

  @computed
  get gmvGainDescription(): string {
    const { selectedTab } = this.props;
    return selectedTab === "ended"
      ? PriceDropTooltip.GMV_GAIN_EXPIRED_OFFER
      : PriceDropTooltip.GMV_GAIN;
  }

  @computed
  get impressionsGainDescription(): string {
    const { selectedTab } = this.props;
    return selectedTab === "ended"
      ? PriceDropTooltip.IMPRESSION_GAIN_EXPIRED_OFFER
      : PriceDropTooltip.IMPRESSION_GAIN;
  }

  @computed
  get selectProps(): FormSelectProps<PriceDropSearchType> {
    const { onSearchTypeSelect, searchOption } = this.props;
    return {
      options: [
        {
          value: "product_id",
          text: i`Product ID`,
        },
        {
          value: "product_name",
          text: i`Product Name`,
        },
        {
          value: "product_sku",
          text: i`Product SKU`,
        },
        {
          value: "campaign_id",
          text: i`Campaign ID`,
        },
      ],
      onSelected: onSearchTypeSelect,
      selectedValue: searchOption,
    };
  }

  @computed
  get searchInputProp(): TextInputProps {
    const { searchOption, searchValue, onSearchValueChange } = this.props;
    const inputPlaceholderDict: { [type in PriceDropSearchType]: string } = {
      product_id: i`Search a product ID`,
      product_name: i`Search a product name`,
      product_sku: i`Search a product SKU`,
      campaign_id: i`Search a Price Drop campaign ID`,
    };

    return {
      icon: "search",
      placeholder: inputPlaceholderDict[searchOption],
      hideBorder: true,
      focusOnMount: false,
      value: searchValue,
      onChange: onSearchValueChange,
      style: { minWidth: "25vw" },
    };
  }

  @computed
  get styles() {
    const { pageX } = this.props;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
      },
      tips: {
        marginBottom: 10,
      },
      pageIndicator: {
        marginLeft: 15,
      },
      topControls: {
        marginBottom: 10,
        ":nth-child(1n) > *": {
          height: 30,
        },
      },
    });
  }

  @action
  downloadCSV = async () => {
    const toastStore = ToastStore.instance();
    const resp = await downloadPriceDropCampaignCsv().call();
    if (!resp.data) {
      toastStore.negative(i`Something went wrong`);
      return;
    }
    new ConfirmDownloadModal({
      title: i`Processing Export`,
      text:
        i`Your campaigns are being processed into a CSV file. You will receive an ` +
        i`email with a link to download the file in 24 hours.`,
    }).render();
  };

  renderPriceDropTable() {
    const {
      currencyCode,
      showGMVGain,
      selectAll,
      resetSelectAll,
      selectedTab,
      onPriceDropActionUpdated,
      priceDropDeprecateV1,
    } = this.props;
    const {
      priceDropRecords,
      gmvGainDescription,
      impressionsGainDescription,
    } = this;

    return (
      <PriceDropImprBoostTable
        records={priceDropRecords}
        onPriceDropActionUpdated={onPriceDropActionUpdated}
        selectedTab={selectedTab}
        currencyCode={currencyCode}
        showSuggestedPrice={selectedTab === "active"}
        showExpireTime={selectedTab === "active"}
        showExpireDate={selectedTab === "ended"}
        showAutoRenew={selectedTab === "ongoing"}
        showOriginalPrice={
          selectedTab === "ongoing" || selectedTab === "pending"
        }
        showMerchantDroppedPrice={
          selectedTab === "ongoing" || selectedTab === "pending"
        }
        showSubsidy={selectedTab === "active"}
        showCampaignStatus={
          selectedTab === "ended" || selectedTab === "pending"
        }
        showLastPriceDrop={selectedTab === "ended"}
        showGMVGain={showGMVGain && selectedTab !== "pending"}
        showImpressionGain={selectedTab !== "pending"}
        showStartDate={selectedTab === "pending"}
        gmvGainDescription={gmvGainDescription}
        impressionsGainDescription={impressionsGainDescription}
        selectAll={selectAll}
        resetSelectAll={resetSelectAll}
        priceDropDeprecateV1={priceDropDeprecateV1}
      />
    );
  }

  render() {
    const {
      offset,
      pageSize,
      onPageChange,
      historyStateSelectProps,
      selectedTab,
    } = this.props;
    const {
      isLoading,
      totalCount,
      hasNext,
      currentEnd,
      selectProps,
      searchInputProp,
    } = this;

    return (
      <div className={css(this.styles.root)}>
        {selectedTab === "pending" && (
          <div className={css(this.styles.tips)}>
            <Alert
              text={
                i`As part of the Price Drop program, each campaign is analyzed ` +
                i`to ensure products are optimally positioned for success. ` +
                i`Pending campaigns are not active yet.`
              }
              sentiment="info"
            />
          </div>
        )}
        <Layout.FlexRow
          justifyContent="space-between"
          alignItems="stretch"
          style={this.styles.topControls}
        >
          <TextInputWithSelect
            selectProps={selectProps}
            textInputProps={searchInputProp}
          />
          <Layout.FlexRow justifyContent="flex-end">
            <DownloadButton onClick={this.downloadCSV}>
              Download Last Three Weeks
            </DownloadButton>
            {selectedTab === "ended" && <Select {...historyStateSelectProps} />}
            <PageIndicator
              className={css(this.styles.pageIndicator)}
              isLoading={isLoading}
              totalItems={totalCount}
              rangeStart={offset + 1}
              rangeEnd={currentEnd}
              hasNext={hasNext}
              hasPrev={offset >= pageSize}
              currentPage={offset / pageSize}
              onPageChange={onPageChange}
            />
          </Layout.FlexRow>
        </Layout.FlexRow>
        {isLoading ? <LoadingIndicator /> : this.renderPriceDropTable()}
      </div>
    );
  }
}

export default PriceDrop;
