import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Accordion, PrimaryButton, Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { learnMoreZendesk } from "@toolkit/url";

/* Merchant API */
import { setData } from "@merchant/api/seller-profile-verification";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AccordionProps } from "@ContextLogic/lego";

type GetStartedProps = BaseProps & {
  readonly isRefetchingData: boolean;
  readonly onNext: () => void;
};

const GetStartedPage = (props: GetStartedProps) => {
  const { className, style, onNext, isRefetchingData } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccordion1Open, setIsAccordion1Open] = useState(false);
  const [isAccordion2Open, setIsAccordion2Open] = useState(false);
  const { surfaceLightest } = useTheme();
  const handleClick = async () => {
    let hasError = false;
    setIsSubmitting(true);
    try {
      await setData({ page_name: "GetStartedPage" }).call();
    } catch (e) {
      hasError = true;
    } finally {
      setIsSubmitting(false);
    }

    if (!hasError) {
      onNext();
    }
  };

  const styles = useStylesheet();
  const content =
    i`To ensure that Wish remains a safe marketplace,` +
    i` we limit the amount of sales that can be sold by a` +
    i` single account at one time based on the site activity` +
    i` and overall performance. To expand your sales limit,` +
    i` validate your store.`;

  const foldContent1 =
    i`Validating your Wish store helps ensure the security of your account` +
    i` and unlock **unlimited sales** to expand your business. You will also gain` +
    i` access to additional merchant features to help run and grow your store,` +
    i` such as setting up **Tax Settings**, applying to become an **Authentic Brand` +
    i` Seller**, and more.`;

  /* ul/li is exactly what I need */
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
      <li>Business location within your country/region of domicile</li>
      <li>Phone number</li>
      <li>Your full name / your primary contact person's full name</li>
      <li>Your date of birth / your primary contact person's date of birth</li>
      <li>Proof of identity within your country/region of domicile</li>
    </ul>
  );

  const accordionParams: Partial<AccordionProps> = {
    centerHeader: true,
    hideLines: true,
    chevronLocation: "right",
    backgroundColor: surfaceLightest,
    className: css(styles.accordion),
  };

  return (
    <div className={css(styles.root, style, className)}>
      <Text weight="bold" className={css(styles.title)}>
        How does validating my store benefit my Wish business?
      </Text>
      <Markdown className={css(styles.content)} text={content} />
      <div className={css(styles.buttonResizer)}>
        <PrimaryButton
          onClick={handleClick}
          isLoading={isSubmitting || isRefetchingData}
        >
          Get Started
        </PrimaryButton>
      </div>
      <Illustration
        className={css(styles.img)}
        name="womanUsingTelescope"
        alt=""
      />
      <div className={css(styles.footer)}>
        <Accordion
          isOpen={isAccordion1Open}
          onOpenToggled={setIsAccordion1Open}
          header={() => (
            <Text weight="medium" className={css(styles.accordionHeader)}>
              How does validating my store benefit my Wish business?
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

export default GetStartedPage;

const useStylesheet = () => {
  const { textDark, textBlack, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        title: {
          margin: "40px 12% 0 12%",
          fontSize: 24,
          lineHeight: "32px",
          color: textBlack,
          textAlign: "center",
        },
        content: {
          margin: "16px 12% 0 12%",
          color: textDark,
          textAlign: "center",
        },
        img: {
          marginTop: 80,
        },
        buttonResizer: {
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 24,
          ":nth-child(1n) > *": {
            flex: 1,
            maxWidth: 320,
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
          textAlign: "center",
          textSize: 16,
          lineHeight: 1.5,
          flex: 1,
        },
        accordionContent: {
          padding: "0 12%",
          fontSize: 14,
          lineHeight: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 20,
        },
      }),
    [textDark, textBlack, borderPrimaryDark],
  );
};
