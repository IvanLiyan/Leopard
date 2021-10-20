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
        currentMerchant: { businessInfo },
      },
    },
  } = props;
  const styles = useStylesheet();

  const businessCodeTip =
    i`**Business registration code**` +
    `\n\n` +
    i`Please enter the Employer Identification Number (EIN) that is used to identify ` +
    i`your business. ` +
    i`[Learn more](${zendeskURL("360003099994")})`;

  if (!businessInfo) {
    return null;
  }

  return (
    <>
      <HorizontalField
        title={i`Business information`}
        titleAlign="start"
        titleStyle={styles.titleStyle}
      />
      {businessInfo?.name && (
        <HorizontalField titleAlign="start" title={i`Business name`}>
          {businessInfo?.name}
        </HorizontalField>
      )}
      {businessInfo?.businessId && (
        <HorizontalField
          titleAlign="start"
          title={i`Business registration code`}
          popoverSentiment="info"
          popoverContent={() => (
            <div className={css(styles.tooltip)}>
              <Markdown text={businessCodeTip} />
            </div>
          )}
          popoverPosition="bottom center"
        >
          {businessInfo?.businessId}
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
