/*
 * PerformanceStoreHealthSection.tsx
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
import ShippingStoreHealthCard from "@merchant/component/performance/overview/ShippingStoreHealthCard";
import ProductComplianceStoreHealthCard from "@merchant/component/performance/overview/ProductComplianceStoreHealthCard";
import RefundStoreHealthCard from "@merchant/component/performance/overview/RefundStoreHealthCard";
import RatingStoreHealthCard from "@merchant/component/performance/overview/RatingStoreHealthCard";
import CustomerServiceStoreHealthCard from "@merchant/component/performance/overview/CustomerServiceStoreHealthCard";

/* Model */
import { PerformanceHealthInitialData } from "@toolkit/performance/stats";

type Props = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
};

const PerformanceStoreHealthSection = (props: Props) => {
  const {
    initialData: {
      policy,
      currentMerchant: { storeStats },
    },
    className,
    style,
  } = props;
  const styles = useStylesheet();

  if (storeStats == null) {
    return null;
  }

  return (
    <div className={css(styles.root, className, style)}>
      <PageGuide>
        <div className={css(styles.title)}>
          <H4>Store health metrics</H4>
        </div>
        <div className={css(styles.cards)}>
          <ShippingStoreHealthCard storeStats={storeStats} />
          <ProductComplianceStoreHealthCard policy={policy} />
          <RefundStoreHealthCard storeStats={storeStats} />
          <RatingStoreHealthCard storeStats={storeStats} />
          <CustomerServiceStoreHealthCard storeStats={storeStats} />
        </div>
        <div className={css(styles.footer)}>
          *Store health metrics may show different date ranges depending on
          availability of data.
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
        cards: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 16,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
          },
        },
        title: {
          display: "flex",
          flexFlow: "row",
          marginBottom: 16,
        },
        footer: {
          marginTop: 16,
          fontSize: 12,
          lineHeight: "16px",
        },
      }),
    [pageBackground]
  );
};

export default observer(PerformanceStoreHealthSection);
