import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import PageGuide from "@plus/component/nav/PageGuide";

import AddProductsCard from "./cards/AddProductsCard";
import StoreHomeBanner from "./banners/StoreHomeBanner";
import StoreInsightsSection from "./sections/StoreInsightsSection";
import StoreThingsToDoSection from "./sections/StoreThingsToDoSection";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { HomeInitialData } from "@toolkit/home";

type Props = BaseProps & {
  readonly initialData: HomeInitialData;
};

const StoreHome: React.FC<Props> = ({
  className,
  style,
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const {
    currentUser: { onboarding },
    currentMerchant: { sellerVerification },
  } = initialData;
  const onboardingSteps = onboarding?.steps || [];

  return (
    <div className={css(styles.root, className, style)}>
      <StoreHomeBanner
        isOnboarding={onboardingSteps.length > 0}
        className={css(styles.addProductsCard)}
      />
      <PageGuide className={css(styles.content)}>
        {onboardingSteps.length === 0 && <AddProductsCard />}
        <StoreThingsToDoSection
          onboardingSteps={onboardingSteps}
          className={css(styles.section)}
          sellerVerification={sellerVerification}
        />
        <StoreInsightsSection
          className={css(styles.section)}
          sellerVerification={sellerVerification}
        />
      </PageGuide>
    </div>
  );
};

export default observer(StoreHome);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        section: {
          margin: "10px 0px",
          ":not(:first-child)": {
            marginTop: 40,
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 25,
          maxWidth: 1024,
        },
        addProductsCard: {},
      }),
    []
  );
};
