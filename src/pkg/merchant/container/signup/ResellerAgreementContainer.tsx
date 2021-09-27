import React, { useState, useMemo, useEffect, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import Step1, {
  UserChoiceType,
} from "@merchant/component/signup/reseller-agreement/Step1";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";

/* Merchant Store */

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { useLoggedInUser } from "@merchant/stores/UserStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

const ResellerAgreementContainer: React.FC<{}> = () => {
  const user = useLoggedInUser();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const logger = useLogger("RESELLER_AGREEMENT_PAGE");

  const [step, setStep] = useState(1);
  const [userChoice, setUserChoice] = useState<UserChoiceType>("");
  const [brandNames, setBrandNames] = useState("");
  const [userCheckTerms, setUserCheckTerms] = useState(false);

  useEffect(() => {
    logger.info({
      merchant_id: user.merchant_id,
      onboarding_completed: user.onboarding_completed,
      step: "show_page",
    });
  }, [user, logger]);

  const styles = useStylesheet();

  const handleUserChoice = (choice: UserChoiceType) => {
    setUserChoice(choice);
    if (choice != "yes") {
      setUserCheckTerms(false);
      setBrandNames("");
    }
  };

  const handleUserCheckTerm = (checked: boolean) => {
    setUserCheckTerms(checked);
  };

  const handleBack = () => {
    logger.info({
      merchant_id: user.merchant_id,
      onboarding_completed: user.onboarding_completed,
      step,
      action: "back",
      userChoice: userChoice == "yes",
      userCheckTerms,
      brandNames,
    });

    if (step == 1) {
      navigationStore.navigate("/");
    } else {
      setStep(1);
    }
  };

  const handleContinue = async () => {
    const params = {
      userChoice: userChoice == "yes",
      userCheckTerms,
      brandNames,
    };

    logger.info({
      merchant_id: user.merchant_id,
      onboarding_completed: user.onboarding_completed,
      step,
      action: "continue",
      ...params,
    });

    try {
      await onboardingApi.resellerAgreementRequest(params).call();
    } catch (e) {
      toastStore.error(e.msg);
      return;
    }

    navigationStore.navigate("/");
  };

  let content: ReactNode = null;
  if (step == 1) {
    content = (
      <Step1
        className={css(styles.steps)}
        userChoice={userChoice}
        userCheckTerms={userCheckTerms}
        onUserChoice={handleUserChoice}
        onUserCheckTerms={handleUserCheckTerm}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    );
  }
  return <div className={css(styles.root)}>{content}</div>;
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          justifyContent: "center",
          marginTop: 80,
        },
        steps: {
          width: "90%",
          maxWidth: 720,
        },
      }),
    []
  );
};

export default observer(ResellerAgreementContainer);
