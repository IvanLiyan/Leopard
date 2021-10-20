import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import faker from "faker/locale/en";
import _ from "lodash";

/* Lego Components */
import {
  Card,
  Banner,
  Layout,
  PrimaryButton,
  RadioGroup,
  Field,
  Text,
  Button,
  TextInput,
  FormSelect,
  AttachmentInfo,
  Popover,
} from "@ContextLogic/lego";

/* Merchant Components */
import { SecureFileInput } from "@merchant/component/core";
import { Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStringQueryParam } from "@toolkit/url";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";

/* Model */
import { CountryCode } from "@schema/types";
import EuVatQuestionnaireState from "@merchant/model/tax/EuVatQuestionnaireState";
import { EuVatQuestionnaireInitialData } from "@toolkit/tax/eu-vat";

type Props = BaseProps & {
  readonly initialData: EuVatQuestionnaireInitialData;
};

const EuVatQuestionnaire = ({
  className,
  style,
  initialData: {
    platformConstants: { euVatCountries },
  },
}: Props) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const [state] = useState(new EuVatQuestionnaireState());
  const [queryRedirect] = useStringQueryParam("redirect");
  const [attachments, setAttachments] = useState<ReadonlyArray<AttachmentInfo>>(
    [],
  );

  useEffect(() => {
    if (queryRedirect != null && queryRedirect.trim() !== "") {
      state.redirect = queryRedirect;
    }
  }, [queryRedirect, state]);

  const euCountries = useMemo(
    () => _.sortBy(euVatCountries, (country) => country.name),
    [euVatCountries],
  );

  const upload = async (attachments: ReadonlyArray<AttachmentInfo>) => {
    if (attachments.length === 0) {
      setAttachments([]);
      state.fileUrl = null;
      return;
    }

    const file = attachments[0];
    setAttachments(attachments);

    state.fileUrl = file.url;
  };

  const clearInputs = () =>
    runInAction(() => {
      if (!state.subjectToTaxInEu) {
        state.fileUrl = null;
      }

      if (!state.businessAddressInEu) {
        state.streetAddress1 = null;
        state.countryCode = null;
        state.state = null;
        state.city = null;
        state.zipcode = null;
      }

      if (!state.registeredWithTradeRegistryInEu) {
        state.businessRegistrationNumber = null;
        state.euVatRegistrationCountryCode = null;
      }
    });

  return (
    <Card
      title={i`EU VAT Questionnaire`}
      style={css(className, style)}
      contentContainerStyle={css(styles.card)}
    >
      <Layout.FlexColumn>
        <Banner
          sentiment="info"
          text={
            <Text>
              To avoid double taxation or non-taxation, please answer the
              following question(s) to help us determine your EU VAT obligation.
              An incorrect response may lead to VAT and/or customs underpayment
              for which Wish will hold you liable.
            </Text>
          }
        />
        <Field
          className={css(styles.field)}
          title={
            i`Are you subject to Corporate Income Tax or Personal Income Tax in any of the ` +
            i`EU Member States?`
          }
        >
          <RadioGroup
            layout="horizontal"
            onSelected={(value) => {
              state.subjectToTaxInEu = value;
              clearInputs();
            }}
            selectedValue={state.subjectToTaxInEu}
          >
            <RadioGroup.Item value text={i`Yes`} />
            <RadioGroup.Item value={false} text={i`No`} />
          </RadioGroup>
        </Field>

        {state.subjectToTaxInEu && (
          <>
            <Text weight="semibold" className={css(styles.field)}>
              Upload your supporting document
            </Text>
            <Layout.GridRow
              templateColumns="1fr 1fr"
              gap={30}
              className={css(styles.upload)}
            >
              <SecureFileInput
                accepts=".jpg,.jpeg,.png"
                onAttachmentsChanged={upload}
                bucket="TEMP_UPLOADS_V2"
                maxSizeMB={5}
                maxAttachments={1}
                attachments={attachments}
              />
            </Layout.GridRow>
          </>
        )}
        {state.subjectToTaxInEu != null && !state.subjectToTaxInEu && (
          <>
            <Field
              className={css(styles.field)}
              title={i`Do you employ personnel in any of the EU Member States?`}
            >
              <RadioGroup
                layout="horizontal"
                onSelected={(value) => {
                  state.employPersonnelInEu = value;
                }}
                selectedValue={state.employPersonnelInEu}
              >
                <RadioGroup.Item value text={i`Yes`} />
                <RadioGroup.Item value={false} text={i`No`} />
              </RadioGroup>
            </Field>

            <Field
              className={css(styles.field)}
              title={
                i`Do you have a business address (e.g., a rented office space) in any of the ` +
                i`EU Member States?`
              }
            >
              <RadioGroup
                layout="horizontal"
                onSelected={(value) => {
                  state.businessAddressInEu = value;
                  clearInputs();
                }}
                selectedValue={state.businessAddressInEu}
              >
                <RadioGroup.Item value text={i`Yes`} />
                <RadioGroup.Item value={false} text={i`No`} />
              </RadioGroup>
            </Field>

            {state.businessAddressInEu && (
              <>
                <Layout.GridRow
                  templateColumns="1fr 1fr"
                  gap={30}
                  className={css(styles.field, styles.subField)}
                >
                  <Field title={i`Business street address*`}>
                    <TextInput
                      value={state.streetAddress1}
                      onChange={({ text }) => {
                        state.streetAddress1 = text;
                      }}
                      debugValue={faker.address.streetAddress()}
                    />
                  </Field>
                </Layout.GridRow>

                <Layout.GridRow
                  templateColumns="1fr 1fr"
                  gap={30}
                  className={css(styles.field, styles.subField)}
                >
                  <Field
                    title={() => (
                      <Layout.FlexRow>
                        <Text>Country/Region*</Text>
                        <Popover
                          popoverContent={i`Monaco is treated as a territory of France for VAT purposes`}
                        >
                          <Icon
                            name="info"
                            size={16}
                            className={css(styles.info)}
                          />
                        </Popover>
                      </Layout.FlexRow>
                    )}
                  >
                    <FormSelect
                      options={euCountries.map((country) => ({
                        value: country.code,
                        text: country.name,
                      }))}
                      placeholder={i`Enter country or region`}
                      selectedValue={state.countryCode}
                      onSelected={(value: string) => {
                        state.countryCode = value as CountryCode;
                      }}
                    />
                  </Field>
                  <Field title={i`State/Province*`}>
                    <TextInput
                      value={state.state}
                      onChange={({ text }) => {
                        state.state = text;
                      }}
                      debugValue={faker.address.state()}
                    />
                  </Field>
                </Layout.GridRow>

                <Layout.GridRow
                  templateColumns="1fr 1fr"
                  gap={30}
                  className={css(styles.field, styles.subField)}
                >
                  <Field title={i`City*`}>
                    <TextInput
                      value={state.city}
                      onChange={({ text }) => {
                        state.city = text;
                      }}
                      debugValue={faker.address.city()}
                    />
                  </Field>
                  <Field title={i`Zip/Postal code*`}>
                    <TextInput
                      value={state.zipcode}
                      onChange={({ text }) => {
                        state.zipcode = text;
                      }}
                      debugValue={faker.address.zipCode()}
                    />
                  </Field>
                </Layout.GridRow>
              </>
            )}

            <Field
              className={css(styles.field)}
              title={
                i`Are you registered with a trade registry, and/or are you VAT registered ` +
                i`anywhere in the European Union?`
              }
            >
              <RadioGroup
                layout="horizontal"
                onSelected={(value) => {
                  state.registeredWithTradeRegistryInEu = value;
                  clearInputs();
                }}
                selectedValue={state.registeredWithTradeRegistryInEu}
              >
                <RadioGroup.Item value text={i`Yes`} />
                <RadioGroup.Item value={false} text={i`No`} />
              </RadioGroup>
            </Field>

            {state.registeredWithTradeRegistryInEu && (
              <>
                <Layout.GridRow
                  templateColumns="1fr 1fr"
                  gap={30}
                  className={css(styles.field, styles.subField)}
                >
                  <Field title={i`Value-Added Tax (VAT) Number`}>
                    <TextInput
                      value={state.vatNumber}
                      onChange={({ text }) => {
                        state.vatNumber = text;
                      }}
                      debugValue={faker.random.number().toString()}
                    />
                    {state.euTradeRegistrationErrorMsg && (
                      <Text className={css(styles.error)}>
                        {state.euTradeRegistrationErrorMsg}
                      </Text>
                    )}
                  </Field>
                  <Field title={i`Business Registration Number`}>
                    <TextInput
                      value={state.businessRegistrationNumber}
                      onChange={({ text }) => {
                        state.businessRegistrationNumber = text;
                      }}
                      debugValue={faker.random.number().toString()}
                    />
                  </Field>
                </Layout.GridRow>
                <Layout.GridRow
                  templateColumns="1fr 1fr"
                  gap={30}
                  className={css(styles.field, styles.subField)}
                >
                  <Field
                    title={i`Country/Region for Value-Added Tax (VAT) Registration*`}
                  >
                    <FormSelect
                      options={euCountries.map((country) => ({
                        value: country.code,
                        text: country.name,
                      }))}
                      disabled={
                        state.vatNumber == null || state.vatNumber.trim() === ""
                      }
                      placeholder={i`Enter country or region`}
                      selectedValue={state.euVatRegistrationCountryCode}
                      onSelected={(value: string) => {
                        state.euVatRegistrationCountryCode =
                          value as CountryCode;
                      }}
                    />
                  </Field>
                </Layout.GridRow>
              </>
            )}
          </>
        )}

        <Layout.FlexRow
          justifyContent="flex-end"
          alignItems="flex-end"
          className={css(styles.field)}
        >
          <Button onClick={async () => await navigationStore.back()}>
            Cancel
          </Button>
          <PrimaryButton
            onClick={async () => await state.submit()}
            isDisabled={!state.isValid || state.isSubmitting}
            className={css(styles.button)}
          >
            Submit
          </PrimaryButton>
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(EuVatQuestionnaire);

const useStylesheet = () => {
  const { textBlack, surfaceLightest, negative } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          color: textBlack,
          padding: "30px 48px",
          backgroundColor: surfaceLightest,
        },
        field: {
          marginTop: 30,
        },
        button: {
          marginLeft: 16,
        },
        upload: {
          marginTop: 12,
        },
        subField: {
          padding: "0 28px",
        },
        error: {
          color: negative,
          fontSize: 14,
          marginTop: 8,
        },
        info: {
          marginLeft: 8,
        },
      }),
    [textBlack, surfaceLightest, negative],
  );
};
