/*
 * PerformanceStoreMetricsSection.tsx
 *
 * Created by Betty Chen on Mar 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4 } from "@ContextLogic/lego";
import { Tabs, Tab, TabPanel } from "src/app/performance-cn/components";
/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

import PageGuide from "@core/components/PageGuide";

/* Relative Imports */
import StoreSalesCharts from "./StoreSalesCharts";
import ProductsMetricsTable from "./ProductsMetricsTable";
import WithPerformanceProductsMetricsTable from "./WithPerformanceProductsMetricsTable";
import NoPerformanceProductsMetricsTable from "./NoPerformanceProductsMetricsTable";

/* Model */
import { PerformanceHealthInitialData } from "@performance/migrated/toolkit/stats";

type Props = BaseProps & {
  initialData: PerformanceHealthInitialData;
};

const PerformanceStoreMetricsSection = (props: Props) => {
  const { className, style, initialData } = props;
  const styles = useStylesheet();

  const [productTableType, setProductTableType] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setProductTableType(newValue);
  };

  return (
    <div className={css(styles.root, className, style)}>
      <PageGuide relaxed>
        <div className={css(styles.title)}>
          <H4>Store sales</H4>
        </div>
        <StoreSalesCharts />
        <div className={css(styles.title)} style={{ marginTop: 64 }}>
          <H4>Product metrics</H4>
        </div>

        <div style={{ marginTop: "20px" }}>
          <div style={{ borderBottom: 1, borderColor: "divider", padding: 0 }}>
            <Tabs
              value={productTableType}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={i`All products`} />
              <Tab label={i`Products with performance`} />
              <Tab label={i`Product with no performance`} />
            </Tabs>
          </div>
          <TabPanel value={productTableType} index={0}>
            <ProductsMetricsTable initialData={initialData} />
          </TabPanel>
          <TabPanel value={productTableType} index={1}>
            <WithPerformanceProductsMetricsTable initialData={initialData} />
          </TabPanel>
          <TabPanel value={productTableType} index={2}>
            <NoPerformanceProductsMetricsTable initialData={initialData} />
          </TabPanel>
        </div>
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
    [pageBackground],
  );
};

export default observer(PerformanceStoreMetricsSection);
