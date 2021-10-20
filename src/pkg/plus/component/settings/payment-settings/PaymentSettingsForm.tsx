import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";

/* Lego Components */
import {
  Markdown,
  Field,
  FormSelect,
  TextInput,
  RadioGroup,
  Info,
  PrimaryButton,
} from "@ContextLogic/lego";

import { PhoneNumberField } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { weightSemibold, weightNormal, weightBold } from "@toolkit/fonts";
import {
  RequiredValidator,
  EmailValidator,
  NumbersOnlyValidator,
} from "@toolkit/validators";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Schema */
import {
  PaymentSettingsInitialData,
  PickedPaymentProvider,
  SUPPORTED_PAYMENT_PROVIDERS,
} from "@toolkit/payment-settings";
import { PayoutPaymentProviderType } from "@schema/types";

/* Model */
import PaymentSettingsState from "@plus/model/PaymentSettingsState";

/* Relative Imports */
import PaymentProviderDetails from "./PaymentProviderDetails";

type Props = BaseProps & {
  readonly initialData: PaymentSettingsInitialData;
  readonly editState: PaymentSettingsState;
};

const PaymentSettingsForm: React.FC<Props> = (props: Props) => {
  const {
    initialData: {
      payments: {
        currentMerchant: { allowedProviders, currentProvider },
      },
      currentMerchant: { isStoreMerchant },
    },
    className,
    editState,
  } = props;

  const [phoneNumberCc, setPhoneNumberCc] = useState<CountryCode>("US");

  const providers: PickedPaymentProvider[] = [
    ...(allowedProviders || []),
    ...(currentProvider ? [currentProvider] : []),
  ];

  const [showBusiness, setShowBusiness] = useState<boolean>(
    editState.collectorType === "BUSINESS",
  );

  const shouldShowPayPal = () => {
    if (!isStoreMerchant) {
      return currentProvider?.type
        ? currentProvider.type.startsWith("PAYPAL")
        : !!providers.find((provider) => provider.type.startsWith("PAYPAL"));
    }

    return true;
  };

  const [showPayPal, setShowPayPal] = useState<boolean>(shouldShowPayPal());

  const hasExistingData = !!currentProvider;

  const providerOptions = hasExistingData
    ? providers.map((provider) => ({
        value: provider.type,
        text: provider.name,
      }))
    : SUPPORTED_PAYMENT_PROVIDERS.map((provider) => ({
        value: provider.type,
        text: provider.name,
      }));

  const styles = useStylesheet();

  const identityTip =
    i`**Identity Information**` +
    `\n\n` +
    i`Your identity and contact information needs to be collected for the real ` +
    i`name authentication system. We will strictly protect and ensure the security ` +
    i`of your personal information. ` +
    i`[Learn more](${zendeskURL("360003099994")})`;

  const businessCodeTip =
    i`**Business registration code**` +
    `\n\n` +
    i`Please enter the Employer Identification Number (EIN) that is used to identify ` +
    i`your business. ` +
    i`[Learn more](${zendeskURL("360003099994")})`;

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.left, styles.card)}>
        <div className={css(styles.titleContainer, styles.title)}>
          {isStoreMerchant
            ? i`Provide your Paypal information to receive Wish Local payments`
            : i`Payment information`}
        </div>
        <div
          className={
            isStoreMerchant
              ? css(styles.content)
              : css(styles.content, styles.section)
          }
        >
          {!isStoreMerchant && (
            <>
              <Field
                title={i`Select payment provider`}
                className={css(styles.row, styles.fieldGroup)}
              >
                <FormSelect
                  options={providerOptions}
                  onSelected={(value: PayoutPaymentProviderType) => {
                    setShowPayPal(
                      value === "PAYPAL" || value === "PAYPAL_MERCH",
                    );
                    editState.paymentProvider = value;
                  }}
                  selectedValue={editState.paymentProvider}
                  disabled={editState.isSubmitting}
                  placeholder={i`Select`}
                />
              </Field>
              <Field
                title={i`Receive payment as:`}
                className={css(styles.row, styles.fieldGroup)}
              >
                <RadioGroup
                  style={{ ...styles.radioGroup }}
                  itemStyle={{ margin: 0 }}
                  selectedValue={showBusiness ? "BUSINESS" : "INDIVIDUAL"}
                  onSelected={(value) => {
                    setShowBusiness(value === "BUSINESS");
                    editState.collectorType = value;
                  }}
                  layout="horizontal"
                  disabled={editState.isSubmitting}
                >
                  <RadioGroup.Item
                    value="INDIVIDUAL"
                    text={i`An individual`}
                    style={{
                      fontWeight: showBusiness ? weightNormal : weightSemibold,
                    }}
                  />
                  <RadioGroup.Item
                    value="BUSINESS"
                    text={i`A business`}
                    style={{
                      fontWeight: showBusiness ? weightSemibold : weightNormal,
                    }}
                  />
                </RadioGroup>
              </Field>
            </>
          )}
          {showPayPal && (
            <Field
              title={i`PayPal account email address`}
              className={css(styles.row, styles.fieldGroup)}
            >
              <TextInput
                placeholder={i`Enter your email address`}
                onChange={({ text }) => {
                  editState.email = text;
                }}
                disabled={editState.isSubmitting}
                validators={[
                  new EmailValidator({
                    customMessage: i`Please enter a valid email address`,
                    allowBlank: !hasExistingData,
                  }),
                  new RequiredValidator({ allowBlank: !hasExistingData }),
                ]}
                onValidityChanged={(isValid) => {
                  editState.isEmailValid = isValid;
                }}
                debugValue={faker.internet.email()}
              />
            </Field>
          )}
          {isStoreMerchant && (
            <div className={css(styles.fieldGroup)}>
              <PrimaryButton
                onClick={async () => await editState.submit()}
                isDisabled={!editState.formValid}
                minWidth
              >
                Submit
              </PrimaryButton>
            </div>
          )}
        </div>
        {!isStoreMerchant && (
          <div className={css(styles.content)}>
            <div className={css(styles.row, styles.info)}>
              <span className={css(styles.label)}>
                Please enter your personal information
              </span>
              <Info
                size={13}
                sentiment="info"
                className={css(styles.icon)}
                popoverContent={() => (
                  <div className={css(styles.tooltip)}>
                    <Markdown text={identityTip} />
                  </div>
                )}
                popoverMaxWidth={236}
              />
            </div>
            <div className={css(styles.row, styles.fieldGroupWide)}>
              <Field
                title={
                  showBusiness ? i`Full name (primary contact)` : i`Full name`
                }
              >
                <TextInput
                  placeholder={i`Enter your full name`}
                  onChange={({ text }) => {
                    editState.personalName = text;
                  }}
                  disabled={editState.isSubmitting}
                  validators={[
                    new RequiredValidator({
                      customMessage: i`Please enter your full name`,
                      allowBlank: !hasExistingData,
                    }),
                  ]}
                  onValidityChanged={(isValid) => {
                    editState.isPersonalNameValid = isValid;
                  }}
                  value={
                    hasExistingData ? editState.formValues?.personalName : null
                  }
                  debugValue={faker.fake(
                    "{{name.lastName}} {{name.firstName}}",
                  )}
                />
              </Field>
              <Field title={i`Phone number`}>
                <PhoneNumberField
                  showTitle={false}
                  country={phoneNumberCc}
                  placeholder="(000) 000 - 0000"
                  style={{ marginTop: -5 }}
                  disabled={editState.isSubmitting}
                  onValidityChanged={(isValid) => {
                    editState.isPersonalPhoneNumberValid = isValid;
                  }}
                  onPhoneNumber={(params: {
                    country: CountryCode;
                    phoneNumber: string;
                  }) => {
                    const { country, phoneNumber } = params;
                    editState.personalPhoneNumber = phoneNumber;
                    setPhoneNumberCc(country);
                  }}
                  countryFixed={!phoneNumberCc}
                  validators={[
                    new RequiredValidator({
                      allowBlank: !hasExistingData,
                    }),
                  ]}
                  phoneNumber={
                    editState.formValues?.personalPhoneNumber.trim() == ""
                      ? null
                      : editState.formValues?.personalPhoneNumber
                  }
                  debugValue={faker.phone.phoneNumber()}
                />
              </Field>
            </div>
            {showBusiness && (
              <div className={css(styles.row, styles.fieldGroupWide)}>
                <Field title={i`Business name`}>
                  <TextInput
                    placeholder={i`Enter your business name`}
                    onChange={({ text }) => {
                      editState.businessName = text;
                    }}
                    disabled={editState.isSubmitting}
                    validators={[
                      new RequiredValidator({
                        customMessage: i`Please enter your business name`,
                        allowBlank: !hasExistingData,
                      }),
                    ]}
                    onValidityChanged={(isValid) => {
                      editState.isBusinessNameValid = isValid;
                    }}
                    value={
                      hasExistingData
                        ? editState.formValues?.businessName
                        : null
                    }
                    debugValue={faker.company.companyName()}
                  />
                </Field>
                <Field
                  title={i`Business registration code`}
                  description={() => (
                    <div className={css(styles.tooltip)}>
                      <Markdown text={businessCodeTip} />
                    </div>
                  )}
                >
                  <TextInput
                    placeholder={i`Enter registration code`}
                    onChange={({ text }) => {
                      editState.businessId = text;
                    }}
                    disabled={editState.isSubmitting}
                    validators={[
                      new NumbersOnlyValidator({
                        customMessage: i`Please enter a valid registration code`,
                      }),
                      new RequiredValidator({ allowBlank: !hasExistingData }),
                    ]}
                    onValidityChanged={(isValid) => {
                      editState.isBusinessIdValid = isValid;
                    }}
                    value={
                      hasExistingData ? editState.formValues?.businessId : null
                    }
                    debugValue={faker.random.number().toString()}
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </div>
      {editState.paymentProvider && (
        <PaymentProviderDetails
          providerType={editState.paymentProvider}
          className={css(styles.right)}
          isStoreMerchant={isStoreMerchant}
          setup
        />
      )}
    </div>
  );
};

export default observer(PaymentSettingsForm);

const useStylesheet = () => {
  const {
    surfaceLightest,
    textDark,
    pageBackground,
    textBlack,
    borderPrimary,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
        },
        left: {
          flex: 2,
        },
        right: {
          backgroundColor: surfaceLightest,
          boxSizing: "border-box",
          marginLeft: 20,
          flex: 1,
        },
        card: {
          borderRadius: 4,
          border: `solid 1px ${borderPrimary}`,
          backgroundColor: surfaceLightest,
        },
        content: {
          padding: "24px 25px",
          color: textDark,
        },
        header: {
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: weightSemibold,
          paddingBottom: 24,
        },
        titleContainer: {
          background: pageBackground,
          padding: "12px 20px",
        },
        title: {
          color: textBlack,
          fontSize: 16,
          fontWeight: weightBold,
          lineHeight: 1.5,
        },
        row: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        fieldGroup: {
          maxWidth: 350,
        },
        fieldGroupWide: {
          maxWidth: 496,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 16,
        },
        info: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        icon: {
          marginLeft: 10,
        },
        radioGroup: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 53,
        },
        label: {
          fontSize: 16,
        },
        tooltip: {
          color: textBlack,
          padding: 12,
          maxWidth: 236,
        },
        body: {
          fontSize: 14,
          lineHeight: "24px",
          padding: "24px 24px 14px 24px",
        },
        section: {
          borderBottom: `1px dashed ${borderPrimary}`,
        },
        button: {
          marginTop: 18,
          fontSize: 14,
          "@media (max-width: 900px)": {
            width: "100%",
          },
          "@media (min-width: 900px)": {
            width: "50%",
          },
        },
      }),
    [surfaceLightest, textDark, pageBackground, textBlack, borderPrimary],
  );
};
