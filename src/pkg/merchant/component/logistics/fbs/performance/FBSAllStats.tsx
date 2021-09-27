/* eslint-disable filenames/match-regex */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import FBSMerchantSalesGraph from "@merchant/component/logistics/fbs/performance/FBSMerchantSalesGraph";
import FBSTopSellers from "@merchant/component/logistics/fbs/performance/FBSTopSellers";

/* Toolkit */
import { getDateRange } from "@toolkit/fbs";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import { TimePeriod } from "@toolkit/fbs";

export type FBSAllStatsProps = BaseProps & {
  readonly currency: string;
  readonly dateRangeOptions: ReadonlyArray<Option<TimePeriod>>;
};

const FBSAllStats = (props: FBSAllStatsProps) => {
  const { className, style, currency, dateRangeOptions } = props;
  const today = moment();
  const styles = useStyleSheet();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last_7_days");
  const dateRange = getDateRange(timePeriod, today);

  return (
    <Card className={css(styles.root, className, style)}>
      <div className={css(styles.content)}>
        <FBSMerchantSalesGraph
          className={css(styles.merchantStats)}
          currency={currency}
          setTimePeriod={setTimePeriod}
          timePeriod={timePeriod}
          dateRangeOptions={dateRangeOptions}
        />
        <FBSTopSellers
          className={css(styles.topSellers)}
          currency={currency}
          timePeriod={timePeriod}
          title={i`Top sellers`}
          subtitle={`${dateRange.startDate} - ${dateRange.endDate}`}
        />
      </div>
    </Card>
  );
};

export default observer(FBSAllStats);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        content: {
          display: "flex",
          flexDirection: "column",
        },
        merchantStats: {
          padding: 24,
        },
        topSellers: {
          paddingTop: 20,
        },
      }),
    []
  );
};
