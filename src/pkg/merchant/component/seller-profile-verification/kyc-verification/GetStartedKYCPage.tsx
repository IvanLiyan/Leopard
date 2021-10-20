import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Accordion, Markdown, PrimaryButton, Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { learnMoreZendesk } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AccordionProps } from "@ContextLogic/lego";
import { zendeskURL } from "@toolkit/url";

type GetStartedKYCPageProps = BaseProps & {
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
};

const GetStartedKYCPage = (props: GetStartedKYCPageProps) => {
  const { className, style, onNext, isRefetchingData } = props;
  const [isAccordion1Open, setIsAccordion1Open] = useState(false);
  const [isAccordion2Open, setIsAccordion2Open] = useState(false);
  const { surfaceLightest } = useTheme();

  const styles = useStylesheet();
  const content1 =
    i`Validating your Wish store helps ensure the security` +
    i` of your account and **unlock unlimited sales** to expand your business.`;

  const content2 =
    i`To continue operating your Wish store within the European Economic Area (EEA),` +
    i` you need to complete the validation process to comply with` +
    i` Know Your Customer (KYC) regulatory requirements. [Learn more](${zendeskURL(
      "360045537433",
    )})`;

  const content3 =
    i`If you do not complete the validation process` +
    i` you may not be able to receive payments from your store. `;

  const foldContent1 =
    i`As a regulated financial company, ContextLogic BV,` +
    i` a subsidiary of ContextLogic Inc. (dba Wish) must,` +
    i` perform Know Your Customer (KYC) on its` +
    i` European Economic Area (EEA) Merchants.` +
    i` The need to know who our Merchants are is related` +
    i` to the need to control the risks involved in` +
    i` providing services to you, including:` +
    i` money laundering, terrorism financing, fraud,` +
    i` bribery, corruption, tax evasion, and reputational risks.` +
    i` This process also helps to ensure the security of` +
    i` your account and Wish as a trusted Marketplace. `;

  /* ul/li is exactly what I need - bullet points required in Figma design*/
  /* eslint-disable local-rules/unnecessary-list-usage */
  const foldContent2 = () => (
    <ul>
      <li>
        <Markdown
          openLinksInNewTab
          text={i`Country/region of domicile. ${learnMoreZendesk(
            "360050893133",
          )}`}
        />
      </li>
      <li>Business address within your country/region of domicile</li>
      <li>Phone number</li>
      <li>KYC questionnaire or validation documents via Fourthline</li>
    </ul>
  );

  const accordionParams: Partial<AccordionProps> = {
    centerHeader: true,
    hideLines: true,
    chevronLocation: "left",
    backgroundColor: surfaceLightest,
    className: css(styles.accordion),
  };

  return (
    <div className={css(styles.root, style, className)}>
      <Text weight="bold" className={css(styles.title)}>
        How does validating my store benefit my Wish business?
      </Text>
      <Markdown className={css(styles.content)} text={content1} />
      <Markdown className={css(styles.content)} text={content2} />
      <Markdown className={css(styles.content)} text={content3} />
      <div className={css(styles.bottomContent)}>
        <div className={css(styles.buttonResizer)}>
          <PrimaryButton onClick={onNext} isLoading={isRefetchingData}>
            Get Started
          </PrimaryButton>
        </div>
        <Illustration name="womanUsingTelescope" alt="" />
      </div>
      <div className={css(styles.footer)}>
        <Accordion
          isOpen={isAccordion1Open}
          onOpenToggled={setIsAccordion1Open}
          header={() => (
            <Text weight="medium" className={css(styles.accordionHeader)}>
              What should I know about Know Your Customer (KYC) compliance?
            </Text>
          )}
          {...accordionParams}
        >
          <div className={css(styles.accordionContent)}>
            <Markdown text={foldContent1} />
          </div>
        </Accordion>
        <Accordion
          isOpen={isAccordion2Open}
          onOpenToggled={setIsAccordion2Open}
          header={() => (
            <Text weight="medium" className={css(styles.accordionHeader)}>
              What documents do I need to validate my store?
            </Text>
          )}
          {...accordionParams}
        >
          <div className={css(styles.accordionContent)}>{foldContent2()}</div>
        </Accordion>
      </div>
    </div>
  );
};

export default GetStartedKYCPage;

const useStylesheet = () => {
  const { textDark, textBlack, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        },
        title: {
          margin: "40px 12% 0 4%",
          fontSize: 24,
          lineHeight: "32px",
          color: textBlack,
        },
        content: {
          margin: "16px 30% 0 4%",
          color: textDark,
        },
        bottomContent: {
          margin: "20px 0 0 4%",
          display: "flex",
          justifyContent: "space-between",
          alignSelf: "stretch",
        },
        buttonResizer: {
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "-webkit-fill-available",
          maxWidth: 320,
          ":nth-child(1n) > *": {
            flex: 1,
          },
        },
        footer: {
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        accordion: {
          borderTop: `1px solid ${borderPrimaryDark}`,
        },
        accordionHeader: {
          textSize: 16,
          lineHeight: 1.5,
          flex: 1,
        },
        accordionContent: {
          padding: "0 4%",
          fontSize: 14,
          lineHeight: "20px",
          display: "flex",
          flexDirection: "column",
          marginBottom: 20,
        },
      }),
    [textDark, textBlack, borderPrimaryDark],
  );
};
