/*
 *
 * OnboardingSteps.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/21/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import HomePageCard from "@plus/component/home/cards/HomePageCard";
import OnboardingTimelineItem from "./OnboardingTimelineItem";

import OnboardingStepCard from "./OnboardingStepCard";
import { PickedOnboardingStep } from "@toolkit/home";

type Props = BaseProps & {
  readonly steps: ReadonlyArray<PickedOnboardingStep>;
  readonly daysToFulfill: number;
  readonly isStoreMerchant: boolean;
};

const OnboardingSteps = ({
  style,
  className,
  steps,
  daysToFulfill,
  isStoreMerchant,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, style, className)}>
      {steps.map((step, index) => (
        <OnboardingStepCard
          key={step.title}
          step={step}
          index={index + 1}
          isLast={index == steps.length - 1 && isStoreMerchant}
          showLastNumber
        />
      ))}
      {!isStoreMerchant && (
        <OnboardingTimelineItem index={0} isLast>
          <HomePageCard
            title={i`Fulfill your orders within ${daysToFulfill} days`}
            description={
              i`Fulfill your orders by adding tracking information within ` +
              i`${daysToFulfill} days from when the orders are released.`
            }
            illustration="merchantPlusMarkOrdersShippedTask"
          />
        </OnboardingTimelineItem>
      )}
    </div>
  );
};

export default observer(OnboardingSteps);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflow: "hidden",
          padding: "28px 24px",
          alignItems: "stretch",
        },
      }),
    []
  );
};
