/*
 *
 * BoostProducts.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/22/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import BalanceOverviewCard from "@plus/component/marketing/boosted-products/BalanceOverviewCard";

import WishAppAdPreview from "./WishAppAdPreview";
import SetBudgetSection from "./sections/set-budget/SetBudgetSection";
import SelectProductsSection from "./sections/select-products/SelectProductsSection";

import BoostProductsState from "@plus/model/BoostProductsState";

import { useDeviceStore } from "@stores/DeviceStore";
import { useNavigationStore } from "@stores/NavigationStore";

type Props = BaseProps & {
  readonly boostState: BoostProductsState;
};

const BoostProducts: React.FC<Props> = (props: Props) => {
  const { className, style, boostState } = props;
  const { selectProductCount } = boostState;
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();
  const navigationStore = useNavigationStore();
  useEffect(() => {
    if (selectProductCount > 0) {
      navigationStore.placeNavigationLock(
        i`You have unsaved changed. Are you sure want to leave?`,
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
  }, [navigationStore, selectProductCount]);

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.row)}>
        <SelectProductsSection boostState={boostState} />
        {!isSmallScreen && selectProductCount > 0 && (
          <WishAppAdPreview boostState={boostState} />
        )}
      </div>
      {selectProductCount > 0 && (
        <div className={css(styles.row)}>
          <SetBudgetSection boostState={boostState} />
          <BalanceOverviewCard initialData={boostState.initialData} />
        </div>
      )}
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "20px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        row: {
          display: "grid",
          gridGap: 20,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "7fr 3fr",
            alignItems: "start",
          },
          marginBottom: 25,
        },
      }),
    [],
  );
};

export default observer(BoostProducts);
