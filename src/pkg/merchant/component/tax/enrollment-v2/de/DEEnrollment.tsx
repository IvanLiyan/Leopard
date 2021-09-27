/*
 * DEEnrollment.tsx
 *
 * Created by Jonah Dlin on Mon Nov 30 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  TextInput,
  BackButton,
  HorizontalField,
  PrimaryButton,
  AttachmentInfo,
  OnTextChangeEvent,
  Text,
  Layout,
} from "@ContextLogic/lego";
import { SecureFileInput } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  RegexBasedValidator,
  TaxNumberValidator,
  Validator,
} from "@toolkit/validators";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Stores */
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Toolkit */
import { AccountTypeDisplayNames } from "@toolkit/tax/types-v2";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";

export type DEEnrollmentProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const DEEnrollment: React.FC<DEEnrollmentProps> = ({
  className,
  style,
  editState,
}: DEEnrollmentProps) => {
  const {
    getCountryLevelSettings,
    entityType,
    hasCompletedSellerVerification,
    pushNext,
  } = editState;

  const [validator] = useState(new TaxNumberValidator({ countryCode: "DE" }));

  const isCompany = entityType != "INDIVIDUAL";

  const isOss = editState.isOss;

  const countryLevelInfo = useMemo(():
    | CommerceMerchantTaxInfo
    | null
    | undefined => {
    return getCountryLevelSettings("DE");
  }, [getCountryLevelSettings]);

  useMountEffect(() => {
    window.scrollTo(0, 0);
    if (countryLevelInfo != null) {
      // Clear out tax number if they selection is "no-vat".
      if (countryLevelInfo.deRegistrationSelection == "no-vat") {
        countryLevelInfo.taxNumber = null;
      }
    }
  });

  const taxStore = useTaxStore();
  const toastStore = useToastStore();
  const styles = useStylesheet();

  const onContinueClicked = () => {
    if (countryLevelInfo == null) {
      return;
    }

    if (isOss) {
      if (countryLevelInfo && editState.ossNumber) {
        countryLevelInfo.taxNumber = editState.ossNumber;
        countryLevelInfo.numberIsInvalid = false;
        editState.pendingTaxInfos
          .filter(({ countryCode }) =>
            editState.euCountriesList.includes(countryCode)
          )
          .forEach((info) => {
            info.deUstSt1T1Number = countryLevelInfo.deUstSt1T1Number;
            info.certificateFileUrl = countryLevelInfo.certificateFileUrl;
          });
      }

      if (isOss && countryLevelInfo && editState.ossNumber) {
        countryLevelInfo.taxNumber = editState.ossNumber;
        countryLevelInfo.numberIsInvalid = false;
      }
    } else {
      if (countryLevelInfo.deRegistrationSelection == "have-vat") {
        if (countryLevelInfo.numberIsInvalid) {
          toastStore.error(i`Please provide a valid VAT number.`);
          return;
        }

        if (isCompany && !countryLevelInfo.deUstSt1T1NumberIsValid) {
          toastStore.error(i`Please provide a valid ${`USt 1 TI number`}.`);
          return;
        }

        if (isCompany && !countryLevelInfo.certificateFileUrl) {
          toastStore.error(i`Please attach your tax certificate.`);
          return;
        }
      } else {
        if (!countryLevelInfo.deNoVATReason) {
          toastStore.error(
            i`Please provide a reason for not having VAT registration.`,
            {
              timeoutMs: 5000,
            }
          );

          return;
        }
      }
    }
    pushNext();
  };

  const certificateFileAttachments: ReadonlyArray<Partial<
    AttachmentInfo
  >> = countryLevelInfo?.certificateFileUrl
    ? [
        {
          url: countryLevelInfo?.certificateFileUrl,
          fileName: i`German tax certificate`,
        },
      ]
    : [];

  if (countryLevelInfo == null) {
    return null;
  }

  const title = taxStore.getTaxNumberName({
    countryCode: "DE",
    entityType,
    isOss,
  });
  const desc = taxStore.getTaxDescription({
    countryCode: "DE",
    entityType,
    isOss,
  });

  const disabled =
    isOss === true &&
    (countryLevelInfo.taxNumber == null ||
      countryLevelInfo.deUstSt1T1Number == null ||
      countryLevelInfo.certificateFileUrl == null);

  return (
    <div className={css(styles.root, className, style)}>
      <Layout.FlexColumn className={css(styles.titleContainer)}>
        <Text weight="bold" className={css(styles.title)}>
          Tax for Germany
        </Text>
      </Layout.FlexColumn>
      <div className={css(styles.content)}>
        <section className={css(styles.subTitle)}>
          Please provide tax details for the selected tax jurisdictions.
        </section>
        <div className={css(styles.taxForm)}>
          <HorizontalField
            title={i`Account type`}
            popoverContent={
              hasCompletedSellerVerification
                ? i`Based on our record, your account type has been ` +
                  i`successfully validated`
                : null
            }
            className={css(styles.field)}
          >
            <div className={css(styles.accountTypeContainer)}>
              {AccountTypeDisplayNames[entityType]}
              {hasCompletedSellerVerification && (
                <ValidatedLabel
                  className={css(styles.validatedLabel)}
                  state="VALIDATED"
                  popoverContent={() => (
                    <div className={css(styles.labelPopover)}>
                      Your Wish store is validated to unlock unlimited sales and
                      additional merchant features to expand your business.
                    </div>
                  )}
                  popoverPosition="top center"
                />
              )}
            </div>
          </HorizontalField>
          {isOss ? (
            <HorizontalField
              title={title}
              popoverContent={desc}
              className={css(styles.field)}
              centerTitleVertically
            >
              <Text>{editState.ossNumber}</Text>
            </HorizontalField>
          ) : (
            <HorizontalField
              title={title}
              popoverContent={desc}
              className={css(styles.field)}
              centerTitleVertically
            >
              <TextInput
                className={css(styles.input)}
                value={countryLevelInfo.taxNumber}
                onChange={({ text }: OnTextChangeEvent) => {
                  countryLevelInfo.taxNumber = text;
                }}
                onValidityChanged={(isValid) =>
                  (countryLevelInfo.numberIsInvalid = !isValid)
                }
                placeholder={i`Enter tax number here`}
                validators={
                  countryLevelInfo.deRegistrationSelection == "have-vat"
                    ? [validator]
                    : []
                }
                focusOnMount={
                  countryLevelInfo.deRegistrationSelection == "have-vat"
                }
                disabled={
                  countryLevelInfo.deRegistrationSelection != "have-vat"
                }
                debugValue="DE123456789"
              />
            </HorizontalField>
          )}
          {(isCompany || (isOss && editState.ossCountryCode == "DE")) && (
            <Layout.FlexColumn>
              <HorizontalField
                title={`USt 1 TI Number`}
                popoverContent={
                  i`This number appears on the tax certificate issued by German ` +
                  i`Tax Authorities (Bundeszentralamt für Steuern) to merchants ` +
                  i`with tax obligations and registration in Germany.`
                }
                className={css(styles.field)}
              >
                <TextInput
                  className={css(styles.input)}
                  value={countryLevelInfo.deUstSt1T1Number}
                  onChange={({ text }: OnTextChangeEvent) => {
                    countryLevelInfo.deUstSt1T1Number = text;
                  }}
                  onValidityChanged={(isValid) =>
                    (countryLevelInfo.deUstSt1T1NumberIsValid = isValid)
                  }
                  placeholder={i`Enter ${`USt 1 TI Number`} here`}
                  validators={[new UstSt1T1Validator({})]}
                  disabled={
                    countryLevelInfo.deRegistrationSelection != "have-vat"
                  }
                  debugValue="123"
                />
              </HorizontalField>

              <HorizontalField
                title={i`Upload your tax certificate`}
                popoverContent={
                  i`Please upload the tax certificate that ` +
                  i`has been issued to you by the German tax authorities.`
                }
                className={css(styles.field)}
              >
                <SecureFileInput
                  bucket="TAX_SETTING_FILE_UPLOADS"
                  accepts=".jpeg,.jpg,.png,.pdf"
                  attachments={certificateFileAttachments}
                  onAttachmentsChanged={(
                    attachments: ReadonlyArray<AttachmentInfo>
                  ) => {
                    if (attachments.length > 0) {
                      countryLevelInfo.certificateFileUrl = attachments[0].url;
                    } else {
                      countryLevelInfo.certificateFileUrl = null;
                    }
                  }}
                  maxSizeMB={5}
                  disabled={
                    countryLevelInfo.deRegistrationSelection != "have-vat"
                  }
                />
              </HorizontalField>
            </Layout.FlexColumn>
          )}
        </div>
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => editState.pushPrevious()} isRouterLink />

        <PrimaryButton onClick={onContinueClicked} isDisabled={disabled}>
          {editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(DEEnrollment);

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        titleContainer: {
          padding: "0px 25px 15px 25px",
          color: textBlack,
        },
        content: {
          padding: "25px 25px 25px 25px",
        },
        title: {
          fontSize: 20,
          lineHeight: 1.4,
        },
        subTitle: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          marginBottom: 15,
        },
        field: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        accountTypeContainer: {
          display: "flex",
          alignItems: "center",
        },
        validatedLabel: {
          marginLeft: 12,
        },
        labelPopover: {
          fontSize: 12,
          lineHeight: "16px",
          maxWidth: 240,
          margin: 8,
        },
        input: {
          "@media (min-width: 900px)": {
            maxWidth: 300,
          },
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        fieldTitle: {
          minHeight: 42,
          display: "flex",
          alignItems: "center",
        },
        taxForm: {
          display: "flex",
          flexDirection: "column",
          marginTop: 15,
        },
        checkbox: {
          marginTop: 24,
          width: "fit-content",
        },
      }),
    [borderPrimary, textBlack]
  );
};

export class UstSt1T1Validator extends Validator {
  constructor({
    customMessage = i`Invalid ${`USt 1 TI`} format. Please try again.`,
  }: {
    customMessage?: string | null | undefined;
  }) {
    super({ customMessage });
  }

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;

    // TODO: waiting on pattern from KPMG
    const pattern = /.*/g; // Stub temporary pattern

    return [
      new RegexBasedValidator({
        customMessage,
        pattern,
      }),
    ];
  }
}
