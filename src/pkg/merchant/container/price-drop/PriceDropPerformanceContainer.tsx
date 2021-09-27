import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";
import { Moment } from "moment/moment";

/* Lego Components */
import { Card, LoadingIndicator, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import PriceDropPerformanceGraph from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";
import PriceDropPerformanceHeader from "@merchant/component/products/price-drop/PriceDropPerformanceHeader";
import PriceDropPerformanceWishSubsidyFields from "@merchant/component/products/price-drop/PriceDropPerformanceWishSubsidyFields";
import PriceDropPerformanceCampaignFields from "@merchant/component/products/price-drop/PriceDropPerformanceCampaignFields";
import PriceDropSuggestionsPendingAction from "@merchant/component/products/price-drop/PriceDropSuggestionsPendingAction";
import PriceDropSuggestionsReset from "@merchant/component/products/price-drop/PriceDropSuggestionsReset";
import PriceDropSuggestionsOngoing from "@merchant/component/products/price-drop/PriceDropSuggestionsOngoing";
import PriceDropSuggestions from "@merchant/component/products/price-drop/PriceDropSuggestions";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";
import { PriceDropTooltip } from "@toolkit/price-drop/tooltip";

import { PriceDropRangeParams } from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";

const DATE_FORMAT = "MM/DD/YYYY";
const PriceDropLogTable = "PRICE_DROP_UI";

const PriceDropPerformanceContainer = () => {
  const { dimenStore, userStore } = useStore();
  const { priceDropRecordId } = usePathParams(
    "/marketplace/price-drop/performance/:priceDropRecordId"
  );

  const priceDropLogger = useLogger(PriceDropLogTable);

  // log
  useEffect(() => {
    priceDropLogger.info({
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      action: PriceDropLoggingActions.PRICE_DROP_PERFORMANCE_PAGE_IMPRESSION,
      price_drop_record_id: priceDropRecordId,
    });
  }, [userStore, priceDropRecordId, priceDropLogger]);

  const styles = useStylesheet();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  // get price drop record
  const priceDropInfoRequest = priceDropApi.getDropPriceBasicInfo({
    price_drop_record_id: priceDropRecordId,
  });
  const priceDropInfo = priceDropInfoRequest.response?.data;

  if (priceDropInfo == null) {
    return <LoadingIndicator />;
  }
  const {
    price_drop_record: priceDropItem,
    show_gmv_gain: showGMVGain,
  } = priceDropInfo;

  const {
    start_date_str: campaignStartDateStr,
    end_date_str: campaignEndDateStr,
    currency_code: currencyCode,
    trial_start_date_str: trialStartDateStr,
    trial_end_date_str: trialEndDateStr,
    status,
  } = priceDropItem;

  const trialStartDate: Moment | null = trialStartDateStr
    ? moment(trialStartDateStr, DATE_FORMAT)
    : null;
  const trialEndDate: Moment | null = trialEndDateStr
    ? moment(trialEndDateStr, DATE_FORMAT)
    : null;
  const campaignStartDate: Moment | null = campaignStartDateStr
    ? moment(campaignStartDateStr, DATE_FORMAT)
    : null;
  const campaignEndDate: Moment | null = campaignEndDateStr
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
  const params = {
    price_drop_record_id: priceDropRecordId,
    start_date: startDateParam,
    end_date: endDateParam,
  };

  const productPerformanceRequest = priceDropApi.getDropPriceProductPerformance(
    params
  );
  const data = productPerformanceRequest?.response?.data;

  const renderPriceRange = (params: PriceDropRangeParams) => {
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

  const renderSuggestions = () => {
    switch (status) {
      case "PENDING_ACTION":
        return (
          <PriceDropSuggestionsPendingAction
            className={css(styles.section)}
            priceDropItem={priceDropItem}
            renderPriceRange={renderPriceRange}
          />
        );
      case "CAN_RESET":
        return (
          <PriceDropSuggestionsReset
            className={css(styles.section)}
            priceDropItem={priceDropItem}
          />
        );
      case "ON_GOING":
        return (
          <PriceDropSuggestionsOngoing
            className={css(styles.section)}
            priceDropItem={priceDropItem}
          />
        );
      case "EXPIRED":
        return (
          <PriceDropSuggestions
            className={css(styles.section)}
            illustration={"greyoutCoins"}
            content={i`You missed out! Be on the lookout for future Price Drop Offers.`}
          />
        );
      case "ENDED": {
        return (
          <PriceDropSuggestions
            className={css(styles.section)}
            illustration={"greyoutCoins"}
            content={i`This campaign has ended on ${campaignEndDateStr}.`}
          />
        );
      }
      case "MERCHANT_CANCELED": {
        return (
          <PriceDropSuggestions
            className={css(styles.section)}
            illustration={"greyoutCoins"}
            content={i`You canceled the campaign on ${campaignEndDateStr}. Take advantage of future Price Drop offers to increase your sales.`}
          />
        );
      }
      case "WISH_CANCELED":
        return (
          <PriceDropSuggestions
            className={css(styles.section)}
            illustration={"greyoutCoins"}
            content={i`Wish canceled this campaign due to low performance standards.`}
          />
        );
      default:
        return null;
    }
  };

  const impressionGainDescription =
    status === "EXPIRED"
      ? PriceDropTooltip.IMPRESSION_GAIN_EXPIRED_OFFER
      : PriceDropTooltip.IMPRESSION_GAIN;

  const gmvGainDescription =
    status === "EXPIRED"
      ? PriceDropTooltip.GMV_GAIN_EXPIRED_OFFER
      : PriceDropTooltip.GMV_GAIN;

  return (
    <div className={css(styles.root)}>
      <PriceDropPerformanceHeader priceDropItem={priceDropItem} />
      <div
        style={{ paddingRight: pageX, paddingLeft: pageX, paddingBottom: 50 }}
      >
        {(status === "PENDING_ACTION" ||
          status === "CAN_RESET" ||
          status === "EXPIRED") && (
          <PriceDropPerformanceWishSubsidyFields
            className={css(styles.section)}
            priceDropItem={priceDropItem}
            renderPriceRange={renderPriceRange}
            impressionGainDescription={impressionGainDescription}
            gmvGainDescription={gmvGainDescription}
            showGMVGain={showGMVGain}
          />
        )}

        {(status === "CAN_RESET" ||
          status === "ON_GOING" ||
          status === "ENDED" ||
          status === "MERCHANT_CANCELED" ||
          status === "WISH_CANCELED") && (
          <PriceDropPerformanceCampaignFields
            className={css(styles.section)}
            priceDropItem={priceDropItem}
            impressionGainDescription={impressionGainDescription}
            gmvGainDescription={gmvGainDescription}
            hideImpressionAndGMV={status === "CAN_RESET"}
            showGMVGain={showGMVGain}
          />
        )}

        {renderSuggestions()}

        <Text weight="bold" className={css(styles.sectionLabelText)}>
          Performance
        </Text>
        <Card>
          <div className={css(styles.graphTableSection)}>
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
                renderPriceRange={renderPriceRange}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
        sectionLabelText: {
          fontSize: 24,
          margin: `40px 0px 20px 0px`,
          color: palettes.textColors.Ink,
        },
        graphTableSection: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: palettes.textColors.White,
        },
        section: {
          marginTop: 15,
        },
      }),
    []
  );
};

export default observer(PriceDropPerformanceContainer);
