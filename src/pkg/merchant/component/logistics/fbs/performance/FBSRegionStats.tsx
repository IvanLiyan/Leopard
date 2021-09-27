/* eslint-disable filenames/match-regex */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold, proxima } from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { numberOne, numberTwo, numberThree } from "@assets/icons";

/* Merchant Components */
import FBSRegionMap from "@merchant/component/logistics/fbs/performance/FBSRegionMap";
import FBSStatsDateRangeSelector from "@merchant/component/logistics/fbs/performance/FBSStatsDateRangeSelector";
import FBSRegionProductsSold from "@merchant/component/logistics/fbs/performance/FBSRegionProductsSold";
import SimpleStatBox from "@merchant/component/logistics/fbs/performance/SimpleStatBox";

/* Merchant API */
import * as fbsApi from "@merchant/api/fbs";

/* Toolkit */
import { getDateRange } from "@toolkit/fbs";
import { getUSStateNameSafe, getCountryNameSafe } from "@toolkit/fbs";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import { TimePeriod } from "@toolkit/fbs";
import { CountryCode } from "@toolkit/countries";
import { StateCode } from "@ContextLogic/lego/toolkit/states";

export type FBSRegionStatsProps = BaseProps & {
  readonly currency: string;
  readonly dateRangeOptions: ReadonlyArray<Option<TimePeriod>>;
};

const FBSRegionStats = (props: FBSRegionStatsProps) => {
  const { className, style, currency, dateRangeOptions } = props;
  const today = moment();
  const styles = useStyleSheet();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last_7_days");
  const dateRange = getDateRange(timePeriod, today);

  const request = fbsApi.getMerchantStatsByRegion({ stat_type: timePeriod });
  const data = request?.response?.data;

  if (data == null) {
    return (
      <Card className={css(className, style)}>
        <div className={css(styles.cardBody)}>
          <div className={css(styles.header)}>
            <Markdown
              text={i`Performance by region`}
              className={css(styles.performanceTitle)}
            />
          </div>
          <LoadingIndicator />
        </div>
      </Card>
    );
  }

  const countryList: ReadonlyArray<[CountryCode, number]> =
    data.results?.country_list || [];
  const stateList = data.results?.state_list || [];
  const countryDict = data.country_dict || {};
  const stateDict = data.state_dict || {};

  const localizedCountryList = countryList.map<[string, number]>(
    ([country, gmv]: [CountryCode, number]): [string, number] => [
      getCountryNameSafe(country),
      gmv,
    ]
  );
  const localizedStateList = stateList.map<[string, number]>(([state, gmv]) => [
    getUSStateNameSafe(state),
    gmv,
  ]);
  const countryCodeList = countryList.map(([country, gmv]) => country);
  const stateCodeList: ReadonlyArray<StateCode> = stateList.map(
    ([state, gmv]) => state
  );

  const topThreeRegions = [
    ...localizedCountryList.slice(0, 3),
    ...localizedStateList.slice(0, 3),
  ]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  while (topThreeRegions.length < 3) {
    topThreeRegions.push([i`Coming soon`, 0]);
  }

  return (
    <Card className={css(className, style)}>
      <div className={css(styles.cardBody)}>
        <div className={css(styles.header)}>
          <Markdown
            text={i`Performance by region`}
            className={css(styles.performanceTitle)}
          />
          <FBSStatsDateRangeSelector
            setTimePeriod={setTimePeriod}
            timePeriod={timePeriod}
            dateRangeOptions={dateRangeOptions}
          />
        </div>
        <Markdown
          text={i`Top 3 regions`}
          className={css(styles.topThreeText)}
        />
        <div className={css(styles.totals)}>
          {topThreeRegions.map((elem, idx) => {
            const [location, gmv] = elem;
            return (
              <SimpleStatBox
                className={css(
                  styles.statBox,
                  idx < 2 ? styles.statBoxSeparator : null
                )}
                titleIcon={[numberOne, numberTwo, numberThree][idx]}
                title={
                  localizedStateList.includes(elem)
                    ? i`${location}, United States`
                    : location
                }
                value={gmv ? formatCurrency(gmv, currency) : null}
                key={location}
              />
            );
          })}
        </div>
        <div className={css(styles.dottedDivider)} />
        <FBSRegionMap
          dateRange={`${dateRange.startDate} - ${dateRange.endDate}`}
          countryGMVMap={countryDict}
          stateGMVMap={stateDict}
          legendBreakpoints={[0, 500, 1000]}
          currency={currency}
        />
        <div className={css(styles.dottedDivider)} />
      </div>
      <FBSRegionProductsSold
        timePeriod={timePeriod}
        countryCodes={countryCodeList}
        stateCodes={stateCodeList}
      />
    </Card>
  );
};

export default observer(FBSRegionStats);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        cardBody: {
          padding: "24px 24px 0 24px",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        performanceTitle: {
          color: palettes.textColors.Ink,
          fontSize: 24,
          fontWeight: weightBold,
          lineHeight: 1.33,
          fontFamily: proxima,
        },
        topThreeText: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          fontWeight: weightBold,
          lineHeight: 1.4,
          fontFamily: proxima,
          marginTop: 8,
        },
        totals: {
          display: "flex",
          flexDirection: "row",
          marginTop: 20,
        },
        statBox: {
          width: "calc(100% / 3)",
        },
        statBoxSeparator: {
          borderRadius: 4,
          borderRight: "1px dotted rgba(175, 199, 209, 0.5)",
          marginRight: 16,
        },
        dottedDivider: {
          borderTop: "1px dotted rgba(175, 199, 209, 0.5)",
          marginTop: 24,
          marginBottom: 24,
        },
      }),
    []
  );
};
