import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { IllustrationName } from "@merchant/component/core";
import { PrimaryButton, Link } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Plus Components */
import HomeSection from "@plus/component/home/HomeSection";
import SellerValidationCard from "@plus/component/home/cards/SellerVerificationCard";
import HomePageCard from "@plus/component/home/cards/HomePageCard";

/* Toolkit */
import { PickedOnboardingStep, PickedSellerVerification } from "@toolkit/home";

type Props = BaseProps & {
  readonly sellerVerification: PickedSellerVerification;
  readonly onboardingSteps: ReadonlyArray<PickedOnboardingStep>;
};

const StoreThingsToDoSection: React.FC<Props> = ({
  style,
  className,
  sellerVerification,
  onboardingSteps,
}: Props) => {
  const styles = useStylesheet();

  const { actionRequired, gmvCapReached } = sellerVerification;

  const sellerVerificationCardVisible = actionRequired && gmvCapReached;

  if (!sellerVerificationCardVisible && onboardingSteps.length == 0) {
    return null;
  }

  const numOnboardingStepsToShow = 2;

  const thingsToDoCards = onboardingSteps
    .slice(0, numOnboardingStepsToShow)
    .map(({ ctaLink, ctaText, title, description, illustration }) => (
      <HomePageCard
        key={title}
        title={title}
        description={description}
        illustration={illustration as IllustrationName}
      >
        {ctaLink && (
          <PrimaryButton href={ctaLink} popoverStyle={css(styles.button)}>
            {ctaText}
          </PrimaryButton>
        )}
      </HomePageCard>
    ));

  const viewAllOnboardingLink = "/plus/home/onboarding-steps";

  return (
    <HomeSection
      title={i`Set up your account`}
      className={css(style, className)}
      renderRight={() =>
        onboardingSteps.length > numOnboardingStepsToShow && (
          <Link href={viewAllOnboardingLink}>View all</Link>
        )
      }
    >
      <div className={css(styles.root)}>
        {thingsToDoCards}
        {sellerVerificationCardVisible && (
          <SellerValidationCard sellerVerification={sellerVerification} />
        )}
      </div>
    </HomeSection>
  );
};

export default StoreThingsToDoSection;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "grid",
          gridGap: 18,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        },
        button: {
          maxWidth: 160,
        },
      }),
    []
  );
