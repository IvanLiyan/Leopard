import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

type ThirdPartyEthicsHotlineProps = BaseProps;

const ThirdPartyEthicsHotline = (props: ThirdPartyEthicsHotlineProps) => {
  const { className, style } = props;
  const { locale } = useLocalizationStore();
  const styles = useStylesheet(props);

  const areas = [
    i`Accounting Matters`,
    i`Bribery or Corruption`,
    i`Misuse of Property (IP or Assets)`,
    i`Conflict of Interest`,
    i`Data Privacy`,
    i`Discrimination, Harassment, or Retaliation`,
    i`Embezzlement or Money-Laundering`,
    i`Gifts and Entertainment`,
    i`Recordkeeping Matters`,
    i`Workplace Safety or Violence`,
  ];
  const QA_OTHER = [
    {
      question: i`What is the purpose of this hotline?`,
      answer:
        i`We created this hotline so that third parties, such as ` +
        i`logistics providers, can raise ethics concerns to Wish, either ` +
        i`anonymously or with their name attached. Wish wants to conduct ` +
        i`its business ethically and in accordance with applicable law, and ` +
        i`we count on our third parties to let us know if we are not meeting ` +
        i`those standards.`,
    },
    {
      question: i`Will Wish keep my report confidential?`,
      answer:
        i`We will keep your report as confidential as possible and ` +
        i`only share the details on a need-to-know basis.`,
    },
    {
      question:
        i`I have a contractual relationship with Wish, could this ` +
        i`report lead to termination of my relationship or retaliation?`,
      answer:
        i`We want to encourage our third parties to bring forward any ` +
        i`ethics concerns about Wish that they might have, without any fear ` +
        i`of repercussions. If you submit an ethics concern in good faith, ` +
        i`we have no intention of ending our business relationship with you ` +
        i`or retaliating against you for submitting the report. That being ` +
        i`said, if we learn through the investigation of your report that ` +
        i`you or your company have broken the law or have otherwise acted ` +
        i`inappropriately, we reserve the right to take appropriate action.`,
    },
    {
      question: i`Could a report to the hotline trigger any legal or government action?`,
      answer:
        i`If our investigation into a hotline report reveals or confirms ` +
        i`that a third party or a Wish employee has violated the law, policy, or ` +
        i`contract, Wish will take appropriate action. This could include discipline, ` +
        i`legal action, law enforcement involvement, or a report to the appropriate ` +
        i`government agency.`,
    },
    {
      question: i`How will I know that Wish is dealing with my report?`,
      answer:
        i`The hotline itself allows you to check on the status of your ` +
        i`report and allows Wish to communicate with you through the platform ` +
        i`(even if you made an anonymous report). If you made an anonymous ` +
        i`report, Wish will not know your name, login credentials, or contact information.`,
    },
    {
      question: i`What information should I provide to make the report more efficient?`,
      answer:
        i`In order to investigate your ethics concern(s), we need as ` +
        i`much information from you as possible. This could include emails, ` +
        i`chats, pictures, names of the people involved, dates and places of ` +
        i`the activities in question.`,
    },
  ];
  const url =
    locale === "zh"
      ? "https://secure.ethicspoint.com/domain/media/zhs/gui/59040/index.html"
      : "https://secure.ethicspoint.com/domain/media/en/gui/59040/index.html";
  const content = (
    <div className={css(className, style)}>
      <Text weight="bold" className={css(styles.subHeader)}>
        Wish logistics providers can now raise ethics concerns through our Third
        Party Ethics Hotline.
      </Text>
      <div>
        If any Wish logistics provider has an ethics concern to raise with Wish,
        we ask that you use the Third Party Ethics Hotline:
      </div>
      <Link openInNewTab href={url}>
        {url}
      </Link>
      <Text weight="bold" className={css(styles.subHeader)}>
        The Third Party Ethics Hotline is for raising ethics concerns only.
      </Text>
      <div className={css(styles.standAloneText)}>
        <Markdown
          text={
            i`"Ethics concern" means a concern about ***unethical behavior ` +
            i`by Wish or a Wish employee in the following areas***:`
          }
          openLinksInNewTab
        />
      </div>
      <div className={css(styles.bulletPoints)}>
        {areas.map((area) => (
          <div className={css(styles.bullet)}>{area}</div>
        ))}
      </div>
      <div className={css(styles.standAloneText)}>
        <Markdown
          text={
            i`When using the Third Party Ethics Hotline, you can raise ` +
            i`an ethics concern anonymously or with a name attributed, ` +
            i`but you ***must*** include sufficient information about the ` +
            i`specific concern such that Wish can look into the matter.`
          }
          openLinksInNewTab
        />
      </div>
      <Text weight="bold" className={css(styles.subHeader)}>
        Misuse of the Third Party Ethics Hotline will not be tolerated.
      </Text>
      <div className={css(styles.introSentence)}>
        When using the Third Party Ethics Hotline, all logistics providers must
        certify that they have a contractual third party relationship with Wish
        and that the information they are submitting is truthful, accurate, and
        relates to a potential ethics matter. Inappropriate use of the Third
        Party Ethics Hotline may be subject to action under applicable law or
        your contract with Wish.
      </div>
      <div className={css(styles.introSentence)}>
        As always, if you have general concerns or questions that are not ethics
        related, you can raise them to your usual contact person at Wish.
      </div>
      <Text weight="bold" className={css(styles.header)}>
        Third Party Ethics Hotline FAQs
      </Text>
      {QA_OTHER.map(({ question, answer }, i) => (
        <>
          <div>
            Q{i + 1}. {question}
          </div>
          <div className={css(styles.introSentence)}>
            A{i + 1}. {answer}
          </div>
        </>
      ))}
    </div>
  );

  return content;
};

export default observer(ThirdPartyEthicsHotline);

const useStylesheet = (props: ThirdPartyEthicsHotlineProps) =>
  StyleSheet.create({
    header: {
      fontSize: 25,
      marginBottom: 10,
      paddingTop: 30,
      textAlign: "center",
      borderTop: `1px solid ${palettes.greyScaleColors.DarkGrey}`,
    },
    subHeader: {
      fontSize: 20,
      marginBottom: 10,
      marginTop: 30,
    },
    standAloneText: {
      marginBottom: 10,
      marginTop: 10,
    },
    introSentence: {
      marginBottom: 10,
    },
    bulletPoints: {
      display: "flex",
      flexDirection: "column",
      marginLeft: 20,
    },
    bullet: {
      display: "list-item",
      listStyleType: "disc",
      listStylePosition: "inside",
    },
  });
