/*
 *
 * BoostedProductDetail.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ci18n } from "@legacy/core/i18n";

import { H5, SimpleSelect } from "@ContextLogic/lego";

import { SimpleSelectOption as Option } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
// import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BoostedProductsRowState from "@plus/model/BoostedProductsRowState";
import BoostedProductPerformance, {
  TimeRange,
} from "./BoostedProductPerformance";

type Props = BaseProps & {
  readonly productState: BoostedProductsRowState;
};

const RangeOptions: ReadonlyArray<Option<TimeRange>> = [
  {
    value: "ONE_WEEK",
    text: i`Last 7 days`,
  },
  {
    value: "ONE_MONTH",
    text: i`Last month`,
  },
  {
    value: "ALL",
    text: ci18n("Show data for all-time, instead of a small time range", "All"),
  },
];

const BoostedProductDetail: React.FC<Props> = (props: Props) => {
  const { style, className, productState } = props;
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange>("ONE_WEEK");
  const {
    product: { id: productId, createTime: createdTime },
  } = productState;
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.headerRow)}>
        <H5 className={css(styles.title)}>Performance</H5>
        <div className={css(styles.headerRight)}>
          <span>Date range</span>
          <SimpleSelect
            className={css(styles.select)}
            options={RangeOptions}
            onSelected={(range: TimeRange) => {
              setSelectedTimeRange(range);
            }}
            selectedValue={selectedTimeRange}
            style={{ marginLeft: 15 }}
          />
        </div>
      </div>
      <BoostedProductPerformance
        productId={productId}
        timeRange={selectedTimeRange}
        productCreationTime={createdTime.unix}
        className={css(styles.performance)}
      />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          padding: "10px 20px",
        },
        headerRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        headerRight: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        },
        title: {
          fontSize: 18,
        },
        select: {
          flex: 0,
          marginLeft: 10,
        },
        performance: {
          marginTop: 20,
        },
      }),
    [],
  );
};

export default observer(BoostedProductDetail);
