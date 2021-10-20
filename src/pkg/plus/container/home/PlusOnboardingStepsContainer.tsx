/*
 *
 * PlusOnboardingStepsContainer.tsx
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

/* Lego Components */
import { ProgressBar } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import OnboardingSteps from "@plus/component/onboarding/OnboardingSteps";

import { OnboardingSchema, MerchantSchema } from "@schema/types";
import { useTheme } from "@stores/ThemeStore";

/* Model */
import { PickedOnboardingStep } from "@toolkit/home";

type InitialData = {
  readonly currentUser: {
    readonly onboarding:
      | (Pick<
          OnboardingSchema,
          "numSteps" | "numStepsCompleted" | "numStepsLeft"
        > & {
          readonly steps: ReadonlyArray<PickedOnboardingStep>;
        })
      | null;
  };
  readonly currentMerchant: Pick<
    MerchantSchema,
    "daysToFulfill" | "isStoreMerchant"
  >;
};

type Props = {
  readonly initialData: InitialData;
};

const PlusOnboardingStepsContainer: React.FC<Props> = ({
  initialData: {
    currentUser: { onboarding },
    currentMerchant: { daysToFulfill, isStoreMerchant },
  },
}: Props) => {
  const styles = useStylesheet();
  const { primary, surfaceLight } = useTheme();

  // `PlusWelcomeHeader` expects an array of ReactNodes
  // eslint-disable-next-line local-rules/use-fragment
  const actions = onboarding && (
    <div className={css(styles.progressContainer)}>
      <ProgressBar
        color={primary}
        minWidth={240}
        progress={onboarding.numStepsCompleted / onboarding.numSteps}
        backgroundColor={surfaceLight}
        transitionDurationMs={800}
      />
      <div className={css(styles.progressText)}>
        {onboarding.numStepsCompleted}/{onboarding.numSteps} Completed
      </div>
    </div>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={
          isStoreMerchant ? i`Set up your account` : i`Steps to your first sale`
        }
        actions={actions || []}
      />
      <PageGuide>
        <OnboardingSteps
          steps={onboarding?.steps || []}
          daysToFulfill={daysToFulfill}
          isStoreMerchant={isStoreMerchant}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        progressContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        },
        progressText: {
          marginTop: 6,
          color: textDark,
        },
      }),
    [textDark],
  );
};
export default observer(PlusOnboardingStepsContainer);
