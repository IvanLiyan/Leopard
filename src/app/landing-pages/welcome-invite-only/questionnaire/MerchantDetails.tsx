import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, RadioGroup, Text, Info } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import MerchantLeadSubmissionState from "./MerchantLeadSubmissionState";
import { useTheme } from "@core/stores/ThemeStore";
import FormInputRow from "./FormInputRow";
import { QuestionPrompts } from "src/app/landing-pages/welcome-invite-only/toolkit/form-options";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly submissionState: MerchantLeadSubmissionState;
};

const MerchantDetails = (props: Props) => {
  const { className, submissionState, style } = props;
  const styles = useStylesheet();

  const [renderPlatformField, setRenderPlatformField] = useState(false);

  const redirectLink = `/merchant_apps?offset=36`;
  const infoText =
    i`Some merchants use 3rd party tools to help them ` +
    i`better manage their products, shipping, and other business needs. ` +
    i`[Learn more](${redirectLink})`;

  return (
    <Layout.FlexColumn alignItems="stretch" style={[style, className]}>
      <FormInputRow
        onChange={(e) => (submissionState.websiteUrl = e.text)}
        title={QuestionPrompts.WEBSITE}
        value={submissionState.websiteUrl || ""}
        onBeginEditing={() => (submissionState.isWebsiteUrlValid = true)}
        placeholder={ci18n(
          "Meaning the web address of the merchant's website, stands for uniform resource locator",
          "URL",
        )}
        validationResponse={
          submissionState.isWebsiteUrlValid
            ? null
            : i`Please enter your company website URL`
        }
        style={styles.row}
      />
      <Layout.FlexRow justifyContent="space-between" style={styles.row}>
        <Layout.FlexRow
          justifyContent="flex-start"
          alignItems="flex-start"
          style={styles.platform}
        >
          <Text weight="semibold" style={styles.title}>
            {QuestionPrompts.PARTNER}
          </Text>
          <Info
            style={styles.tooltip}
            size={16}
            position="top center"
            sentiment="info"
            popoverMaxWidth={250}
            popoverContent={infoText}
            openContentLinksInNewTab
          />
        </Layout.FlexRow>
        <RadioGroup
          onSelected={(e: boolean) => setRenderPlatformField(e)}
          selectedValue={renderPlatformField}
          style={styles.radioGroup}
        >
          <RadioGroup.Item
            value
            text={ci18n("Affirmative answer to question", "Yes")}
          />
          <RadioGroup.Item
            value={false}
            text={ci18n("Negative answer to question", "No")}
          />
        </RadioGroup>
      </Layout.FlexRow>
      {renderPlatformField && (
        <FormInputRow
          style={styles.row}
          onChange={(e) => (submissionState.merchantPartner = e.text)}
          title={QuestionPrompts.PLATFORM}
          value={submissionState.merchantPartner || ""}
          placeholder={i`Please separate with a comma`}
        />
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          marginTop: 20,
        },
        info: {
          marginLeft: 8,
        },
        radioGroup: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: 120,
        },
        title: {
          marginBottom: 5,
          fontSize: 15,
          color: textDark,
        },
        popover: {
          padding: 15,
        },
        tooltip: {
          margin: "4px 0px 0px 8px",
        },
        platform: {
          width: "65%",
          marginTop: 10,
        },
      }),
    [textDark],
  );
};

export default observer(MerchantDetails);
