import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { RadioGroup } from "@ContextLogic/lego";
import { CheckboxGroupField } from "@ContextLogic/lego";
import { Field } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Layout } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

import MerchantCsSurveyState from "@merchant/model/cs/MerchantCsSurveyState";

type MerchantCsSurveyQuestionsProps = BaseProps & {
  readonly surveyState: MerchantCsSurveyState;
};

const MerchantCsSurveyQuestions = ({
  style,
  surveyState,
}: MerchantCsSurveyQuestionsProps) => {
  const styles = useStylesheet();

  const whyFavouriteOptions = useMemo(
    () => [
      {
        value: `Easy to contact customers`,
        title: i`Easy to contact customers`,
      },
      {
        value: `Favorable refund policy to merchants`,
        title: i`Favorable refund policy to merchants`,
      },
      {
        value: `Good returns programs available to merchants`,
        title: i`Good returns programs available to merchants`,
      },
      {
        value: `Other`,
        title: () => (
          <Layout.FlexRow style={{ width: "100%" }}>
            <Markdown text={i`Other`} className={css(styles.radioItemText)} />
            <TextInput
              placeholder={i`Please specify`}
              height={30}
              fontSize={14}
              className={css(styles.textInput)}
              onClick={(_) => {
                // this is so that clicking the text input won't toggle the checkbox
                surveyState.setNewValuableFeatures(`Other`);
              }}
              onChange={({ text }) => (surveyState.otherValuableFeature = text)}
              style={{ width: "100%" }}
            />
          </Layout.FlexRow>
        ),
      },
    ],
    [styles.textInput, styles.radioItemText, surveyState]
  );

  return (
    <div className={css(styles.container, style)}>
      <Markdown
        text={i`Provide your feedback to join the waitlist:`}
        className={css(styles.title)}
      />
      <Field
        title={() => (
          <Markdown
            text={i`Do you currently sell on other e-commerce marketplaces?`}
            className={css(styles.question)}
          />
        )}
        className={css(styles.questionGroup)}
      >
        <RadioGroup
          selectedValue={surveyState.sellOnOthers}
          onSelected={(newValue) => (surveyState.sellOnOthers = newValue)}
        >
          <RadioGroup.Item
            value={`Yes`}
            text={i`Yes`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`No`}
            text={i`No`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
        </RadioGroup>
      </Field>
      <Field
        title={() => (
          <Markdown
            text={i`Do you have a dedicated customer service team within your company?`}
            className={css(styles.question)}
          />
        )}
        className={css(styles.questionGroup)}
      >
        <RadioGroup
          selectedValue={surveyState.hasCsTeam}
          onSelected={(newValue) => (surveyState.hasCsTeam = newValue)}
        >
          <RadioGroup.Item
            value={`Yes`}
            text={i`Yes`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`No`}
            text={i`No`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
        </RadioGroup>
      </Field>
      <Field
        title={() => (
          <Markdown
            text={
              i`Which of the following customer service features do you value ` +
              i`the most in a marketplace?`
            }
            className={css(styles.question)}
          />
        )}
        className={css(styles.questionGroup)}
      >
        <CheckboxGroupField
          options={whyFavouriteOptions}
          onChecked={({ value }) => surveyState.setNewValuableFeatures(value)}
          selected={surveyState.valuableFeatures}
          style={{ width: "100%" }}
        />
      </Field>
      <Field
        title={() => (
          <Markdown
            text={i`How many hours does it usually take you to respond to customer issues?`}
            className={css(styles.question)}
          />
        )}
        className={css(styles.questionGroup)}
      >
        <RadioGroup
          selectedValue={surveyState.hoursToRespond}
          onSelected={(newValue) => (surveyState.hoursToRespond = newValue)}
        >
          <RadioGroup.Item
            value="6 - 12 hours"
            text={i`6 - 12 hours`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value="12 - 24 hours"
            text={i`12 - 24 hours`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value="24 - 48 hours"
            text={i`24 - 48 hours`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value="48 - 72 hours"
            text={i`48 - 72 hours`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`More than 72 hours`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
            text={() => (
              <Layout.FlexRow>
                <Markdown text={i`More than 72 hours`} />
                <TextInput
                  placeholder={i`Please provide a reason`}
                  height={30}
                  fontSize={14}
                  className={css(styles.textInput)}
                  value={surveyState.reasonForMoreTime}
                  onChange={({ text }) =>
                    (surveyState.reasonForMoreTime = text)
                  }
                  style={{ width: 300 }}
                />
              </Layout.FlexRow>
            )}
          />
        </RadioGroup>
      </Field>
      <Field
        title={() => (
          <Markdown
            text={i`What is your top reason to resolve customer service tickets?`}
            className={css(styles.question)}
          />
        )}
        className={css(styles.questionGroup)}
      >
        <RadioGroup
          selectedValue={surveyState.topReason}
          onSelected={(newValue) => (surveyState.topReason = newValue)}
        >
          <RadioGroup.Item
            value={`Avoiding getting negative feedback from customers`}
            text={i`Avoiding getting negative feedback from customers`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`Encouraging customers to shop again in my store`}
            text={i`Encouraging customers to shop again in my store`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`Ticket is about an expensive product`}
            text={i`Ticket is about an expensive product`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`Ticket is about a specific product type (e.g., electronics, fashion, etc.)`}
            text={i`Ticket is about a specific product type (e.g., electronics, fashion, etc.)`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`Consequence from not being compliant to Marketplace Policies (Late Response Rate, Suspension, etc.)`}
            text={
              i`Consequence from not being compliant to Marketplace Policies ` +
              i`(Late Response Rate, Suspension, etc.)`
            }
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
          />
          <RadioGroup.Item
            value={`Other`}
            // @ts-ignore need to fix RadioGroup.Item to get the font family overridden
            className={styles.radioItemText}
            text={() => (
              <Layout.FlexRow
                style={{ width: "100%", alignItems: "flex-start" }}
              >
                <Markdown text={i`Other`} />
                <TextInput
                  isTextArea
                  placeholder={i`Please specify`}
                  fontSize={14}
                  className={css(styles.textInput)}
                  value={surveyState.otherTopReason}
                  onChange={({ text }) => (surveyState.otherTopReason = text)}
                  rows={3}
                  style={{ width: 400 }}
                />
              </Layout.FlexRow>
            )}
          />
        </RadioGroup>
      </Field>
    </div>
  );
};

export default observer(MerchantCsSurveyQuestions);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          color: textBlack,
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          marginBottom: 20,
        },
        questionGroup: {
          ":not(:first-child)": {
            paddingTop: 8,
          },
          paddingBottom: 8,
          width: "100%",
        },
        question: {
          fontFamily: fonts.proxima,
          fontWeight: fonts.weightSemibold,
          marginBottom: 12,
          color: textBlack,
        },
        radioItemText: {
          color: textBlack,
          fontFamily: fonts.proxima,
          fontWeight: fonts.weightMedium,
          fontSize: 14,
        },
        textInput: {
          marginLeft: 8,
          width: "100%",
        },
      }),
    [textBlack]
  );
};
