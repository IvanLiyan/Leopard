/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium } from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import { TimePeriod } from "@toolkit/fbs";

export type FBSStatsDateRangeSelectorProps = BaseProps & {
  readonly setTimePeriod: (val: TimePeriod) => void;
  readonly timePeriod: TimePeriod;
  readonly dateRangeOptions: ReadonlyArray<Option<TimePeriod>>;
};

const FBSStatsDateRangeSelector = (props: FBSStatsDateRangeSelectorProps) => {
  const { timePeriod, setTimePeriod, dateRangeOptions } = props;
  const styles = useStyleSheet();

  return (
    <div className={css(styles.dateRange)}>
      <Markdown text={i`Date range`} className={css(styles.dateRangeLabel)} />
      <Select
        options={dateRangeOptions}
        onSelected={setTimePeriod}
        selectedValue={timePeriod}
      />
    </div>
  );
};

export default observer(FBSStatsDateRangeSelector);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        dateRange: {
          display: "flex",
          flexDirection: "row",
          align: "center",
        },
        dateRangeLabel: {
          color: palettes.textColors.LightInk,
          fontSize: 16,
          fontWeight: weightMedium,
          marginRight: 8,
          padding: "10px 0px",
        },
      }),
    []
  );
};
