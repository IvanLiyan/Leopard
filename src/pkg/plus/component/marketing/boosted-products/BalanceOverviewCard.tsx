import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H5 } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useExperimentStore } from "@stores/ExperimentStore";

import CardSection from "./CardSection";
import BalanceBreakdown from "./BalanceBreakdown";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { BoostProductsInitialData } from "@toolkit/marketing/boost-products";
import { BoostedProductsInitialData } from "@toolkit/marketing/boosted-products";

type Props = BaseProps & {
  readonly initialData: BoostProductsInitialData | BoostedProductsInitialData;
};

const BalanceOverviewCard: React.FC<Props> = (props: Props) => {
  const { className, style, initialData } = props;
  const [breakdownVisible, setBreakdownVisible] = useState(false);
  const styles = useStylesheet();
  const experimentStore = useExperimentStore();
  const showChargeBalance =
    experimentStore.bucketForUser("plus_marketing_wallet") == "treatment";
  const {
    marketing: { currentMerchant: merchantProperty },
  } = initialData;
  if (merchantProperty == null) {
    return null;
  }
  const title = merchantProperty.isFreeBudgetMerchant
    ? i`Free budget available`
    : i`Budget available`;
  const { spending } = merchantProperty;

  return (
    <CardSection
      title={title}
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      <div className={css(styles.topSection)}>
        <H5 className={css(styles.budgetAvailable)}>
          {spending.budgetAvailable.display}
        </H5>
        <Link
          onClick={() => setBreakdownVisible(!breakdownVisible)}
          className={css(styles.breakdownLink)}
        >
          {breakdownVisible ? i`Hide` : i`View breakdown`}
        </Link>
        {breakdownVisible && (
          <BalanceBreakdown
            className={css(styles.breakdown)}
            spending={spending}
            isFreeBudgetMerchant={merchantProperty.isFreeBudgetMerchant}
          />
        )}
      </div>
      {showChargeBalance && (
        <Button href="/plus/marketing/wallet">
          {ci18n(
            "'Charge' is a verb, meaning to reload their marketing balance with new funds",
            "Charge balance",
          )}
        </Button>
      )}
    </CardSection>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          flex: 1,
        },
        topSection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        budgetAvailable: {
          marginTop: 5,
          fontSize: 16,
        },
        breakdownLink: {
          margin: "5px 0px",
        },
        button: {},
        breakdown: {
          margin: "5px 0px",
        },
      }),
    [],
  );
};

export default observer(BalanceOverviewCard);
