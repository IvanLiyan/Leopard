import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown, HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { weightSemibold } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Schema */
import { PaymentSettingsInitialData } from "@toolkit/payment-settings";

type Props = BaseProps & {
  readonly initialData: PaymentSettingsInitialData;
};

const PersonalSettings: React.FC<Props> = (props: Props) => {
  const {
    initialData: {
      payments: {
        currentMerchant: { personalInfo, businessInfo },
      },
    },
  } = props;
  const styles = useStylesheet();

  const identityTip =
    i`**Identity Information**` +
    `\n\n` +
    i`Your identity and contact information needs to be collected for the real ` +
    i`name authentication system. We will strictly protect and ensure the security ` +
    i`of your personal information. ` +
    i`[Learn more](${zendeskURL("360003099994")})`;

  const showBusiness = businessInfo;

  if (!personalInfo) {
    return null;
  }

  return (
    <>
      <HorizontalField
        title={
          showBusiness
            ? i`Primary contact information`
            : i`Personal information`
        }
        titleAlign="start"
        titleStyle={styles.titleStyle}
        popoverSentiment="info"
        popoverContent={() => (
          <div className={css(styles.tooltip)}>
            <Markdown text={identityTip} />
          </div>
        )}
        popoverPosition="bottom center"
      />
      {personalInfo?.name && (
        <HorizontalField titleAlign="start" title={i`Full name`}>
          {personalInfo?.name}
        </HorizontalField>
      )}
      {personalInfo?.phoneNumber && (
        <HorizontalField titleAlign="start" title={i`Phone number`}>
          {personalInfo?.phoneNumber}
        </HorizontalField>
      )}
    </>
  );
};

export default observer(PersonalSettings);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        titleStyle: {
          fontWeight: weightSemibold,
          color: textBlack,
        },
        tooltip: {
          color: textBlack,
          padding: 12,
          maxWidth: 236,
        },
      }),
    [textBlack],
  );
};
