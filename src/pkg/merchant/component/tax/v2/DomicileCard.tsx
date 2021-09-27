import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Markdown, Text, Layout } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName } from "@toolkit/countries";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import { CountryCode, CommerceMerchantEuEntityStatus } from "@schema/types";
import { PickedAccountManagerSchema } from "@toolkit/tax/types-v2";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Relative Imports */
import ValidatedLabel from "./ValidatedLabel";
import ValidatedLabelEU from "./ValidatedLabelEU";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

export type DomicileCardProps = BaseProps & {
  readonly hasCompletedSellerVerification: boolean;
  readonly verificationRequired: boolean;
  readonly countryOfDomicileCode?: CountryCode | null | undefined;
  readonly euVatEntityStatus?:
    | CommerceMerchantEuEntityStatus
    | null
    | undefined;
  readonly isEuVatQuestionnaireRequired?: boolean | null | undefined;
  readonly accountManager?: PickedAccountManagerSchema | null | undefined;
};

const DomicileCard: React.FC<DomicileCardProps> = ({
  className,
  style,
  hasCompletedSellerVerification: isValidated,
  countryOfDomicileCode: code,
  verificationRequired,
  euVatEntityStatus,
  isEuVatQuestionnaireRequired,
  accountManager,
}: DomicileCardProps) => {
  const styles = useStylesheet();

  let description;
  if (code && !verificationRequired) {
    description =
      i`Since you have provided your store's country/region of ` +
      i`domicile, you can set up your taxes and automate tax collection ` +
      i`and reports.`;
  } else if (!verificationRequired) {
    description =
      i`Please provide your country/region of domicile to allow ` +
      i`Wish to set up your taxes and automate tax collection and reports. ` +
      i`[Learn more](${zendeskURL("360050893133")})`;
  } else {
    description =
      i`When your store is validated, Wish allows you to set ` +
      i`up your taxes based on your country/region of domicile and automate tax ` +
      i`collection and reports. [Learn more](${zendeskURL("360050893133")})`;
  }

  const accountManagerEmail = accountManager?.email;

  const helpDeskLink = zendeskURL("4402351430043");
  const learnMoreLink = zendeskURL("4402344018075");

  const euDescriptions: {
    readonly [state in CommerceMerchantEuEntityStatus]: string;
  } = {
    PENDING_REVIEW:
      i`Your EU VAT Questionnaire has been successfully submitted and is currently ` +
      i`being reviewed by the Wish team. Until your EU establishment status is ` +
      i`finalized, Wish will assume you do not have an EU establishment yet. For ` +
      i`more details about how your EU establishment status affects your EU VAT ` +
      i`obligations, visit [this Help Center article](${helpDeskLink}).`,
    NOT_STARTED:
      i`You have not submitted your EU VAT Questionnaire yet. Click below to ` +
      i`complete the questionnaire as soon as possible, so Wish may determine your ` +
      i`tax obligations and avoid VAT issues such as double taxation or non-taxation. ` +
      i`[Learn more](${learnMoreLink})`,
    NOT_ESTABLISHED:
      i`Your EU VAT Questionnaire has been successfully submitted and it has been ` +
      i`determined that you do not have an EU establishment. If you believe this is ` +
      i`incorrect or your EU establishment status has changed, click below to access ` +
      i`the questionnaire again and re-submit your answers. For more details about ` +
      i`how your EU establishment status affects your EU VAT obligations, visit ` +
      i`[this Help Center article](${helpDeskLink}).`,
    VALIDATED:
      i`Based on a review of the answers you provided in the EU VAT Questionnaire, ` +
      i`the Wish team has determined that you have an EU establishment. For more ` +
      i`details about how your EU establishment status affects your EU VAT obligations, ` +
      i`visit [this Help Center article](${helpDeskLink}).`,
    REJECTED:
      i`Based on a review of the answers you provided in the EU VAT Questionnaire, the ` +
      i`Wish team has rejected your submission and determined that you do not have an ` +
      i`EU establishment. If you believe you provided inaccurate information in the ` +
      i`questionnaire, click below to access it again and re-submit your answers. You ` +
      i`can also contact your account Manager at ` +
      i`[${accountManagerEmail}](mailto:${accountManagerEmail}) to inquire ` +
      i`about the reason(s) for rejection. For more details about how your EU ` +
      i`establishment status affects your EU VAT obligations, visit [this Help ` +
      i`Center article](${helpDeskLink}). The country/region of ` +
      i`domicile determines where you report taxes for your store.`,
  };

  const status = euVatEntityStatus || "NOT_STARTED";

  const euDescription: string = euDescriptions[status];

  const questionnaireButtonText =
    euVatEntityStatus === "NOT_STARTED"
      ? i`Start Questionnaire`
      : i`Resubmit Questionnaire`;

  return (
    <Card className={css(styles.root, className, style)}>
      <Layout.FlexRow className={css(styles.header)}>
        <div className={css(styles.headerText)}>
          <Text weight="bold">Tax Identity Validation</Text>
        </div>
      </Layout.FlexRow>
      <Layout.FlexColumn className={css(styles.content)}>
        <Layout.FlexRow className={css(styles.contentHeader)}>
          <Layout.FlexRow className={css(styles.leftContentHeader)}>
            <Text weight="bold">Country/Region of Domicile</Text>
          </Layout.FlexRow>
          <Layout.FlexRow className={css(styles.rightContentHeader)}>
            {code != null && (
              <Flag className={css(styles.flag)} countryCode={code} />
            )}
            {code != null && getCountryName(code)}
            {(verificationRequired || !code) && (
              <ValidatedLabel
                className={css(styles.label)}
                state={isValidated ? "VALIDATED" : "INCOMPLETE"}
              />
            )}
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Markdown
          className={css(styles.paragraph)}
          text={description}
          openLinksInNewTab
        />
        {isEuVatQuestionnaireRequired && (
          <Layout.FlexColumn>
            <Layout.FlexRow className={css(styles.contentHeader)}>
              <Layout.FlexRow className={css(styles.leftContentHeader)}>
                <Text weight="bold">European Union (EU) Establishment</Text>
              </Layout.FlexRow>
              <Layout.FlexRow className={css(styles.rightContentHeader)}>
                <ValidatedLabelEU
                  className={css(styles.label)}
                  state={status}
                />
              </Layout.FlexRow>
            </Layout.FlexRow>
            <Markdown
              className={css(styles.paragraph)}
              text={euDescription}
              openLinksInNewTab
            />

            {!["PENDING_REVIEW", "VALIDATED"].includes(
              euVatEntityStatus || ""
            ) && (
              <div className={css(styles.button)}>
                <PrimaryButton href="/tax/eu-vat-questionnaire?redirect=/tax/settings">
                  {questionnaireButtonText}
                </PrimaryButton>
              </div>
            )}
          </Layout.FlexColumn>
        )}
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(DomicileCard);

const useStylesheet = () => {
  const { borderPrimaryDark, textDark, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        header: {
          paddingBottom: 18,
          borderBottom: `1px dashed ${borderPrimaryDark}`,
        },
        headerText: {
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
          flex: 1,
          paddingRight: 8,
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        label: {
          marginLeft: 8,
        },
        content: {
          marginTop: 24,
        },
        contentHeader: {
          paddingBottom: 16,
        },
        leftContentHeader: {
          fontSize: 16,
          lineHeight: "24px",
          color: textBlack,
          flex: 1,
          paddingRight: 8,
        },
        rightContentHeader: {
          fontSize: 14,
          lineHeight: "16px",
          color: textDark,
        },
        paragraph: {
          ":not(:last-child)": {
            marginBottom: 28,
          },
          color: textDark,
          fontSize: 16,
          lineHeight: "24px",
        },
        button: {
          maxWidth: "190px",
        },
      }),
    [borderPrimaryDark, textDark, textBlack]
  );
};
