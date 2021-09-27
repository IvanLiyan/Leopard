import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment, { Moment } from "moment/moment";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FBSHeader from "@merchant/component/logistics/fbs/performance/FBSHeader";
import FBSAllStats from "@merchant/component/logistics/fbs/performance/FBSAllStats";
import FBSRegionStats from "@merchant/component/logistics/fbs/performance/FBSRegionStats";
import WhyFBSTip from "@merchant/component/logistics/fbs/performance/WhyFBSTip";
import WishsPicks from "@merchant/component/logistics/recommendations/wishs-picks/WishsPicks";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import {
  getLastWeekRange,
  getLast90Range,
  getThisYearRange,
  getAllTimeRange,
} from "@toolkit/fbs";

import { Option } from "@ContextLogic/lego";
import { TimePeriod } from "@toolkit/fbs";

const FBSOverviewContainer = () => {
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideX;
  const bannerY = "0px";
  const currency = "USD";
  const today = moment();
  const styles = useStyleSheet();
  const dateRangeOptions = useDateRangeOptions(today);

  return (
    <div className={css(styles.root)}>
      <FBSHeader
        className={css(styles.separation)}
        paddingX={pageX}
        paddingY={bannerY}
        illustration={"fbsPerformanceHeader"}
        maxIllustrationWidth={"40%"}
      />
      <div className={css(styles.section)}>
        <div className={css(styles.title)}>
          <Illustration
            className={css(styles.icon)}
            name={"recomIcon"}
            alt={i`Recommendation Logo`}
          />
          <h3 className={css(styles.sectionHeader)}>Wish's Picks</h3>
        </div>
        <WishsPicks productType="fbs" />
      </div>
      <FBSAllStats
        className={css(styles.content, styles.separation)}
        currency={currency}
        dateRangeOptions={dateRangeOptions}
      />
      <WhyFBSTip className={css(styles.content, styles.separation)} />
      <FBSRegionStats
        className={css(styles.content, styles.separation)}
        currency={currency}
        dateRangeOptions={dateRangeOptions}
      />
    </div>
  );
};

const useStyleSheet = () => {
  const { dimenStore } = useStore();
  const { primary, textBlack } = useTheme();
  const pageX = dimenStore.pageGuideX;
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingBottom: 100,
        },
        separation: {
          marginBottom: 20,
        },
        section: {
          padding: `25px ${pageX} 15px`,
        },
        sectionHeader: {
          color: textBlack,
        },
        title: {
          display: "flex",
          flexDirection: "row",
        },
        content: {
          marginLeft: pageX,
          marginRight: pageX,
        },
        textBoxContent: {
          display: "flex",
          justifyContent: "space-between",
        },
        icon: {
          flex: "0 0 auto",
          margin: "0 0 0 6px",
        },
        link: {
          textColor: primary,
          display: "flex",
          flexDirection: "row",
        },
      }),
    [pageX, primary, textBlack]
  );
};

const useDateRangeOptions = (
  today: Moment
): ReadonlyArray<Option<TimePeriod>> => {
  return useMemo(() => {
    const lastWeekRange = getLastWeekRange(today);
    const last90Range = getLast90Range(today);
    const thisYearRange = getThisYearRange(today);
    const allTimeRange = getAllTimeRange(today);
    return [
      {
        value: "last_7_days",
        text: i`Last 7 days (${lastWeekRange.startDate} - ${lastWeekRange.endDate})`,
      },
      {
        value: "last_90_days",
        text: i`Last 90 days (${last90Range.startDate} - ${last90Range.endDate})`,
      },
      {
        value: "this_year",
        text: i`This year (${thisYearRange.startDate} - ${thisYearRange.endDate})`,
      },
      {
        value: "all_time",
        text: i`All time (${allTimeRange.startDate} - ${allTimeRange.endDate})`,
      },
    ];
  }, [today]);
};

export default observer(FBSOverviewContainer);
