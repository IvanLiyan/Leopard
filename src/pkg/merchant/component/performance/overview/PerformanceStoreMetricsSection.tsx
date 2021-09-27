/*
 * PerformanceStoreMetricsSection.tsx
 *
 * Created by Betty Chen on Mar 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import { PageGuide } from "@merchant/component/core";

/* Relative Imports */
import StoreSalesCharts from "./StoreSalesCharts";
import ProductsMetricsTable from "./ProductsMetricsTable";

/* Model */
import { PerformanceHealthInitialData } from "@toolkit/performance/stats";

type Props = BaseProps & {
  initialData: PerformanceHealthInitialData;
};

const PerformanceStoreMetricsSection = (props: Props) => {
  const { className, style, initialData } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <PageGuide>
        <div className={css(styles.title)}>
          <H4>Store sales</H4>
        </div>
        <StoreSalesCharts />
        <div className={css(styles.title)} style={{ marginTop: 64 }}>
          <H4>Product metrics</H4>
        </div>
        <ProductsMetricsTable initialData={initialData} />
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        title: {
          display: "flex",
          flexFlow: "row",
          marginBottom: 16,
        },
      }),
    [pageBackground]
  );
};

export default observer(PerformanceStoreMetricsSection);
