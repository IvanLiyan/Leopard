import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* External Libraries */
import _ from "lodash";
import moment from "moment/moment";
import numeral from "numeral";
import wishExpressBadge from "@assets/img/wish_express_badge.png";

/* Lego Components */
import { AlertList } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { merchantpage_DEPRECATED } from "@toolkit/DEPRECATED";
import * as dimen from "@toolkit/lego-legacy/dimen";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { getCountryName, Flags1x1 } from "@toolkit/countries";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import WECashBackLabel from "@merchant/component/wish-express/performance/WECashBackLabel";
import WECountryPerformance from "@merchant/component/wish-express/performance//WECountryPerformance";
import WEMerchantGlobalStats from "@merchant/component/wish-express/performance/WEMerchantGlobalStats";
import OldCountryPager from "@merchant/component/wish-express/CountryPager";
import { WishExpressReApplyModal } from "@merchant/component/wish-express/re-application/WishExpressReApplyModal";

/* Toolkit */
import { isGMVEstimated } from "@toolkit/wish-express/gmv-currency-conversion";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import WishExpressStore from "@merchant/stores/WishExpressStore";
import { AlertType } from "@ContextLogic/lego";
import { CountryType } from "@merchant/component/wish-express/CountryPager";
import { WEMerchantPerformanceType } from "@merchant/component/wish-express/performance/WEMerchantStats";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type BaseProps = any;

type WishExpressPerformancePageProps = BaseProps & {
  readonly state: number;
  readonly we_countries: ReadonlyArray<CountryType>;
  readonly country_blocks: ReadonlyArray<unknown> | null | undefined;
  readonly aggregate_series: ReadonlyArray<unknown> | null | undefined;
  readonly we_late_held_off_count: number;
  readonly suspended?: boolean;
  readonly can_reapply?: boolean;
  readonly fake_passed?: boolean;
  readonly show_removed?: boolean;
  readonly show_rebate_earned?: boolean;
  readonly show_v4_rebate_deadline?: boolean;
  readonly wish_express_rebate: string | null | undefined;
  readonly recent_penalized_index: number | null | undefined;
  readonly recent_app:
    | {
        [key: string]: any;
      }
    | null
    | undefined;
  readonly merch_csv_s_date: number;
  readonly default_timestamp: number;
};

@merchantpage_DEPRECATED
@observer
export default class WishExpressPerformancePage extends Component<
  WishExpressPerformancePageProps
> {
  @observable
  merchSelectedCurrency: string = this.props.show_currency_buttons
    ? this.props.merchant_source_currency
    : "USD";

  @observable
  prodSelectedCurrency: string = this.props.show_currency_buttons
    ? this.props.merchant_source_currency
    : "USD";

  get wishExpressStore(): WishExpressStore {
    return AppStore.instance().wishExpressStore;
  }

  @computed
  get banStatusAlert(): AlertType | null | undefined {
    const {
      wishExpressStore: { eligibleApplicationCountries },
    } = AppStore.instance();
    const { activeBans } = this.wishExpressStore;

    if (!activeBans || Object.keys(activeBans).length == 0) {
      return null;
    }

    if (
      eligibleApplicationCountries == null ||
      eligibleApplicationCountries.length == 0
    ) {
      return null;
    }
    const countryList = eligibleApplicationCountries
      .filter((countryCode) => getCountryName(countryCode).trim().length > 0)
      .map((countryCode) => {
        const ban = activeBans[countryCode];
        const reapplicationTime = moment.unix(ban.reapplication_date);
        return `${getCountryName(ban.country_code)} ${formatDatetimeLocalized(
          reapplicationTime,
          "MM-DD-YYYY"
        )}`;
      })
      .join(", ");

    const now = moment();
    const canReapply = Object.keys(activeBans).some((countryCode) => {
      const ban = activeBans[countryCode];
      return moment.unix(ban.reapplication_date).isBefore(now);
    });

    let link: any = null;
    if (canReapply) {
      link = {
        text: i`Click here to reapply.`,
        onClick: () => {
          new WishExpressReApplyModal().render();
        },
      };
    }

    return {
      title:
        i`Your store has been blocked from shipping Wish Express ` +
        i`to the following countries.`,
      text:
        i`You are eligible to reapply after ` +
        i`the dates indicated: ${countryList}.`,
      sentiment: "negative",
      link,
    };
  }

  @computed
  get witheldPenalyAlert(): AlertType | null | undefined {
    const { we_late_held_off_count: witheldOrderCount } = this.props;
    if (!witheldOrderCount) {
      return null;
    }

    return {
      text:
        i`You store has very late orders. Orders more than 5 ` +
        i`business days late will be withheld.`,
      sentiment: "warning",
      link: {
        text: i`Click here to view non-compliant orders.`,
        url: "/penalties/orders?fine_types=23",
      },
    };
  }

  @computed
  get hasLateOrderPenalty(): boolean {
    const stat = this.pendingLateOrderPenaltyStat;
    return (
      stat != null &&
      stat.wish_express_penalty != null &&
      stat.wish_express_penalty > 0
    );
  }

  @computed
  get lateOrderPenaltyAlert(): AlertType | null | undefined {
    const stat = this.pendingLateOrderPenaltyStat;
    if (!stat || stat.wish_express_penalty <= 0) {
      return null;
    }

    return {
      text:
        i`Your store has non-compliant orders from ${stat.start_date_str} to ${stat.end_date_str}, ` +
        i`fine will be ${numeral(stat.wish_express_penalty)
          .format("$0,0.00")
          .toString()}.`,
      sentiment: "negative",
      link: {
        text: i`Click here to view non-compliant orders.`,
        url: "/wish-express-penalty",
      },
    };
  }

  @computed
  get fineReportAlert(): AlertType | null | undefined {
    const {
      hasLateOrderPenalty,
      wishExpressStore: { isApprovedForWishExpress },
    } = this;
    if (!isApprovedForWishExpress) {
      return null;
    }

    if (!hasLateOrderPenalty) {
      return null;
    }

    return {
      text: i`View the latest fine report`,
      sentiment: "info",
      link: {
        text: i`View report`,
        url: "/wish-express-penalty",
      },
    };
  }

  @computed
  get blockedAlert(): AlertType | null | undefined {
    const {
      wishExpressStore: { expressState },
    } = this;
    if (expressState != "SUSPENDED") {
      return null;
    }

    return {
      text: i`Your store is currently blocked from Wish Express`,
      sentiment: "negative",
      link: {
        text: i`View Infractions`,
        url: "/warning/awaiting_merchant",
      },
    };
  }

  @computed
  get applicationStatusAlert(): AlertType | null | undefined {
    const application = this.wishExpressStore.recentApplication;
    if (!application) {
      return null;
    }

    const createdTime = moment.unix(application.created_time);
    const createdDaysAgo = moment().diff(createdTime, "d");
    if (createdDaysAgo >= 14) {
      return null;
    }

    if (application.status_name === "PENDING") {
      if (
        application.wish_express_countries &&
        application.wish_express_countries.length > 0
      ) {
        const firstFour = application.wish_express_countries.slice(0, 4);
        const remainingText =
          application.wish_express_countries.length > 4
            ? ` + ${application.wish_express_countries.length - 4} `
            : "";
        return {
          text:
            i`Your Wish Express application is in review for the ` +
            i`following countries: ` +
            i`${firstFour.join(", ") + " " + remainingText}`,
          sentiment: "info",
        };
      }

      return {
        text: i`Your recent application to Wish Express is being reviewed`,
        sentiment: "info",
      };
    } else if (application.status_name === "APPROVED") {
      if (
        application.approved_countries &&
        application.approved_countries.length > 0
      ) {
        return {
          text:
            i`Your recent application to Wish Express was ` +
            i`approved in the following ` +
            i`countries: ${application.approved_countries.join(", ")}`,
          sentiment: "positive",
        };
      }

      return {
        text: i`Your recent application to Wish Express was approved!`,
        sentiment: "positive",
      };
    } else if (application.status_name === "REJECTED") {
      const rejected = application.wish_express_countries.join(", ");
      return {
        text:
          i`Your recent application to Wish Express ${rejected} was ` +
          i`rejected for the following reason: ${application.decline_reason_text}`,
        sentiment: "negative",
      };
    }

    return null;
  }

  @computed
  get alerts(): ReadonlyArray<AlertType | null | undefined> {
    return [
      this.witheldPenalyAlert,
      this.lateOrderPenaltyAlert,
      this.fineReportAlert,
      this.blockedAlert,
      this.applicationStatusAlert,
      this.banStatusAlert,
    ];
  }

  @computed
  get styles() {
    const cashBackKeyframes = {
      from: {
        opacity: 0,
        transform: "translateX(-10px)",
      },

      to: {
        opacity: 1,
        transform: "translateX(0)",
      },
    };

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: `0px ${dimen.pageGuideX}px ${dimen.pageGuideBottom}px ${dimen.pageGuideX}px`,
        backgroundColor: colors.pageBackground,
      },
      pager: {
        boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.2)",
      },
      header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "10px 0px 30px 0px",
        pointer: "default",
      },
      logo: {
        width: 33,
        height: 33,
        marginRight: 10,
        opacity: 0.9,
      },
      title: {
        fontSize: 25,
        fontWeight: fonts.weightMedium,
        userSelect: "none",
        color: colors.black,
        marginRight: 15,
      },
      sectionTitle: {
        fontSize: 17,
        marginBottom: 18,
        userSelect: "none",
        cursor: "default",
      },
      alerts: {
        marginBottom: 30,
      },
      cashBack: {
        animationName: [cashBackKeyframes],
        animationDuration: "150ms",
      },
    });
  }

  convertToMerchantPerformance(data: {
    [metricKey: string]: any;
  }): WEMerchantPerformanceType {
    const {
      merchant_currency_migration_date: merchantCurrencyMigrationDate,
      merchant_source_currency: merchantSourceCurrency,
      show_currency_buttons: showCurrencyButtons,
    } = this.props;
    const endDate = moment(data.end_date_str, "MM-DD-YYYY");

    // Show tracking after 7 days
    const showTracking = moment().diff(endDate, "days") >= 7;

    const dateRange: string = (() => {
      const startDate = data.start_date_str.substring(0, 5).replace("-", "/");
      const endate = data.end_date_str.substring(0, 5).replace("-", "/");
      return `${startDate} - ${endate}`;
    })();

    const orderCount: number | null | undefined = data.wish_express_order_count;

    let gmv = 0;
    if (data.wish_express_cost) {
      gmv = data.wish_express_cost_currency_dict
        ? data.wish_express_cost_currency_dict[this.merchSelectedCurrency]
        : data.wish_express_cost;
      if (
        data.total_m_txn_cost != null &&
        data.total_m_txn_cost < data.wish_express_cost
      ) {
        gmv = data.total_m_txn_cost_currency_dict
          ? data.total_m_txn_cost_currency_dict[this.merchSelectedCurrency]
          : data.total_m_txn_cost;
      }
    } else if (data.wish_express_total_m_txn_cost) {
      gmv = data.wish_express_total_m_txn_cost_currency_dict
        ? data.wish_express_total_m_txn_cost_currency_dict[
            this.merchSelectedCurrency
          ]
        : data.wish_express_total_m_txn_cost;
      if (
        data.total_m_txn_cost != null &&
        data.total_m_txn_cost < data.wish_express_total_m_txn_cost
      ) {
        gmv = data.total_m_txn_cost_currency_dict
          ? data.total_m_txn_cost_currency_dict[this.merchSelectedCurrency]
          : data.total_m_txn_cost;
      }
    }

    let gmvStr = formatCurrency(gmv, this.merchSelectedCurrency);
    if (
      showCurrencyButtons &&
      isGMVEstimated({
        startDateStr: data.start_date_str,
        merchantCurrencyMigrationDate,
        merchantSourceCurrency,
        selectedCurrency: this.merchSelectedCurrency,
      })
    ) {
      gmvStr += "*";
    }

    const avgConfirmedFulfillmentTime: number | null | undefined = (() => {
      if (
        showTracking &&
        data.wish_express_confirm_time != null &&
        data.wish_express_valid_count > 0
      ) {
        return data.wish_express_confirm_time / data.wish_express_valid_count;
      }
    })();

    const validTrackingRate: number | null | undefined = (() => {
      if (
        showTracking &&
        data.wish_express_valid_count != null &&
        data.wish_express_shipped_count > 0
      ) {
        return data.wish_express_valid_count / data.wish_express_shipped_count;
      }
    })();

    const confirmedDeliveryRate: number | null | undefined = (() => {
      if (
        showTracking &&
        data.wish_express_delivered_count != null &&
        data.wish_express_shipped_count > 0
      ) {
        return (
          data.wish_express_delivered_count / data.wish_express_shipped_count
        );
      }
    })();

    const avgWorkingDaysTillArrival: number | null | undefined = (() => {
      if (
        showTracking &&
        data.wish_express_bus_day_time != null &&
        data.wish_express_delivered_count > 0
      ) {
        return (
          data.wish_express_bus_day_time / data.wish_express_delivered_count
        );
      }
    })();

    const workingDaysTillArrival95: number | null | undefined = (() => {
      if (showTracking && data.wish_express_shipped_count != null) {
        return data.wish_express_bus_day_95;
      }
    })();

    const lateArrivalRate: number | null | undefined = (() => {
      if (showTracking && data.wish_express_shipped_count > 0) {
        return Math.min(
          (data.wish_express_late_count || 0) / data.wish_express_shipped_count,
          1
        );
      }
    })();

    const refundRatio30: number | null | undefined = (() => {
      if (
        data.wish_express_refunds_30 != null &&
        data.wish_express_orders_30 > 0
      ) {
        return data.wish_express_refunds_30 / data.wish_express_orders_30;
      }
    })();

    const shippingRefundRate30: number | null | undefined = (() => {
      if (
        data.wish_express_shipping_refunds_30 != null &&
        data.wish_express_orders_30 > 0
      ) {
        return (
          data.wish_express_shipping_refunds_30 / data.wish_express_orders_30
        );
      }
    })();

    const cashBack = data.weekly_rebate_earned || 0;

    const prefCancellationRate: number | null | undefined = (() => {
      if (
        showTracking &&
        data.wish_express_order_count != null &&
        data.wish_express_order_count > 0
      ) {
        const cancelCount: number | null | undefined =
          data.wish_express_cancel_count ||
          data.wish_express_prefulfill_cancels;
        if (cancelCount != null) {
          return cancelCount / data.wish_express_order_count;
        }
      }
    })();

    const startDateStr = data.start_date_str;

    return {
      gmv,
      gmvStr,
      cashBack,
      startDateStr,
      dateRange,
      orderCount,
      refundRatio30,
      lateArrivalRate,
      validTrackingRate,
      prefCancellationRate,
      shippingRefundRate30,
      confirmedDeliveryRate,
      workingDaysTillArrival95,
      avgWorkingDaysTillArrival,
      avgConfirmedFulfillmentTime,
    };
  }

  @computed
  get globalMerchantSeries(): ReadonlyArray<WEMerchantPerformanceType> {
    const { aggregate_series: aggregateSeries } = this.props;
    // if you find this please fix the any types (legacy)
    const data = (aggregateSeries || []).map((week: any) =>
      this.convertToMerchantPerformance(week)
    );

    data.reverse();
    return data;
  }

  @computed
  get countries(): ReadonlyArray<CountryType> {
    const { we_countries: weCountries } = this.props;
    return [
      {
        cc: "WRLD",
        name: i`Global`,
        flagUrl: Flags1x1.d,
      },
      ...weCountries,
    ].map((c) => {
      if (c.cc === "GB") {
        c.name = i`United Kingdom`;
      }
      return c;
    });
  }

  @computed
  get countryBlocks(): {
    [countryCode: string]: any | null | undefined;
  } {
    const { country_blocks: countryBlocks } = this.props;
    return countryBlocks || {};
  }

  @computed
  get pendingLateOrderPenaltyStat() {
    let series = (window as any).pageParams.aggregate_series || [];

    const OneDaySecs = 60 * 60 * 24;
    const now = new Date().getTime() / 1000;

    //Getting recent penalized date
    const day = new Date(now * 1000).getDay();
    const mondayTime = now - (day - 1) * OneDaySecs;
    const rTime = mondayTime - OneDaySecs * 7 * 4;
    const rDate = new Date(rTime * 1000);
    const rDateStr = rDate.toDateString();
    // if you find this please fix the any types (legacy)
    series = series.filter((stat: any) => {
      const dateStr = new Date(stat.epoch).toDateString();
      return stat && !!stat.wish_express_penalty && rDateStr == dateStr;
    });

    if (series.length === 0) {
      return null;
    }

    series = _.sortBy(series, (stat) => -1 * stat.epoch);

    const latestStat = series[0];
    if (!latestStat.wish_express_penalty) {
      return null;
    }

    return latestStat;
  }

  getCountrySeries(countryCode: string) {
    const { aggregate_series: aggregateSeries } = this.props;
    // if you find this please fix the any types (legacy)
    const data = (aggregateSeries || []).map((weekData: any) =>
      this.getSeries({ countryCode, weekData })
    );

    data.reverse();
    return data;
  }

  getSeries({
    countryCode,
    weekData,
  }: {
    countryCode: string;
    weekData: {
      [metricKey: string]: any;
    };
  }): ReadonlyArray<WEMerchantPerformanceType> {
    const merchantCountryPerformance = {
      start_date_str: weekData.start_date_str,
      end_date_str: weekData.end_date_str,
      wish_express_order_count: (weekData.we_order_count_country || {})[
        countryCode
      ],
      wish_express_valid_count: (weekData.we_valid_count_country || {})[
        countryCode
      ],
      wish_express_shipped_count: (weekData.we_shipped_count_country || {})[
        countryCode
      ],
      wish_express_confirm_time: (weekData.we_confirm_time_country || {})[
        countryCode
      ],
      wish_express_delivered_count: (weekData.we_delivered_count_country || {})[
        countryCode
      ],
      wish_express_delivery_time: (weekData.we_delivery_time_country || {})[
        countryCode
      ],
      wish_express_delivery_95: (weekData.we_bus_day_95_country || {})[
        countryCode
      ],
      wish_express_bus_day_time: (weekData.we_bus_day_time_country || {})[
        countryCode
      ],
      wish_express_bus_day_95: (weekData.we_bus_day_95_country || {})[
        countryCode
      ],
      wish_express_late_count: (weekData.we_late_count_country || {})[
        countryCode
      ],
      wish_express_orders_30: (weekData.we_orders_30_country || {})[
        countryCode
      ],
      wish_express_refunds_30: (weekData.we_refunds_30_country || {})[
        countryCode
      ],
      // eslint-disable-next-line max-len
      wish_express_shipping_refunds_30: (weekData.we_shipping_refunds_30_country ||
        {})[countryCode],
      wish_express_cancel_count: (weekData.we_cancel_count_country || {})[
        countryCode
      ],
      wish_express_cost: (weekData.we_cost_country || {})[countryCode],
    };
    return this.convertToMerchantPerformance(merchantCountryPerformance) as any;
  }

  @computed
  get showRebate(): boolean {
    const {
      show_rebate_earned: showRebateEarned,
      wish_express_rebate: wishExpressRebate,
    } = this.props;
    return showRebateEarned && wishExpressRebate.trim().length > 0;
  }

  @computed
  get orderedCountries(): ReadonlyArray<CountryType> {
    const active: Array<CountryType> = [];
    const inactive: Array<CountryType> = [];
    const activeCountries = this.activeCountries;
    this.countries.forEach((country) => {
      if (activeCountries.includes(country.cc)) {
        active.push(country);
      } else {
        inactive.push(country);
      }
    });

    return [...active, ...inactive];
  }

  @computed
  get activeCountries(): ReadonlyArray<string> {
    const countries = this.countries
      .filter((country) => {
        const series = this.getCountrySeries(country.cc);

        return Object.values(series).some((week: any) => week.orderCount > 0);
      })
      .map((_) => _.cc);

    return ["WRLD", ...countries];
  }

  changeMerchSelectedCurrency = (currency: string) => {
    this.merchSelectedCurrency = currency;
  };

  changeProdSelectedCurrency = (currency: string) => {
    this.prodSelectedCurrency = currency;
  };

  renderAlerts() {
    const alerts = this.alerts.filter((_) => !!_);
    if (alerts.length === 0) {
      return null;
    }

    return (
      <>
        <section className={css(this.styles.sectionTitle)}>Messages</section>
        <AlertList className={css(this.styles.alerts)} alerts={alerts} />
      </>
    );
  }

  render() {
    const {
      merchant_currency_migration_date: merchantCurrencyMigrationDate,
      merchant_source_currency: merchantSourceCurrency,
      show_currency_buttons: showCurrencyButtons,
      show_removed: showRemoved,
      wish_express_rebate: wishExpressRebate,
      currency_conversion_rate: currencyConversionRate,
    } = this.props;
    const {
      dimenStore: { screenInnerWidth },
    } = AppStore.instance();

    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.header)}>
          <img
            alt="wish express logo"
            src={wishExpressBadge}
            className={css(this.styles.logo)}
          />
          <section className={css(this.styles.title)}>Wish Express</section>
          {this.showRebate && (
            <WECashBackLabel
              className={css(this.styles.cashBack)}
              cashBack={wishExpressRebate}
            />
          )}
        </div>

        {this.renderAlerts()}

        <div className={css(this.styles.sectionTitle)}>Performance</div>
        <OldCountryPager
          key={`page-width-${screenInnerWidth}`}
          className={css(this.styles.pager)}
          activeCountries={this.activeCountries}
        >
          {this.orderedCountries.map((country) => {
            if (country.cc === "WRLD") {
              return (
                <WEMerchantGlobalStats
                  key={country.name}
                  country={country}
                  series={this.globalMerchantSeries}
                  showRebate={this.showRebate}
                  showRemovedProductsTab={!!showRemoved}
                  merchCsvDate={(window as any).pageParams.merch_csv_s_date}
                  defaultTimestamp={
                    (window as any).pageParams.default_timestamp
                  }
                  aggregateSeries={(window as any).pageParams.aggregate_series}
                  merchantSourceCurrency={merchantSourceCurrency}
                  changeMerchSelectedCurrency={this.changeMerchSelectedCurrency}
                  changeProdSelectedCurrency={this.changeProdSelectedCurrency}
                  merchSelectedCurrency={this.merchSelectedCurrency}
                  prodSelectedCurrency={this.prodSelectedCurrency}
                  showCurrencyButtons={showCurrencyButtons}
                  merchantCurrencyMigrationDate={merchantCurrencyMigrationDate}
                  currencyConversionRate={currencyConversionRate}
                />
              );
            }
            return (
              <WECountryPerformance
                key={country.name}
                country={country}
                showRebate={this.showRebate}
                countryBlock={this.countryBlocks[country.cc]}
                series={this.getCountrySeries(country.cc)}
              />
            );
          })}
        </OldCountryPager>
      </div>
    );
  }
}
