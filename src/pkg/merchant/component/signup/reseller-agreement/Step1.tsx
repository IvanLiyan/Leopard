import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { redX, greenCheckmark } from "@assets/icons";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Relative Imports */
import StepBase from "./StepBase";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type UserChoiceType = "" | "yes" | "no";

type Step1Props = BaseProps & {
  readonly userChoice: UserChoiceType;
  readonly userCheckTerms: boolean;
  readonly onUserChoice: (choice: UserChoiceType) => unknown;
  readonly onUserCheckTerms: (checked: boolean) => unknown;
  readonly onBack: () => unknown;
  readonly onContinue: () => Promise<unknown>;
};

const Step1 = (props: Step1Props) => {
  const styles = useStylesheet();

  const renderTerms = () => {
    const { userChoice, userCheckTerms, onUserCheckTerms } = props;
    if (userChoice != "yes") {
      return null;
    }

    const thirdPartyLink = `[${i`Branded Products Declaration`}](/brand-authorization/third-party-branded-products-declaration).`;
    const text =
      i`I accept and agree to be bound by the terms of the ` +
      i`${thirdPartyLink}`;

    const learnMoreLink = `[${i`Learn more`}](${zendeskURL("360044649073")})`;
    const policy =
      i`Tag each of your authentic branded products with a brand name from ` +
      i`the Brand Directory to maximize your listing's potential impressions ` +
      i`and sales. Tagging also helps you comply with Wish's Merchant Policies, ` +
      i`fostering a healthy marketplace for you and your global customers. ` +
      i`${learnMoreLink}`;

    return (
      <div className={css(styles.terms)}>
        <CheckboxField
          wrapTitle
          title={() => <Markdown openLinksInNewTab text={text} />}
          onChange={(checked: boolean) => onUserCheckTerms(checked)}
          checked={userCheckTerms}
        />
        <div className={css(styles.policy)}>
          <Markdown openLinksInNewTab text={policy} />
        </div>
        <div className={css(styles.illustration)}>
          <Illustration name="resellerAgreement" alt="resellerAgreement" />
        </div>
      </div>
    );
  };

  const {
    className,
    style,
    userChoice,
    userCheckTerms,
    onUserChoice,
    onBack,
    onContinue,
  } = props;
  const continueDisabled = userChoice == "yes" && userCheckTerms == false;
  return (
    <StepBase
      className={className}
      style={style}
      titleLine1={i`Do you plan to sell branded products?`}
      subtitle={i`Additional actions may be required to sell branded products on Wish.`}
      continueDisabled={continueDisabled}
      onBack={onBack}
      onContinue={onContinue}
    >
      <div className={css(styles.choices)}>
        <div
          className={css(
            styles.choice,
            userChoice == "yes" && styles.userChosen
          )}
          onClick={() => {
            onUserChoice("yes");
          }}
        >
          <img src={greenCheckmark} />
          <span className={css(styles.choiceTextSpace)}>Yes</span>
        </div>
        <div
          className={css(
            styles.choiceSpace,
            styles.choice,
            userChoice == "no" && styles.userChosen
          )}
          onClick={() => {
            onUserChoice("no");
          }}
        >
          <img src={redX} />
          <span className={css(styles.choiceTextSpace)}>No</span>
        </div>
      </div>
      {renderTerms()}
    </StepBase>
  );
};

export default Step1;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        choices: {
          display: "flex",
          justifyContent: "center",
          marginTop: 32,
          maxWidth: 600,
          width: "90%",
        },
        choice: {
          padding: "18px 0",
          flex: 1,
          borderRadius: 4,
          border: `solid 1px ${palettes.greyScaleColors.Grey}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: 40,
        },
        userChosen: {
          border: `solid 1px ${palettes.coreColors.WishBlue}`,
        },
        choiceTextSpace: {
          marginLeft: 10,
          fontSize: 16,
        },
        choiceSpace: {
          marginLeft: 16,
        },
        terms: {
          marginTop: 12,
          maxWidth: 610,
          width: "90%",
        },
        policy: {
          marginTop: 40,
          maxWidth: 610,
          fontSize: 14,
        },
        illustration: {
          display: "flex",
          justifyContent: "center",
          marginTop: 30,
        },
      }),
    []
  );
};
