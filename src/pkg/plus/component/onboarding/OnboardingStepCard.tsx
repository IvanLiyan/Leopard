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

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core";

/* Merchant Plus Components */
import HomePageCard from "@plus/component/home/cards/HomePageCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { PickedOnboardingStep } from "@toolkit/home";
import OnboardingTimelineItem from "./OnboardingTimelineItem";

type Props = BaseProps & {
  readonly step: PickedOnboardingStep;
  readonly index: number;
  readonly isLast?: boolean;
  readonly showLastNumber?: boolean;
};

const OnboardingStepCard: React.FC<Props> = ({
  index,
  isLast,
  showLastNumber,
  step: { title, ctaText, ctaLink, completed, description, illustration },
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  const renderCta = () => {
    if (completed) {
      return (
        <>
          <Icon name="plusDone" style={css(styles.doneCheckmark)} />
          <>{i`Done!`}</>
        </>
      );
    }

    if (!ctaLink) {
      return null;
    }

    return (
      <PrimaryButton href={ctaLink} minWidth>
        {ctaText}
      </PrimaryButton>
    );
  };

  return (
    <OnboardingTimelineItem
      className={css(styles.root, className, style)}
      index={index}
      isLast={isLast}
      showLastNumber={showLastNumber}
    >
      <HomePageCard
        key={title}
        title={title}
        description={description}
        illustration={illustration as IllustrationName}
      >
        {renderCta()}
      </HomePageCard>
    </OnboardingTimelineItem>
  );
};

export default observer(OnboardingStepCard);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
        },
        doneCheckmark: {
          height: 40,
          width: 40,
          marginRight: 8,
        },
      }),
    []
  );
};
