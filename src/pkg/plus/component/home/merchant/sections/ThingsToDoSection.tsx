import React, { useState } from "react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Link, PrimaryButton, Layout } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedOnboardingStep } from "@toolkit/home";

import HomeSection from "@plus/component/home/HomeSection";
import HomePageCard from "@plus/component/home/cards/HomePageCard";
import FulfillOrdersCard from "@plus/component/home/cards/FulfillOrdersCard";
import { PickedSellerVerification } from "@toolkit/home";
import SellerValidationCard from "@plus/component/home/cards/SellerVerificationCard";

type Props = BaseProps & {
  readonly onboardingSteps: ReadonlyArray<PickedOnboardingStep>;
  readonly sellerVerification: PickedSellerVerification;
};

const ThingsToDoSection: React.FC<Props> = ({
  style,
  className,
  onboardingSteps,
  sellerVerification,
}: Props) => {
  const [fulfillOrdersCardVisible, setFulfillOrdersCardVisible] = useState(
    false
  );

  const fulfillOrdersCard = (
    <FulfillOrdersCard setVisible={setFulfillOrdersCardVisible} />
  );

  const numOnboardingStepsToShow = fulfillOrdersCardVisible ? 1 : 2;

  const thingsToDoCards = onboardingSteps
    .slice(0, numOnboardingStepsToShow)
    .map(({ ctaLink, ctaText, title, description, illustration }) => (
      <HomePageCard
        key={title}
        title={title}
        description={description}
        illustration={illustration as IllustrationName}
      >
        <PrimaryButton href={ctaLink} minWidth>
          {ctaText}
        </PrimaryButton>
      </HomePageCard>
    ));

  const { actionRequired, gmvCapReached } = sellerVerification;

  const sellerVerificationCardVisible = actionRequired && gmvCapReached;
  const renderRight = () => {
    if (numOnboardingStepsToShow >= onboardingSteps.length) {
      return null;
    }

    return <Link href="/plus/home/onboarding-steps">View all</Link>;
  };
  if (
    onboardingSteps.length == 0 &&
    !fulfillOrdersCardVisible &&
    !sellerVerificationCardVisible
  ) {
    return null;
  }

  return (
    <HomeSection
      title={i`Things to do`}
      renderRight={renderRight}
      className={css(style, className)}
    >
      <Layout.GridRow templateColumns="1fr 1fr" gap={18}>
        {fulfillOrdersCard}
        {thingsToDoCards}
        {sellerVerificationCardVisible && (
          <SellerValidationCard sellerVerification={sellerVerification} />
        )}
      </Layout.GridRow>
    </HomeSection>
  );
};

export default ThingsToDoSection;
