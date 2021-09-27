import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, action, observable } from "mobx";

/* External Libraries */
import moment from "moment-timezone";
import numeral from "numeral";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Switch } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";
import { ThemedLabel } from "@ContextLogic/lego";

/* Lego Toolkit */
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatDatetimeLocalized, relativeTimeFormat } from "@toolkit/datetime";

/* Merchant Components */
import PriceDropPopover from "@merchant/component/products/price-drop/PriceDropPopover";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import PriceDropPerformanceGraph from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { PriceDropConstants } from "@toolkit/price-drop/constants";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";
import { PriceDropTooltip } from "@toolkit/price-drop/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ImprBoosterItem,
  SelectedTab,
  CurrencyCode,
} from "@merchant/api/price-drop";
import { TableAction, RowSelectionArgs } from "@ContextLogic/lego";
import { PriceDropRangeParams } from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";
import ToastStore from "@merchant/stores/ToastStore";
import UserStore from "@merchant/stores/UserStore";
import NavigationStore from "@merchant/stores/NavigationStore";

const DATE_FORMAT = "MM/DD/YYYY";
const PriceDropLogTable = "PRICE_DROP_UI";

const CampaignState = {
  pending: 1,
  dropped: 2,
  ended: 3,
  canceled: 4,
};

export type PriceDropImprBoostTableProps = BaseProps & {
  readonly records: ReadonlyArray<ImprBoosterItem>;
  readonly onPriceDropActionUpdated?: (arg0: any) => void;
  readonly selectedTab: SelectedTab;
  readonly showExpireDate?: boolean;
  readonly showNewPrice?: boolean;
  readonly showSuggestedPrice?: boolean;
  readonly showExpireTime?: boolean;
  readonly showAutoRenew?: boolean;
  readonly showOriginalPrice?: boolean;
  readonly showMerchantDroppedPrice?: boolean;
  readonly showSubsidy?: boolean;
  readonly showCampaignStatus?: boolean;
  readonly showLastPriceDrop?: boolean;
  readonly gmvGainDescription?: string;
  readonly impressionsGainDescription?: string;
  readonly currencyCode?: CurrencyCode;
  readonly showGMVGain?: boolean;
  readonly showImpressionGain?: boolean;
  readonly showStartDate?: boolean;
  readonly selectAll: boolean;
  readonly resetSelectAll: () => any;
  readonly priceDropDeprecateV1?: boolean;
};

@observer
class PriceDropImprBoostTable extends Component<PriceDropImprBoostTableProps> {
  @observable
  expandedRows: ObservableSet = new ObservableSet();

  selectedRowMap = new ObservableSet();

  @observable
  dropPercentages: Map<string, number> = new Map();

  componentDidUpdate() {
    const { records, selectAll, resetSelectAll } = this.props;
    if (selectAll) {
      const length = records.length;
      const selectedIndexes = Array.from(Array(length).keys());
      selectedIndexes.forEach((index) =>
        this.selectedRowMap.add(index.toString())
      );
      resetSelectAll();
    }
  }

  getDropPercentage(priceDropItem: ImprBoosterItem): number {
    const percentage = this.dropPercentages.get(priceDropItem.id);
    if (percentage != null) {
      return percentage;
    }

    const dropPercentage = priceDropItem.drop_percentage || 0;
    return priceDropItem.trial_drop_percentage
      ? priceDropItem.trial_drop_percentage
      : dropPercentage;
  }

  @computed
  get expandedRowsIndices(): ReadonlyArray<number> {
    const { expandedRows } = this;
    return expandedRows.toArray().map((row) => parseInt(row));
  }

  @computed
  get selectedRows(): ReadonlyArray<number> {
    const { selectedRowMap } = this;
    return selectedRowMap.toArray().map((rowIndex) => parseInt(rowIndex));
  }

  @computed
  get tableRows(): ReadonlyArray<ImprBoosterItem> {
    const { records } = this.props;
    return records;
  }

  async dropPriceBatchAction(priceDropItems: ReadonlyArray<ImprBoosterItem>) {
    const toastStore = ToastStore.instance();
    const userStore = UserStore.instance();

    const priceDropRecordIds = priceDropItems
      .map((priceDropItem) => priceDropItem.id)
      .join(",");
    logger.log(PriceDropLogTable, {
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      action:
        priceDropItems.length === 1
          ? PriceDropLoggingActions.CLICK_DROP_PRICE_FROM_TRIAL_PRICE_DROP
          : PriceDropLoggingActions.CLICK_BATCH_DROP_PRICE,
      price_drop_record_id: priceDropRecordIds,
    });

    const data = {};
    let hasError = false;
    for (const priceDropItem of priceDropItems) {
      (data as any)[priceDropItem.id] = this.getDropPercentage(priceDropItem);
    }
    try {
      await priceDropApi
        .dropPriceForImpression({
          drop_percentages: JSON.stringify(data),
        })
        .call();
    } catch (e) {
      hasError = true;
    }
    if (!hasError) {
      const successMsg =
        priceDropItems.length === 1
          ? i`You successfully dropped the price.`
          : i`You successfully dropped the price for all products.`;
      toastStore.positive(successMsg);
    }
    this.updateTable(false);
  }

  async cancelPriceDropCampaignAction(priceDropItem: ImprBoosterItem) {
    const toastStore = ToastStore.instance();
    const userStore = UserStore.instance();

    logger.log(PriceDropLogTable, {
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      action: PriceDropLoggingActions.CANCEL_PENDING_PRICE_DROP_CAMPAIGN,
      price_drop_record_id: priceDropItem.id,
    });

    try {
      await priceDropApi
        .cancelPriceDropRecord({
          price_drop_record_id: priceDropItem.id,
        })
        .call();
    } catch (e) {
      return;
    }
    const successMsg = i`You successfully canceled the selected price drop campaign.`;
    toastStore.positive(successMsg);
    this.updateTable(false);
  }

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    return [
      {
        key: "drop_price",
        canBatch: true,
        name: (rows) => {
          if (rows.length === 1) {
            return i`Drop ${numeral(this.getDropPercentage(rows[0])).format(
              "0,0"
            )}%`;
          }
          return i`Drop prices by suggested percentage`;
        },
        description: {
          title: PriceDropTooltip.DROP_PRICE,
          position: "bottom center",
        },
        canApplyToRow: (priceDropItem: ImprBoosterItem) => {
          const expireDate = moment
            .utc(priceDropItem.expire_datetime_str || undefined)
            .local();
          return (
            priceDropItem.state === CampaignState.pending &&
            priceDropItem.source_name !== "MERCHANT_MANUAL" &&
            priceDropItem.source_name !== "CSV_UPLOAD" &&
            moment().isBefore(expireDate)
          );
        },
        apply: async (priceDropItems: ReadonlyArray<ImprBoosterItem>) => {
          if (priceDropItems.length !== 1) {
            return new ConfirmationModal(() => {
              return (
                <div className={css(this.styles.confirmationModalContent)}>
                  <p>
                    You are about to drop the prices for all selected products.
                    After you drop the prices, you have {30} minutes to reset
                    them if you would like to reverse this action.
                  </p>
                  <p>
                    Please confirm that you'd like to drop the prices for all
                    selected products.
                  </p>
                </div>
              );
            })
              .setHeader({ title: i`Confirm Price Drop for All Products` })
              .setAction(i`Confirm`, async () => {
                await this.dropPriceBatchAction(priceDropItems);
              })
              .setFooterStyle({
                justifyContent: "center",
              })
              .render();
          }

          await this.dropPriceBatchAction(priceDropItems);
        },
      },
      {
        key: "reset_price",
        name: i`Reset Price`,
        canBatch: false,
        canApplyToRow: (priceDropItem: ImprBoosterItem) => {
          return (
            priceDropItem.state === CampaignState.dropped &&
            priceDropItem.source_name !== "MERCHANT_MANUAL" &&
            priceDropItem.source_name !== "CSV_UPLOAD" &&
            priceDropItem.minutes_left_to_reset > 0
          );
        },
        description: {
          title: PriceDropTooltip.RESET,
          position: "bottom center",
        },
        apply: async (priceDropItems: ReadonlyArray<ImprBoosterItem>) => {
          const toastStore = ToastStore.instance();
          const userStore = UserStore.instance();

          const recordIds: string[] = [];
          let hasError = false;
          for (const priceDropItem of priceDropItems) {
            recordIds.push(priceDropItem.id);
            // log
            logger.log(PriceDropLogTable, {
              merchant_id: userStore.loggedInMerchantUser.merchant_id,
              action: PriceDropLoggingActions.CLICK_RESET_FROM_TRIAL_PRICE_DROP,
              price_drop_record_id: priceDropItem.id,
            });
          }
          try {
            await priceDropApi
              .cancelDropPrice({ record_ids: recordIds.join(",") })
              .call();
          } catch (e) {
            hasError = true;
          }
          if (!hasError) {
            const successMsg =
              priceDropItems.length === 1
                ? i`You successfully reset the price.`
                : i`You successfully reset the price for all products.`;
            toastStore.positive(successMsg);
          }
          this.updateTable(true);
        },
      },
      {
        key: "cancel_price_drop",
        canBatch: false,
        name: () => i`Cancel`,
        description: {
          title: PriceDropTooltip.CANCEL,
          position: "bottom center",
        },
        canApplyToRow: (priceDropItem: ImprBoosterItem) => {
          if (!priceDropItem.start_date_str) {
            return false;
          }
          const startDatePST = moment.tz(
            priceDropItem.start_date_str,
            DATE_FORMAT,
            "America/Los_Angeles"
          );
          const todayDatePSTStr = moment()
            .tz("America/Los_Angeles")
            .format(DATE_FORMAT);
          const todayDatePST = moment.tz(
            todayDatePSTStr,
            DATE_FORMAT,
            "America/Los_Angeles"
          );

          const isTwoDaysBefore = todayDatePST.isSameOrBefore(
            startDatePST.clone().subtract(2, "days")
          );

          return (
            priceDropItem.state === CampaignState.pending && isTwoDaysBefore
          );
        },
        apply: async (priceDropItems: ReadonlyArray<ImprBoosterItem>) => {
          if (priceDropItems.length !== 1) {
            return;
          }
          return new ConfirmationModal(() => {
            return (
              <div className={css(this.styles.confirmationModalContent)}>
                <p>
                  Please confirm that you'd like to cancel selected price drop
                  campaign.
                </p>
              </div>
            );
          })
            .setHeader({
              title: i`Confirm Cancel Selected Price Drop Campaign`,
            })
            .setAction(i`Confirm`, async () => {
              await this.cancelPriceDropCampaignAction(priceDropItems[0]);
            })
            .setFooterStyle({
              justifyContent: "center",
            })
            .render();
        },
      },
    ];
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      confirmationModalContent: {
        fontSize: 16,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        textAlign: "center",
        padding: "30px 0px",
      },
      option: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        userSelect: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        cursor: "pointer",
        backgroundColor: palettes.textColors.White,
        color: palettes.textColors.Ink,
        transition: "all 0.2s linear",
        ":hover": {
          opacity: 1,
          backgroundColor: "rgba(47, 183, 236, 0.2)",
          color: palettes.coreColors.WishBlue,
        },
      },
      button: {
        border: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
        borderRadius: 4,
        overflow: "hidden",
        opacity: 1,
        height: 40,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
      },
      chevron: {
        marginLeft: "10px",
        transform: "rotate(90deg)",
      },
      suggestedPricePopover: {
        margin: "15px",
      },
      nonSelectableText: {
        userSelect: "none",
        fontSize: "14px",
      },
      resultedProductPriceRow: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "stretch",
        userSelect: "none",
        justifyContent: "space-between",
      },
      rowContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      },
      expandedContainer: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: palettes.greyScaleColors.Grey,
      },
      expandedTitle: {
        padding: "19px 0px 14px 27px",
        fontSize: "24px",
        fontWeight: fonts.weightBold,
      },
      expandedPerformanceGraph: {
        margin: "0px 24px 23px 26px",
        borderRadius: "4px",
        border: "1px solid rgba(175, 199, 209, 0.5)",
        backgroundColor: palettes.textColors.White,
      },
      boldNumbers: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        fontWeight: fonts.weightBold,
        lineHeight: 1.5,
        marginRight: "5px",
        marginLeft: "5px",
      },
      textDiluted: {
        color: "#7790a3",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        fontWeight: fonts.weightMedium,
      },
      expiryFieldExpireSoon: {
        color: "#d6272e",
        fontWeight: fonts.weightSemibold,
      },
      expiryFieldNormal: {
        color: "#7790a3",
        fontWeight: fonts.weightSemibold,
      },
      statusField: {
        color: palettes.textColors.Ink,
        fontWeight: fonts.weightSemibold,
      },
      cancel: {
        color: "#db2441",
      },
      renew: {
        color: "#3f7004",
      },
      wishCancel: {
        color: "#637077",
      },
      campaignId: {
        fontSize: 14,
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",

        overflow: "hidden",
      },
      noCampaignDisplay: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      noCampaignIllustration: {
        maxWidth: 300,
        marginBottom: 30,
      },
    });
  }

  @action
  onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      this.expandedRows.add(index.toString());
    } else {
      this.expandedRows.remove(index.toString());
    }
  };

  @action
  onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<ImprBoosterItem>) => {
    if (selected) {
      this.selectedRowMap.add(index.toString());
    } else {
      this.selectedRowMap.remove(index.toString());
    }
  };

  updateTable(resetTableOffset: boolean) {
    const { onPriceDropActionUpdated } = this.props;
    const navigationStore = NavigationStore.instance();

    this.selectedRowMap.clear();
    if (onPriceDropActionUpdated == null) {
      navigationStore.reload();
    } else {
      onPriceDropActionUpdated(resetTableOffset);
    }
  }

  renderExpiryField(priceDropItem: ImprBoosterItem) {
    const expireDate = moment
      .utc(priceDropItem.expire_datetime_str || undefined)
      .local();
    const value = relativeTimeFormat(expireDate);
    const dayLeft = expireDate.diff(moment(), "days");

    if (dayLeft <= 3) {
      return (
        <div className={css(this.styles.expiryFieldExpireSoon)}>{value}</div>
      );
    }
    return <div className={css(this.styles.expiryFieldNormal)}>{value}</div>;
  }

  renderDateExpired(priceDropItem: ImprBoosterItem) {
    if (priceDropItem.state === CampaignState.pending) {
      const expireDateLocal = moment
        .utc(priceDropItem.expire_datetime_str || undefined)
        .local();
      return (
        <div className={css(this.styles.textDiluted)}>
          {formatDatetimeLocalized(expireDateLocal, DATE_FORMAT)}
        </div>
      );
    }
    return (
      <div className={css(this.styles.textDiluted)}>
        {priceDropItem.end_date_str}
      </div>
    );
  }

  renderDaysUntilAutoRenew(row: ImprBoosterItem) {
    let cancelOrRenew = null;
    let style: any = null;
    if (row.end_date_str == null) {
      return null;
    }
    let endDatePST = moment.tz(
      row.end_date_str,
      DATE_FORMAT,
      "America/Los_Angeles"
    );
    if (row.blacklisted) {
      cancelOrRenew = ci18n(
        "Verb. Fragment of 'Wish cancels in X days' ",
        "Wish cancels"
      );
      style = this.styles.wishCancel;
    } else if (row.auto_renew) {
      cancelOrRenew = ci18n("Verb. Fragment of 'Renews in X days' ", "Renews");
      style = this.styles.renew;
      endDatePST = endDatePST.subtract(1, "days");
    } else {
      cancelOrRenew = ci18n(
        "Verb. Fragment of 'Cancels in X days' ",
        "Cancels"
      );
      style = this.styles.cancel;
    }

    const endDateLocal = endDatePST.clone().local();
    const value = relativeTimeFormat(endDateLocal);

    return (
      <div className={css(this.styles.statusField)}>
        <span className={css(style)}>{cancelOrRenew + " "}</span>
        <span>{value}</span>
      </div>
    );
  }

  getPercentageOff(dropPercentage: number | null | undefined) {
    if (dropPercentage === null || dropPercentage === undefined) {
      return null;
    }
    return (
      <div className={css(this.styles.boldNumbers)}>
        {ci18n(
          "placeholder is a sale/discount",
          "%1$s OFF",
          numeral(dropPercentage / 100.0).format("0%")
        )}
      </div>
    );
  }

  getPriceRange(minPrice: number, maxPrice: number) {
    return (
      <div className={css(this.styles.textDiluted)}>
        {this.renderPriceRange({ minPrice, maxPrice })}
      </div>
    );
  }

  renderPriceRange = (params: PriceDropRangeParams) => {
    const { currencyCode } = this.props;
    const minPrice = params.dropPercentage
      ? (params.minPrice * (100 - params.dropPercentage)) / 100.0
      : params.minPrice;
    const maxPrice = params.dropPercentage
      ? (params.maxPrice * (100 - params.dropPercentage)) / 100.0
      : params.maxPrice;

    if (minPrice === maxPrice) {
      return formatCurrency(minPrice, currencyCode);
    }
    return `${formatCurrency(minPrice, currencyCode)}-${formatCurrency(
      maxPrice,
      currencyCode
    )}`;
  };

  renderMerchantDroppedPrice(priceDropItem: ImprBoosterItem) {
    return (
      <div className={css(this.styles.rowContainer)}>
        {this.getPriceRange(
          priceDropItem.new_localized_price_min,
          priceDropItem.new_localized_price_max
        )}
      </div>
    );
  }

  renderMerchantDroppedPercentage(priceDropItem: ImprBoosterItem) {
    return (
      <div className={css(this.styles.rowContainer)}>
        {priceDropItem.state === CampaignState.pending &&
        priceDropItem.source_name !== "MERCHANT_MANUAL" &&
        priceDropItem.source_name !== "CSV_UPLOAD"
          ? this.getPercentageOff(priceDropItem.trial_drop_percentage)
          : this.getPercentageOff(priceDropItem.drop_percentage)}
      </div>
    );
  }

  renderExpandedDetail = (priceDropItem: ImprBoosterItem) => {
    const { selectedTab } = this.props;
    const userStore = UserStore.instance();

    // log
    logger.log(PriceDropLogTable, {
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      action:
        selectedTab === "active"
          ? PriceDropLoggingActions.CLICK_EXPANDABLE_SECTION_FOR_TRIAL_PERFORMANCE
          : PriceDropLoggingActions.CLICK_EXPANDABLE_SECTION_FOR_ONGOING_PERFORMANCE,
      price_drop_record_id: priceDropItem.id,
    });

    return this.renderPriceDropPerformanceGraph(priceDropItem.id);
  };

  renderPriceDropPerformanceGraph = (priceDropRecordId: string) => {
    // get price drop record
    const priceDropInfoRequest = priceDropApi.getDropPriceBasicInfo({
      price_drop_record_id: priceDropRecordId,
    });
    const priceDropItem =
      priceDropInfoRequest.response?.data?.price_drop_record;

    if (priceDropItem == null) {
      return <LoadingIndicator />;
    }

    const {
      start_date_str: campaignStartDateStr,
      end_date_str: campaignEndDateStr,
      trial_start_date_str: trialStartDateStr,
      trial_end_date_str: trialEndDateStr,
    } = priceDropItem;

    const trialStartDate = trialStartDateStr
      ? moment(trialStartDateStr, DATE_FORMAT)
      : null;
    const trialEndDate = trialEndDateStr
      ? moment(trialEndDateStr, DATE_FORMAT)
      : null;
    const campaignStartDate = campaignStartDateStr
      ? moment(campaignStartDateStr, DATE_FORMAT)
      : null;
    const campaignEndDate = campaignEndDateStr
      ? moment(campaignEndDateStr, DATE_FORMAT)
      : null;

    let startDateParam = "";
    if (trialStartDate) {
      startDateParam = trialStartDate
        .clone()
        .subtract(7, "days")
        .format(DATE_FORMAT);
    } else if (campaignStartDate) {
      startDateParam = campaignStartDate
        .clone()
        .subtract(7, "days")
        .format(DATE_FORMAT);
    }

    let endDateParam = "";
    if (campaignEndDate) {
      endDateParam = campaignEndDate.clone().add(7, "days").format(DATE_FORMAT);
    } else if (trialEndDate) {
      endDateParam = trialEndDate.clone().add(7, "days").format(DATE_FORMAT);
    }

    // get price drop performance data
    const productPerformanceRequest = priceDropApi.getDropPriceProductPerformance(
      {
        price_drop_record_id: priceDropItem.id,
        start_date: startDateParam,
        end_date: endDateParam,
      }
    );
    const data = productPerformanceRequest.response?.data;

    return (
      <div className={css(this.styles.expandedContainer)}>
        <div className={css(this.styles.expandedTitle)}>Performance</div>
        <div className={css(this.styles.expandedPerformanceGraph)}>
          {data == null ? (
            <LoadingIndicator />
          ) : (
            <PriceDropPerformanceGraph
              data={data.daily_data}
              trialStartDate={trialStartDate}
              trialEndDate={trialEndDate}
              campaignStartDate={campaignStartDate}
              campaignEndDate={campaignEndDate}
              priceDropItem={priceDropItem}
              renderPriceRange={this.renderPriceRange}
            />
          )}
        </div>
      </div>
    );
  };

  renderMerchantDroppedPercentageField(priceDropItem: ImprBoosterItem) {
    const { selectedTab, onPriceDropActionUpdated } = this.props;
    const { dropPercentages } = this;
    const priceDropPercentage = this.getDropPercentage(priceDropItem);
    if (priceDropItem.end_date_str == null) {
      return null;
    }
    const endDatePST = moment.tz(
      priceDropItem.end_date_str,
      DATE_FORMAT,
      "America/Los_Angeles"
    );
    const endDateLocal = endDatePST.local();
    const dayLeft = endDateLocal.diff(moment(), "days");
    if (
      selectedTab === "ongoing" &&
      !priceDropItem.is_competitive &&
      dayLeft > 2 &&
      priceDropItem.source_name !== "COLLECTION_BOOST_AUCTION"
    ) {
      return (
        <PriceDropPopover
          dropPercentage={priceDropPercentage}
          rangeSliderHandler={({ value }) => {
            dropPercentages.set(priceDropItem.id, value);
          }}
          priceDropItem={priceDropItem}
          renderPriceRange={this.renderPriceRange}
          minDropPercentage={priceDropItem.drop_percentage}
          onPriceDropActionUpdated={onPriceDropActionUpdated}
          isongoing
        />
      );
    }

    return this.renderMerchantDroppedPercentage(priceDropItem);
  }

  renderSuggestedPriceField(priceDropItem: ImprBoosterItem) {
    const { dropPercentages } = this;
    const priceDropPercentage = this.getDropPercentage(priceDropItem);
    return (
      <PriceDropPopover
        dropPercentage={priceDropPercentage}
        rangeSliderHandler={({ value }) => {
          dropPercentages.set(priceDropItem.id, value);
        }}
        priceDropItem={priceDropItem}
        renderPriceRange={this.renderPriceRange}
      />
    );
  }

  renderCampaignId(priceDropItem: ImprBoosterItem) {
    const campaignId = priceDropItem.id;
    const { selectedTab } = this.props;
    const url = `/marketplace/price-drop/performance/${campaignId}`;
    const uncompetitivePopover =
      i`This Price Drop campaign isn't offering competitive pricing for the product. ` +
      i`Please select a higher Price Drop percentage and create a new campaign ` +
      i`for an opportunity to gain more impressions and be more competitive.`;

    if (selectedTab === "pending") {
      return (
        <CopyButton
          text={campaignId}
          prompt={i`Copy Campaign ID`}
          copyOnBodyClick={false}
        >
          {`...${campaignId.substring(campaignId.length - 5)}`}
        </CopyButton>
      );
    }

    return (
      <>
        <CopyButton
          text={campaignId}
          prompt={i`Copy Campaign ID`}
          copyOnBodyClick={false}
        >
          <Link className={css(this.styles.campaignId)} openInNewTab href={url}>
            {`...${campaignId.substring(campaignId.length - 5)}`}
          </Link>
        </CopyButton>
        {!priceDropItem.is_competitive && selectedTab === "ongoing" && (
          <ThemedLabel
            theme="DarkRed"
            popoverContent={uncompetitivePopover}
            style={{ borderRadius: 10 }}
          >
            {ci18n(
              "not competitive here means the price is not low enough compared to other similar products on Wish",
              "Not Competitive"
            )}
          </ThemedLabel>
        )}
      </>
    );
  }

  renderParentSKU(priceDropItem: ImprBoosterItem) {
    const skuId = priceDropItem.parent_sku;
    let displayId = skuId;
    if (skuId.length > 20) {
      displayId = skuId.substring(0, 17) + "...";
    }
    return (
      <CopyButton
        text={skuId}
        prompt={i`Copy Parent SKU`}
        copyOnBodyClick={false}
      >
        {`${displayId}`}
      </CopyButton>
    );
  }

  renderCampaignStatus(priceDropItem: ImprBoosterItem) {
    if (priceDropItem.state === CampaignState.pending) {
      if (
        priceDropItem.source_name === "MERCHANT_MANUAL" ||
        priceDropItem.source_name === "CSV_UPLOAD"
      ) {
        return <div>Pending</div>;
      }
      return <div>Expired Offer</div>;
    } else if (
      priceDropItem.state === CampaignState.ended &&
      !priceDropItem.blacklisted
    ) {
      return <div>Campaign Ended</div>;
    } else if (
      priceDropItem.state === CampaignState.canceled &&
      priceDropItem.cancel_reason === 1 // PriceDropRecord.CancelReason.MERCHANT_CANCEL
    ) {
      return <div>Merchant Canceled</div>;
    }
    return (
      <Popover
        position={"top"}
        popoverContent={i`Wish canceled this campaign due to low performance standards.`}
        contentWidth={300}
      >
        <div>Wish Canceled</div>
      </Popover>
    );
  }

  renderSubsidyPeriod(priceDropItem: ImprBoosterItem) {
    return (
      <div className={css(this.styles.textDiluted)}>
        {priceDropItem.trial_start_date_str} -{" "}
        {priceDropItem.trial_end_date_str}
      </div>
    );
  }

  renderWishSubsidy(priceDropItem: ImprBoosterItem) {
    return this.getPercentageOff(priceDropItem.trial_drop_percentage);
  }

  renderGMVGain(priceDropItem: ImprBoosterItem) {
    const { selectedTab } = this.props;
    let gainText = "";
    // only display "up to" for expired offers because the merchant miss out
    if (
      priceDropItem.state === CampaignState.pending &&
      selectedTab === "ended"
    ) {
      gainText = i`Up to +`;
    } else if (priceDropItem.gmv_gain && priceDropItem.gmv_gain > 0) {
      gainText = "+";
    }

    return (
      <div className={css(this.styles.boldNumbers)}>
        {gainText}
        &nbsp;
        {numeral(priceDropItem.gmv_gain).format("0.00%")}
      </div>
    );
  }

  renderImpressionGain(priceDropItem: ImprBoosterItem) {
    const { selectedTab } = this.props;
    let gainText = "";
    // only display "up to" for expired offers because the merchant miss out
    if (
      priceDropItem.state === CampaignState.pending &&
      selectedTab === "ended"
    ) {
      gainText = i`Up to +`;
    } else if (
      priceDropItem.impression_gain &&
      priceDropItem.impression_gain > 0
    ) {
      gainText = "+";
    }

    return (
      <div className={css(this.styles.boldNumbers)}>
        {gainText}
        &nbsp;
        {numeral(priceDropItem.impression_gain).format("0.00%")}
      </div>
    );
  }

  renderImpressionGainUpdating() {
    return (
      <Popover
        position={"top"}
        popoverContent={PriceDropTooltip.IMPRESSION_GAIN_UPDATING}
        contentWidth={300}
      >
        Updating…
      </Popover>
    );
  }

  renderGMVGainUpdating() {
    return (
      <Popover
        position={"top"}
        popoverContent={PriceDropTooltip.GMV_GAIN_UPDATING}
        contentWidth={300}
      >
        Updating…
      </Popover>
    );
  }

  renderNoPriceDrop(selectedTab: SelectedTab) {
    let noCampaignMsg = "";
    const createCampaignMsg = i`Create your own campaigns to stay competitive in the market.`;
    if (selectedTab === "active") {
      noCampaignMsg = i`No price drop offers available.`;
    } else if (selectedTab === "pending") {
      noCampaignMsg = i`No pending campaigns to view.`;
    } else if (selectedTab === "ongoing") {
      noCampaignMsg = i`No on-going campaigns to view.`;
    } else if (selectedTab === "ended") {
      noCampaignMsg = i`No campaign history to view.`;
    } else {
      noCampaignMsg = i`No campaigns to view.`;
    }

    const url = `/marketplace/price-drop/create-campaign`;

    return (
      <div className={css(this.styles.noCampaignDisplay)}>
        <Illustration
          name="priceDropCampaignEmpty"
          className={css(this.styles.noCampaignIllustration)}
          alt="illustration"
        />
        <span>
          {noCampaignMsg} {createCampaignMsg}
        </span>
        <Link className={css(this.styles.campaignId)} openInNewTab href={url}>
          Create a campaign
        </Link>
      </div>
    );
  }

  renderAutoRenewWithPopover(priceDropItem: ImprBoosterItem) {
    const { priceDropDeprecateV1 } = this.props;
    if (priceDropItem.end_date_str == null) {
      return null;
    }
    const endDatePST = moment.tz(
      priceDropItem.end_date_str,
      DATE_FORMAT,
      "America/Los_Angeles"
    );
    const endDateLocal = endDatePST.local();
    const eightDaysBefore = moment().isBefore(
      endDateLocal.clone().subtract(8, "days")
    );
    const twoDaysBefore = moment().isBefore(
      endDateLocal.clone().subtract(2, "days")
    );
    const value = relativeTimeFormat(endDateLocal);
    const autoRenewContent = this.renderAutoRenew(priceDropItem);

    // display N/A for auto-renew toggle if wish cancels
    if (
      priceDropItem.blacklisted ||
      (priceDropDeprecateV1 && priceDropItem.source_name === "DUPLICATE_TRIAL")
    ) {
      return (
        <Popover
          popoverContent={ci18n(
            "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
            "Wish is canceling this product price drop due to low performance standards. This cancellation will take place %1$s.",
            value
          )}
          position="bottom center"
          contentWidth={300}
        >
          {autoRenewContent}
        </Popover>
      );
    }

    // disable auto-renew toggle and display a popover if it is not 8 days before autorenew
    if (eightDaysBefore) {
      let autoRenewDays;
      if (
        priceDropItem.source_name === "MERCHANT_MANUAL" ||
        priceDropItem.source_name === "CSV_UPLOAD"
      ) {
        autoRenewDays = PriceDropConstants.V2_CAMPAIGN_AUTO_RENEW_DAYS;
      } else if (priceDropItem.source_name === "DUPLICATE_TRIAL") {
        autoRenewDays = PriceDropConstants.V1_CAMPAIGN_AUTO_RENEW_DAYS;
      }
      return (
        <Popover
          popoverContent={
            i`This ongoing campaign will be automatically renewed for another ${autoRenewDays} calendar ` +
            i`days by default. However, you are able to manually opt out of the automatic ` +
            i`renewal during ${2} to ${8} calendar days before the campaign end date.`
          }
          position="bottom center"
          contentWidth={300}
        >
          {autoRenewContent}
        </Popover>
      );
    }

    // display a popover if user toggles off auto renew
    if (twoDaysBefore && !priceDropItem.auto_renew) {
      return (
        <Popover
          popoverContent={ci18n(
            "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
            "This campaign will be canceled %1$s. Your product may lose its promoted status thereafter.",
            value
          )}
          position="bottom center"
          contentWidth={300}
        >
          {autoRenewContent}
        </Popover>
      );
    }

    return autoRenewContent;
  }

  renderAutoRenew(priceDropItem: ImprBoosterItem) {
    const { priceDropDeprecateV1 } = this.props;
    if (priceDropItem.end_date_str == null) {
      return null;
    }
    const endDatePST = moment.tz(
      priceDropItem.end_date_str,
      DATE_FORMAT,
      "America/Los_Angeles"
    );
    const endDateLocal = endDatePST.clone().local();
    const eightDaysBefore = moment().isBefore(
      endDateLocal.clone().subtract(8, "days")
    );
    const twoDaysBefore = moment().isBefore(
      endDateLocal.clone().subtract(2, "days")
    );
    if (
      priceDropItem.blacklisted ||
      !twoDaysBefore ||
      (priceDropDeprecateV1 && priceDropItem.source_name === "DUPLICATE_TRIAL")
    ) {
      return <div>N/A</div>;
    }
    return (
      <Switch
        isOn={priceDropItem.auto_renew}
        disabled={eightDaysBefore}
        onToggle={async (isOn: boolean) => {
          const toastStore = ToastStore.instance();
          const userStore = UserStore.instance();
          // log
          logger.log(PriceDropLogTable, {
            merchant_id: userStore.loggedInMerchantUser.merchant_id,
            action: isOn
              ? PriceDropLoggingActions.TOGGLE_ON_AUTO_RENEW_FROM_ONGOING_CAMPAIGN
              : PriceDropLoggingActions.TOGGLE_OFF_AUTO_RENEW_FROM_ONGOING_CAMPAIGN,
            price_drop_record_id: priceDropItem.id,
          });

          let hasError = false;
          try {
            await priceDropApi
              .updateAutoRenew({
                record_id: priceDropItem.id,
                auto_renew: isOn,
              })
              .call();
          } catch (e) {
            hasError = true;
          }
          if (!hasError) {
            const successMsg = isOn
              ? i`You successfully turned on auto renew`
              : i`You successfully turned off auto renew`;
            toastStore.positive(successMsg);
          }
          this.updateTable(false);
        }}
      />
    );
  }

  render() {
    const {
      impressionsGainDescription,
      gmvGainDescription,
      selectedTab,
      className,
      showExpireDate,
      showExpireTime,
      showSuggestedPrice,
      showAutoRenew,
      showOriginalPrice,
      showMerchantDroppedPrice,
      showSubsidy,
      showCampaignStatus,
      showLastPriceDrop,
      showGMVGain,
      showImpressionGain,
      showStartDate,
    } = this.props;
    return (
      <Table
        className={css(this.styles.root, className)}
        data={this.tableRows}
        actions={this.tableActions}
        rowExpands={() => selectedTab === "ongoing" || selectedTab === "active"}
        expandedRows={this.expandedRowsIndices}
        renderExpanded={this.renderExpandedDetail}
        onRowExpandToggled={this.onRowExpandToggled}
        canSelectRow={() => true}
        selectedRows={this.selectedRows}
        onRowSelectionToggled={this.onRowSelectionToggled}
        noDataMessage={() => this.renderNoPriceDrop(selectedTab)}
        rowHeight={65}
        cellStyle={() => ({ fontSize: 16 })}
        highlightRowOnHover
        overflowY="visible"
      >
        <Table.Column title={i`Campaign ID`} columnKey="id" align="left">
          {({ row }) => this.renderCampaignId(row)}
        </Table.Column>

        <ProductColumn
          title={i`Product Name`}
          columnKey="product_id"
          showFullName={false}
        />

        <Table.Column
          title={i`Parent SKU`}
          columnKey="parent_sku"
          align="left"
          width={200}
        >
          {({ row }) => this.renderParentSKU(row)}
        </Table.Column>

        {showSubsidy && (
          <Table.Column
            title={i`Subsidy Period`}
            columnKey="trial_start_date_str"
          >
            {({ row }) => this.renderSubsidyPeriod(row)}
          </Table.Column>
        )}

        {showSubsidy && (
          <Table.Column
            title={i`Wish Subsidy`}
            columnKey="trial_drop_percentage"
            description={PriceDropTooltip.WISH_SUBSIDY}
            align="right"
          >
            {({ row }) => this.renderWishSubsidy(row)}
          </Table.Column>
        )}

        {showCampaignStatus && (
          <Table.Column title={i`Status`} columnKey="blacklisted" align="left">
            {({ row }) => this.renderCampaignStatus(row)}
          </Table.Column>
        )}

        {showStartDate && (
          <Table.Column title={i`Start Date`} columnKey="start_date_str" />
        )}

        {showOriginalPrice && (
          <Table.Column
            title={i`Original Product Price`}
            columnKey="original_localized_price_min"
            description={PriceDropTooltip.ORIGINAL_PRICE}
            align="right"
          >
            {({ row }) =>
              this.getPriceRange(
                row.original_localized_price_min,
                row.original_localized_price_max
              )
            }
          </Table.Column>
        )}

        {showMerchantDroppedPrice && (
          <Table.Column
            title={i`Merchant price dropped to`}
            columnKey="new_localized_price_max"
            description={PriceDropTooltip.MERCHANT_DROPPED_PRICE}
            align="right"
          >
            {({ row }) => this.renderMerchantDroppedPrice(row)}
          </Table.Column>
        )}

        {showMerchantDroppedPrice && (
          <Table.Column
            title={i`Dropped by this percentage`}
            columnKey="drop_percentage"
            description={PriceDropTooltip.MERCHANT_DROPPED_PERCENTAGE}
            align="center"
          >
            {({ row }) => this.renderMerchantDroppedPercentageField(row)}
          </Table.Column>
        )}

        {showLastPriceDrop && (
          <Table.Column
            title={i`Last Price Drop to`}
            columnKey="original_localized_price_max"
            align="left"
          >
            {({ row }) => this.renderMerchantDroppedPrice(row)}
          </Table.Column>
        )}

        {showLastPriceDrop && (
          <Table.Column
            title={i`Last Price Drop %`}
            columnKey="new_localized_price_min"
            align="left"
          >
            {({ row }) => this.renderMerchantDroppedPercentage(row)}
          </Table.Column>
        )}

        {showGMVGain && (
          <Table.Column
            title={i`GMV Gain`}
            columnKey="gmv_gain"
            description={gmvGainDescription}
            align={"right"}
            noDataMessage={this.renderGMVGainUpdating}
          >
            {({ row }) => this.renderGMVGain(row)}
          </Table.Column>
        )}

        {showImpressionGain && (
          <Table.Column
            title={i`Impression Gain`}
            columnKey="impression_gain"
            description={impressionsGainDescription}
            align={"right"}
            noDataMessage={this.renderImpressionGainUpdating}
          >
            {({ row }) => this.renderImpressionGain(row)}
          </Table.Column>
        )}

        {showExpireTime && (
          <Table.Column
            title={i`Expiry`}
            columnKey="expire_datetime_str"
            description={PriceDropTooltip.OFFER_EXPIRY}
          >
            {({ row }) => this.renderExpiryField(row)}
          </Table.Column>
        )}

        {showExpireDate && (
          <Table.Column
            title={i`Date Expired`}
            columnKey="expire_datetime_str"
            align="left"
            width={120}
          >
            {({ row }) => this.renderDateExpired(row)}
          </Table.Column>
        )}

        {showSuggestedPrice && (
          <Table.Column
            title={i`Suggested Price Drop`}
            columnKey="min_drop_percentage"
            description={PriceDropTooltip.SUGGESTED_PRICE_DROP}
          >
            {({ row }) => this.renderSuggestedPriceField(row)}
          </Table.Column>
        )}

        {showAutoRenew && (
          <Table.Column
            title={i`Status`}
            columnKey="end_date_str"
            align="left"
            width={200}
          >
            {({ row }) => this.renderDaysUntilAutoRenew(row)}
          </Table.Column>
        )}

        {showAutoRenew && (
          <Table.Column
            title={ci18n("PriceDrop campaign auto renew", "Auto Renew")}
            columnKey="auto_renew"
            align="left"
            width={120}
          >
            {({ row }) => this.renderAutoRenewWithPopover(row)}
          </Table.Column>
        )}
      </Table>
    );
  }
}

export default PriceDropImprBoostTable;
