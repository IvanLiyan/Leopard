/*
 *
 * SetBudgetSection.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/22/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H7 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import Section from "@plus/component/marketing/manage-boost/Section";
import SetBudgetTable from "./SetBudgetTable";

import { useTheme } from "@merchant/stores/ThemeStore";

import BoostProductsState from "@plus/model/BoostProductsState";

type Props = BaseProps & {
  readonly boostState: BoostProductsState;
};

const SetBudgetSection: React.FC<Props> = (props: Props) => {
  const { className, style, boostState } = props;
  const styles = useStylesheet();
  const {
    totalBudget,
    currencyCode,
    hasBudgetError,
    isBeyondAvailableBudget,
  } = boostState;
  const totalDailyBudget = formatCurrency(totalBudget, currencyCode);

  return (
    <Section
      className={css(style, className)}
      title={i`**Step 2:** Add daily budget`}
      markdown
      renderRight={() => (
        <div
          className={css(
            styles.totalBudget,
            isBeyondAvailableBudget && styles.error
          )}
        >
          Total: {totalDailyBudget} / day
        </div>
      )}
      contentStyle={css(styles.root)}
      hasInvalidData={hasBudgetError}
    >
      <div className={css(styles.topSection)}>
        <H7>
          Your budget will be spent daily to boost your products. The actual
          amount spent daily may vary to optimize your boosted impressions. We
          will spend no more than your set budget per day.
        </H7>
      </div>
      <SetBudgetTable
        products={boostState.selectedProducts}
        boostState={boostState}
      />
    </Section>
  );
};

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        topSection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 20,
        },
        totalBudget: {},
        error: {
          color: negative,
        },
      }),
    [negative]
  );
};

export default observer(SetBudgetSection);
