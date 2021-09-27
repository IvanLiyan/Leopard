import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown, Card, HorizontalField } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { weightSemibold } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import NavigationStore from "@merchant/stores/NavigationStore";

/* Plus */
import SettingsSection from "@plus/component/settings/toolkit/SettingsSection";

/* Relative Imports */
import EditButton from "./EditButton";
import CurrencySettings from "./currency/CurrencySettings";
import PersonalSettings from "./PersonalSettings";
import BusinessSettings from "./BusinessSettings";
import ExtraSettings from "./ExtraSettings";
import PaymentProviderDetails from "./PaymentProviderDetails";
import PaymentAlert from "./PaymentAlert";

/* Schema */
import { PaymentSettingsInitialData } from "@toolkit/payment-settings";

type Props = BaseProps & {
  readonly initialData: PaymentSettingsInitialData;
};

const PaymentSettingsEmpty: React.FC = () => {
  const styles = useStylesheet();

  const text =
    i`You have not selected a payment provider yet, please set up your payment ` +
    i`information below so you can receive payouts from Wish. Payments are disbursed ` +
    i`to your account twice a month.
`;

  return (
    <div className={css(styles.root)}>
      <article className={css(styles.card)}>
        <div className={css(styles.content)}>
          <p className={css(styles.header)} style={{ padding: "24px 0" }}>
            How would you like to get paid?
          </p>
          <Markdown text={text} />

          <PrimaryButton
            className={css(styles.button)}
            href="/plus/settings/payment/edit"
            style={{ padding: "0 30px" }}
          >
            Set up payment information
          </PrimaryButton>
        </div>
        <div className={css(styles.footerContainer)}>
          <Markdown
            text={`Having trouble? [View our guide](${zendeskURL(
              "205212517"
            )})`}
          />
        </div>
      </article>
    </div>
  );
};

const PaymentSettings: React.FC<Props> = (props: Props) => {
  const { initialData } = props;
  const {
    payments: {
      currentMerchant: { currentProvider, businessInfo, canEditPaymentInfo },
    },
    currentMerchant: { primaryCurrency, isStoreMerchant },
  } = initialData;

  const styles = useStylesheet();
  const navigationStore = NavigationStore.instance();

  const showBusiness = businessInfo != null;

  return currentProvider ? (
    <div className={css(styles.root)}>
      <div>
        <PaymentAlert initialData={initialData} />
        <Card className={css(styles.content)}>
          <SettingsSection
            title=""
            style={{ paddingBottom: 24, paddingRight: 26 }}
            hasBottomBorder
          >
            <div className={css(styles.banner)}>
              {currentProvider && (
                <img src={currentProvider.logo} className={css(styles.logo)} />
              )}
              <EditButton
                onEdit={() =>
                  navigationStore.navigate("/plus/settings/payment/edit")
                }
                disabled={!canEditPaymentInfo}
              />
            </div>
            <Markdown
              text={
                i`Your store accepts payments through ${currentProvider.name}. Payments are ` +
                i`disbursed to your account twice a month. Please verify your ` +
                i`details to recieve timely and predictable payouts from Wish.`
              }
              style={{ paddingRight: 25 }}
            />
          </SettingsSection>
          <div className={css(styles.section, styles.data)}>
            <p className={css(styles.header)}>
              Your {currentProvider.name} details
            </p>
            {!isStoreMerchant && (
              <HorizontalField
                title={i`Receive payment as`}
                titleAlign="start"
                titleStyle={styles.titleStyle}
              >
                {showBusiness ? i`A business` : i`An individual`}
              </HorizontalField>
            )}
            <PersonalSettings initialData={initialData} />
            <BusinessSettings initialData={initialData} />
            <ExtraSettings
              initialData={initialData}
              providerType={currentProvider.type}
            />
          </div>
        </Card>
        {!isStoreMerchant && (
          <CurrencySettings currentCurrency={primaryCurrency} />
        )}
      </div>
      {!isStoreMerchant && (
        <PaymentProviderDetails providerType={currentProvider.type} />
      )}
    </div>
  ) : (
    <PaymentSettingsEmpty />
  );
};

export default observer(PaymentSettings);

const useStylesheet = () => {
  const {
    surfaceLightest,
    pageBackground,
    textDark,
    textLight,
    textBlack,
    borderPrimary,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: 24,
          display: "grid",
          gridGap: 20,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "2fr 1fr",
          },
        },
        card: {
          borderRadius: 4,
          border: `solid 1px ${borderPrimary}`,
          backgroundColor: surfaceLightest,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "0 24px 24px 24px",
          color: textDark,
          marginBottom: 24,
        },
        header: {
          color: textBlack,
          lineHeight: "24px",
          fontWeight: weightSemibold,
        },
        button: {
          marginTop: 24,
          height: 40,
          boxSizing: "border-box",
          fontWeight: weightSemibold,
          fontSize: 16,
        },
        footer: {
          fontSize: 14,
          fontStyle: "normal",
          color: textDark,
        },
        footerContainer: {
          background: pageBackground,
          borderTop: `solid 1px ${borderPrimary}`,
          padding: "13px 20px",
        },
        section: {
          paddingTop: 24,
          ":nth-child(1n) > :not(:last-child)": {
            marginBottom: 20,
          },
        },
        titleStyle: {
          fontWeight: weightSemibold,
          color: textBlack,
        },
        data: {
          color: textLight,
        },
        tooltip: {
          color: textBlack,
          padding: 12,
          maxWidth: 236,
        },
        banner: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        },
        logo: {
          maxHeight: 40,
        },
      }),
    [
      surfaceLightest,
      textDark,
      textLight,
      textBlack,
      pageBackground,
      borderPrimary,
    ]
  );
};
