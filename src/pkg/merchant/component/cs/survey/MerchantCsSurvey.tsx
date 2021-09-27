import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, PrimaryButton } from "@ContextLogic/lego";
import { H6Markdown } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useLogger } from "@toolkit/logger";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";

import MerchantCsSurveyQuestions from "./MerchantCsSurveyQuestions";
import MerchantCsSurveyState from "@merchant/model/cs/MerchantCsSurveyState";

type MerchantCsSurveyProps = BaseProps & {
  readonly onUpdate: () => unknown;
};

const MerchantCsSurvey = ({ style, onUpdate }: MerchantCsSurveyProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const surveyLogger = useLogger("MERCHANT_CS_SURVEY_RESULT");

  const [surveyState] = useState<MerchantCsSurveyState>(
    new MerchantCsSurveyState()
  );
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const submit = useCallback(() => {
    setSubmitDisabled(true);
    if (
      !surveyState.sellOnOthers ||
      !surveyState.hasCsTeam ||
      surveyState.valuableFeatures.length == 0 ||
      !surveyState.hoursToRespond ||
      !surveyState.topReason
    ) {
      toastStore.negative(i`Please fill in the entire survey.`);
      setSubmitDisabled(false);
      return;
    }

    surveyLogger.info({
      sell_on_others: surveyState.sellOnOthers,
      has_cs_team: surveyState.hasCsTeam,
      valuable_features: surveyState.valuableFeatures.join(","),
      other_valuable_feature: surveyState.otherValuableFeature,
      hours_to_respond: surveyState.hoursToRespond,
      reason_for_more_time: surveyState.reasonForMoreTime,
      top_reason: surveyState.topReason,
      other_top_reason: surveyState.otherTopReason,
    });

    onUpdate();
    toastStore.positive(i`Survey submitted!`);
  }, [surveyState, toastStore, surveyLogger, onUpdate]);

  /* eslint-disable local-rules/unnecessary-list-usage */
  return (
    <div className={css(styles.container, style)}>
      <Markdown text={i`Join the waitlist`} className={css(styles.title)} />
      <Card contentContainerStyle={css(styles.card)}>
        <div className={css(styles.mainContent)}>
          <div className={css(styles.leftPanel)}>
            <p className={css(styles.paragraph)}>
              We are excited to announce that Wish is building a new Customer
              Service Program that will grant merchants additional ownership in
              resolving customer issues.
            </p>
            <p className={css(styles.paragraph)}>
              With the new program, merchants may be able to accomplish the
              following:
            </p>
            <div className={css(styles.paragraph)}>
              <div className={css(styles.paragraphWithIcon)}>
                <Icon name="support" className={css(styles.icon)} />
                <H6Markdown text={i`Communicate with customers`} />
              </div>
              <ul>
                <li>Answer questions from customers pre-purchase</li>
                <li>Handle customer issues post-purchase</li>
                <li>Send a message to customers about their orders</li>
              </ul>
            </div>
            <div className={css(styles.paragraph)}>
              <div className={css(styles.paragraphWithIcon)}>
                <Icon name="hand" className={css(styles.icon)} />
                <H6Markdown
                  text={i`Offer returns, refunds, and replacements`}
                />
              </div>
              <ul>
                <li>
                  Provide a pre-paid return label to customers for products not
                  enrolled in the Wish Returns Program
                </li>
                <li>Give a full or partial refund for an order</li>
                <li>Offer a different item or replacement for an order</li>
              </ul>
            </div>
            <p className={css(styles.paragraph)}>
              By taking just a few minutes to fill out the survey, you get to
              shape the soon-to-be-launched Customer Service Program. With your
              valuable input, we will build the program with your interest and
              needs in mind, helping to unlock more opportunities and autonomy
              for you and your customers on Wish.
            </p>
          </div>

          <MerchantCsSurveyQuestions
            style={styles.rightPanel}
            surveyState={surveyState}
          />
        </div>
        <div className={css(styles.submissionSection)}>
          <PrimaryButton
            className={css(styles.submitButton)}
            isDisabled={submitDisabled}
            onClick={submit}
          >
            Submit to join the waitlist
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default observer(MerchantCsSurvey);

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          color: textBlack,
          fontFamily: fonts.proxima,
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 24,
          fontWeight: fonts.weightBold,
          marginBottom: 16,
        },
        card: {
          display: "flex",
          flexDirection: "column",
        },
        mainContent: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-start",
          margin: "32px 48px 32px 48px",
        },
        leftPanel: {
          flex: 2,
          display: "flex",
          flexDirection: "column",
          marginRight: 48,
        },
        rightPanel: {
          paddingLeft: 48,
          flex: 3,
          borderLeft: "1px solid",
          borderLeftColor: borderPrimary,
        },
        paragraph: {
          ":not(:first-child)": {
            paddingTop: 8,
          },
          paddingBottom: 8,
        },
        icon: {
          width: 16,
          marginRight: 10,
        },
        paragraphWithIcon: {
          display: "flex",
          flexDirection: "row",
        },
        submissionSection: {
          display: "flex",
          flexDirection: "row-reverse",
          padding: "24px 24px 24px 0px",
          borderTop: "1px solid",
          borderTopColor: borderPrimary,
        },
        submitButton: {
          minWidth: 200,
          height: 32,
        },
      }),
    [textBlack, borderPrimary]
  );
};
