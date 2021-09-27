import React, { useMemo, useState, useEffect, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import moment, { unitOfTime } from "moment/moment";

/* Lego Components */
import { Table, Text } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import ModalHeader from "@merchant/component/core/modal/ModalHeader";
import Modal from "@merchant/component/core/modal/Modal";
import { CurrencyInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { DayPickerInput } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";
import { Checkbox } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { Layout } from "@ContextLogic/lego";

/* External Libraries */
import numeral from "numeral";

/* Validators */
import { MinMaxValueValidator } from "@toolkit/validators";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { PriceDropConstants } from "@toolkit/price-drop/constants";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { useRequest } from "@toolkit/api";

/* Type Imports */
import { CollectionsBoostSearchQuery } from "@merchant/api/collections-boost";
import Campaign from "@merchant/model/collections-boost/Campaign";

/* Merchant Store */
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useUserStore } from "@merchant/stores/UserStore";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const TEXT_WIDTH = "200px";

export type EditCampaignModalProps = BaseProps & {
  readonly campaign: Campaign;
  readonly maxAllowedSpending: number;
  readonly minStartDate: Date;
  readonly maxStartDate: Date;
  readonly duration: number;
  readonly isCreate: boolean;
};

export type EditCampaignModalContextProps = BaseProps &
  EditCampaignModalProps & {
    readonly onClose: () => unknown;
  };

export const formatDate = (date: Date): string => {
  if (!date) {
    return "";
  }
  const mdate = moment(date);
  return mdate.format("YYYY-MM-DD");
};

export const getMonday = (date: Date): Date => {
  return moment(date)
    .startOf("isoweek" as unitOfTime.StartOf)
    .toDate();
};

const EditCampaignModalContent = (props: EditCampaignModalContextProps) => {
  const {
    campaign: {
      searchQueries,
      collectionId,
      name,
      campaignId,
      startDate,
      isAutoRenew,
      localizedCurrency,
      conversionRate,
      conversionTableId,
      campaignDropPercentage,
      productsWithOverlappedPriceDropRecords,
      campaignPriceDropEnabled,
    },
    onClose,
    maxAllowedSpending,
    minStartDate,
    maxStartDate,
    duration,
    isCreate,
  } = props;

  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const { merchantId } = useUserStore();
  const logger = useLogger("COLLECTIONS_BOOST_UI");
  const { locale } = useLocalizationStore();

  const [merchantInfoResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostMerchantInfo({})
  );
  const merchantInfoStats = merchantInfoResponse?.data;
  const merchantAccountConversionRate =
    merchantInfoStats?.current_conversion_rate || 1;
  const merchantAccountConversionTableId =
    merchantInfoStats?.current_conversion_table_id || "";
  const merchantAccountPolicyRateMap = merchantInfoStats?.policy_rate_map;
  const merchantAccountPreferredCurrency =
    merchantInfoStats?.preferred_currency || "USD";

  const currency = isCreate
    ? merchantAccountPreferredCurrency
    : localizedCurrency;

  const currencyRate =
    !isCreate ||
    (merchantAccountPreferredCurrency == localizedCurrency && campaignId)
      ? conversionRate
      : merchantAccountConversionRate;

  const currencyTableId =
    !isCreate ||
    (merchantAccountPreferredCurrency == localizedCurrency && campaignId)
      ? conversionTableId
      : merchantAccountConversionTableId;

  const allowedSpending =
    (maxAllowedSpending / merchantAccountConversionRate) * currencyRate;

  const policyRate = merchantAccountPolicyRateMap
    ? merchantAccountPolicyRateMap[currency]
    : 1;

  const priceDropEnabled = merchantInfoStats?.price_drop_enabled;

  const [campaignSearchQueries, setCampaignSearchQueries] = useState<
    Array<CollectionsBoostSearchQuery>
  >(searchQueries);

  const [
    campaignPriceDropPercentage,
    setCampaignPriceDropPercentage,
  ] = useState<number>(campaignDropPercentage);

  const [bidNotifierSet, setBidNotifierSet] = useState<Set<string>>(new Set());

  const showPriceDropModule = isCreate
    ? priceDropEnabled
    : priceDropEnabled && campaignPriceDropEnabled;

  const onInitModalLoaded = useCallback(() => {
    // Log view
    logger.info({
      merchant_id: merchantId,
      action: "view edit campaign modal",
      campaignId,
      collectionId,
    });

    // Pre-fill bid
    const preFilledSearchQueries = searchQueries.map(
      (searchQuery: CollectionsBoostSearchQuery) => {
        const convertedBid =
          merchantAccountPreferredCurrency == localizedCurrency
            ? searchQuery.bid
            : parseFloat(
                ((searchQuery.bid / conversionRate) * policyRate).toFixed(2)
              );
        const bid =
          campaignId && searchQuery.bid ? convertedBid : 1.0 * policyRate;
        return {
          search_term: searchQuery.search_term,
          bid,
          rawBid: bid.toString(),
        };
      }
    );
    setCampaignSearchQueries(preFilledSearchQueries);
  }, [
    searchQueries,
    campaignId,
    collectionId,
    merchantId,
    logger,
    policyRate,
    conversionRate,
    localizedCurrency,
    merchantAccountPreferredCurrency,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onInitModalLoaded, [merchantInfoStats]);

  const [campaignStartDate, setCampaignStartDate] = useState<Date>(startDate);

  const [campaignIsAutoRenew, setCampaignIsAutoRenew] = useState<boolean>(
    isAutoRenew
  );

  const [getSearchTermThresholdBidResponse] = useRequest(
    collectionsBoostApi.getSearchTermThresholdBid({
      search_queries: JSON.stringify(searchQueries),
      start_date: formatDate(campaignStartDate) || "",
    })
  );

  const finalCampaignDropPercentage = () => {
    if (
      campaignPriceDropPercentage >= 5 &&
      campaignPriceDropPercentage <= 100
    ) {
      return campaignPriceDropPercentage;
    }
    return undefined;
  };

  const actionButtonProps = {
    text: isCreate ? i`Create campaign` : i`Edit campaign`,
    onClick: async () => {
      try {
        if (isCreate) {
          await collectionsBoostApi
            .editCollectionsCampaign({
              campaign_id: campaignId,
              collection_id: collectionId,
              search_queries: JSON.stringify(campaignSearchQueries),
              start_date: formatDate(campaignStartDate) || "",
              is_auto_renew: campaignIsAutoRenew,
              conversion_rate: currencyRate,
              conversion_table_id: currencyTableId,
              localized_currency: currency,
              campaign_drop_percentage: finalCampaignDropPercentage(),
            })
            .call();
        } else {
          await collectionsBoostApi
            .editCollectionsCampaign({
              campaign_id: campaignId,
              collection_id: collectionId,
              search_queries: JSON.stringify(campaignSearchQueries),
              start_date: formatDate(campaignStartDate) || "",
              is_auto_renew: campaignIsAutoRenew,
              campaign_drop_percentage: finalCampaignDropPercentage(),
            })
            .call();
        }
      } catch (e) {
        return;
      }
      navigationStore.navigate("/collection-boost/list/campaigns");
    },
  };

  const startDateField = useMemo(() => {
    const dayPickerProps = {
      selectedDays: campaignStartDate,
      disabledDays: [{ before: minStartDate }, { after: maxStartDate }],
    };
    return (
      <HorizontalField
        title={i`Start Date (Monday only)`}
        centerTitleVertically
        style={styles.horizontalField}
        popoverContent={i`This is a required field. Start date of the campaign.`}
        titleWidth={200}
      >
        <DayPickerInput
          value={campaignStartDate}
          noEdit
          formatDate={formatDate}
          dayPickerProps={dayPickerProps}
          onDayChange={(date: Date) => {
            setCampaignStartDate(getMonday(date));
          }}
          locale={locale}
        />
      </HorizontalField>
    );
  }, [
    minStartDate,
    maxStartDate,
    campaignStartDate,
    styles.horizontalField,
    locale,
  ]);

  const endDateField = useMemo(() => {
    const mStartDate = moment(campaignStartDate);
    const mDuration = moment.duration(duration, "days");
    const endDate = mStartDate.clone().add(mDuration).toDate();
    return (
      <HorizontalField
        title={i`End Date`}
        centerTitleVertically
        style={styles.horizontalField}
        popoverContent={i`End date of the campaign.`}
        titleWidth={200}
      >
        <DayPickerInput
          value={endDate}
          noEdit
          disabled
          formatDate={formatDate}
          locale={locale}
        />
      </HorizontalField>
    );
  }, [campaignStartDate, duration, styles.horizontalField, locale]);

  const autoRenewField = useMemo(() => {
    return (
      <HorizontalField
        title={i`Auto Renew`}
        centerTitleVertically
        style={styles.horizontalField}
        popoverContent={
          i`A new campaign will be automatically running ` +
          i`to continue boost your collection after this ` +
          i`campaign ends. You can change this option later ` +
          i`in Manage Campaigns page.`
        }
        titleWidth={200}
      >
        <div className={css(styles.checkBox)}>
          <Checkbox
            checked={!!campaignIsAutoRenew}
            onChange={(checked: boolean) => {
              setCampaignIsAutoRenew(checked);
            }}
          />
          <span> Auto renew after completion </span>
        </div>
      </HorizontalField>
    );
  }, [campaignIsAutoRenew, styles.horizontalField, styles.checkBox]);

  const updateBidNotifierSet = (searchTerm: string, bid: number) => {
    const response = getSearchTermThresholdBidResponse?.data?.threshold_dict;
    if (response && searchTerm in response && response[searchTerm] > bid) {
      bidNotifierSet.add(searchTerm);
    } else {
      bidNotifierSet.delete(searchTerm);
    }
    setBidNotifierSet(bidNotifierSet);
  };

  const renderBidField = (row: CollectionsBoostSearchQuery) => {
    return (
      <div className={css(styles.currencyField)}>
        <CurrencyInput
          padding={2}
          currencyCode={currency}
          value={row.rawBid || ""}
          onChange={({ text }: OnTextChangeEvent) => {
            const rawQueries = campaignSearchQueries.map(
              (campaignSearchQuery: CollectionsBoostSearchQuery) => {
                return campaignSearchQuery.search_term === row.search_term
                  ? {
                      search_term: campaignSearchQuery.search_term,
                      bid: parseFloat(text) || NaN,
                      rawBid: text,
                    }
                  : campaignSearchQuery;
              }
            );
            setCampaignSearchQueries(rawQueries);
            updateBidNotifierSet(
              row.search_term,
              parseFloat(text) / currencyRate
            );
          }}
          placeholder={i`Not promote`}
        />{" "}
        {bidNotifierField(row.search_term)}
      </div>
    );
  };

  const renderDropPercentage = (
    priceDropRecord: collectionsBoostApi.CollectionsBoostPriceDropExistingOverlap
  ) => {
    const dropPercentage = priceDropRecord.drop_percentage;
    if (dropPercentage > 0) {
      return (
        <Layout.FlexRow alignItems="center">
          <Text weight="semibold">
            {ci18n(
              "placeholder is a sale/discount",
              "%1$s OFF",
              numeral(dropPercentage / 100.0).format("0%")
            )}
          </Text>
        </Layout.FlexRow>
      );
    }
    return (
      <Layout.FlexRow alignItems="center">
        <Text weight="semibold">{ci18n("Data not available", "No Data")}</Text>
      </Layout.FlexRow>
    );
  };

  const bidNotifierField = (searchTerm: string): React.ReactNode => {
    if (bidNotifierSet.has(searchTerm)) {
      const response = getSearchTermThresholdBidResponse?.data?.threshold_dict;
      if (response) {
        const bid = response[searchTerm];
        if (bid) {
          return (
            <Info
              style={styles.bidNotifier}
              size={16}
              position="top center"
              sentiment="error"
              popoverContent={
                i`Increase your bid to be ${bid * currencyRate} or higher ` +
                i`to be competitive for this search term for ` +
                i`the start date you provided.`
              }
            />
          );
        }
      }
    }
  };

  const cancelButtonProps = {
    text: i`Cancel`,
    onClick: () => {
      onClose();
    },
  };

  const bidTooltip =
    i`The total cost for your collection to be ` +
    i`boosted for each search term within the campaign's duration.`;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.headerContainer)}>
        <ModalHeader
          title={() => {
            return isCreate
              ? i`Create a CollectionBoost campaign`
              : i`Edit a CollectionBoost campaign`;
          }}
          onClose={onClose}
        />
      </div>
      <div className={css(styles.content)}>
        <HorizontalField
          title={i`Collection Name`}
          centerTitleVertically
          style={styles.horizontalField}
          titleWidth={200}
          popoverContent={i`Collection name will be used for display.`}
        >
          <div className={css(styles.horizontalFieldText)}>{name}</div>
        </HorizontalField>
        {startDateField}
        {endDateField}
        {autoRenewField}
        <HorizontalField
          title={i`Available balance`}
          centerTitleVertically
          style={styles.horizontalField}
          titleWidth={200}
          popoverContent={i`Balance available for you to spend.`}
        >
          <div className={css(styles.horizontalFieldText)}>
            {formatCurrency(allowedSpending, currency)}
          </div>
        </HorizontalField>
        {showPriceDropModule && (
          <HorizontalField
            title={i`Price Drop Percentage (Optional)`}
            centerTitleVertically
            style={styles.horizontalField}
            titleWidth={200}
            popoverContent={
              i`Create Price Drop records with the same drop percentage ` +
              i`for all the products in this campaign during this period. ` +
              i`Existing overlapped Price Drop campaigns will be canceled ` +
              i`once the campaign starts running.`
            }
          >
            <Layout.FlexRow>
              <NumericInput
                style={styles.horizontalFieldNumericInput}
                value={campaignPriceDropPercentage}
                placeholder={i`Enter drop percentage`}
                validators={[
                  new MinMaxValueValidator({
                    minAllowedValue:
                      PriceDropConstants.DEFAULT_MIN_DROP_PERCENTAGE,
                    maxAllowedValue:
                      PriceDropConstants.DEFAULT_MAX_DROP_PERCENTAGE,
                    customMessage: i`Must be between ${PriceDropConstants.DEFAULT_MIN_DROP_PERCENTAGE}% and ${PriceDropConstants.DEFAULT_MAX_DROP_PERCENTAGE}%.`,
                  }),
                ]}
                onChange={({ valueAsNumber }) => {
                  const newValue = Math.min(
                    Math.max(valueAsNumber || 0, 0),
                    100
                  );
                  setCampaignPriceDropPercentage(newValue);
                }}
              />
              <div className={css(styles.dropPercentage)}>% </div>
            </Layout.FlexRow>
          </HorizontalField>
        )}
        {showPriceDropModule &&
          productsWithOverlappedPriceDropRecords.length > 0 && (
            <div>
              <Text style={styles.priceDropText}>
                Some Potential Overlapped PriceDrop Records:
              </Text>
              <Table
                style={styles.priceDropTable}
                data={productsWithOverlappedPriceDropRecords}
                rowHeight={68}
              >
                <Table.Column
                  title={i`Product ID`}
                  columnKey="product_id"
                  align="left"
                  width={200}
                />
                <Table.Column
                  title={i`PriceDrop Record ID`}
                  columnKey="price_drop_record_id"
                  align="left"
                  width={200}
                />
                <Table.Column
                  title={i`Drop Percentage`}
                  columnKey="drop_percentage"
                  align="left"
                  width={200}
                >
                  {({ row }) => renderDropPercentage(row)}
                </Table.Column>
                <Table.Column
                  title={i`Start Date`}
                  columnKey="start_date"
                  align="left"
                  width={100}
                />
                <Table.Column
                  title={i`End Date`}
                  columnKey="end_date"
                  align="left"
                  width={100}
                />
              </Table>
            </div>
          )}
        <Table
          style={styles.bidTable}
          data={campaignSearchQueries}
          rowHeight={68}
        >
          <Table.Column
            title={i`Search Term`}
            columnKey="search_term"
            align="left"
            width={150}
          />
          <Table.Column
            title={i`Bid (min bid is ${formatCurrency(
              1.0 * policyRate,
              currency
            )}, leave blank to not promote)`}
            columnKey="rawBid"
            width={150}
            description={bidTooltip}
          >
            {({ row }) => renderBidField(row)}
          </Table.Column>
        </Table>
      </div>
      <div className={css(styles.footerContainer)}>
        <ModalFooter
          layout="horizontal-centered"
          action={actionButtonProps}
          cancel={cancelButtonProps}
        />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textWhite, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: textWhite,
        },
        horizontalFieldText: {
          width: TEXT_WIDTH,
        },
        horizontalFieldNumericInput: {
          width: "120px",
        },
        horizontalField: {
          margin: "10px 0",
          color: textBlack,
          display: "flex",
          flexDirection: "row",
          marginBottom: "24px",
          justifyContent: "center",
          alignItems: "center",
        },
        bidNotifier: {
          marginLeft: 5,
        },
        currencyField: {
          display: "flex",
          alignItems: "baseline",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "16px 0 80px 0",
        },
        illustration: {
          width: "150px",
          height: "110px",
          marginBottom: "12px",
        },
        title: {
          fontSize: 28,
          fontWeight: fonts.weightBold,
          marginBottom: "12px",
          lineHeight: 1.4,
          color: textBlack,
          textAlign: "center",
        },
        bidTable: {
          margin: "0 80px",
        },
        priceDropTable: {
          margin: "0 80px",
          marginBottom: "24px",
        },
        priceDropText: {
          margin: "0 80px",
          marginBottom: "24px",
          textAlign: "center",
        },
        headerContainer: {
          width: "100%",
        },
        footerContainer: { position: "fixed", bottom: 0, width: "100%" },
        campaignName: {
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
        checkBox: {
          minWidth: 210,
          display: "flex",
          justifyContent: "space-between",
        },
        dropPercentage: {
          fontWeight: fonts.weightBold,
          lineHeight: 1,
          marginLeft: 8,
          marginTop: 14,
        },
      }),
    [textWhite, textBlack]
  );
};

export default class EditCampaignModal extends Modal {
  contentProps: EditCampaignModalProps;

  constructor(props: EditCampaignModalProps) {
    super(() => null);

    this.contentProps = props;

    this.setTopPercentage(0.2);
    this.setWidthPercentage(0.5);
    this.setMaxHeight(650);
  }

  renderContent() {
    const { contentProps } = this;
    return (
      <EditCampaignModalContent
        {...contentProps}
        onClose={() => this.close()}
      />
    );
  }
}
