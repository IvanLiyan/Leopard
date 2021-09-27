/*
 * EUProvideTaxNumber.tsx
 *
 * Created by Jonah Dlin on Mon Nov 30 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  BackButton,
  TextInput,
  HorizontalField,
  OnTextChangeEvent,
  PrimaryButton,
  Text,
  Info,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { TaxNumberValidator } from "@toolkit/validators";
import { getCountryName } from "@toolkit/countries";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";

/* Toolkit */
import { AccountTypeDisplayNames } from "@toolkit/tax/types-v2";
import { infoCountries, getCountryTooltipText } from "@toolkit/tax/eu-vat";

export type EUProvideTaxNumberProps = BaseProps & {
  readonly countryCode: CountryCode;
  readonly editState: TaxEnrollmentV2State;
};

const EUProvideTaxNumber: React.FC<EUProvideTaxNumberProps> = ({
  className,
  style,
  countryCode,
  editState,
}: EUProvideTaxNumberProps) => {
  const {
    getCountryLevelSettings,
    entityType,
    hasCompletedSellerVerification,
  } = editState;

  const taxStore = useTaxStore();
  const toastStore = useToastStore();
  const styles = useStylesheet();

  const [validator] = useState(new TaxNumberValidator({ countryCode }));

  useMountEffect(() => {
    window.scrollTo(0, 0);
  });

  const countryLevelInfo = useMemo(():
    | CommerceMerchantTaxInfo
    | null
    | undefined => {
    return getCountryLevelSettings(countryCode);
  }, [countryCode, getCountryLevelSettings]);

  const onContinueClicked = () => {
    if (countryLevelInfo == null) {
      return;
    }

    if (countryLevelInfo.numberIsInvalid) {
      toastStore.error(i`Please provide a valid VAT number.`, {
        timeoutMs: 5000,
      });
      return;
    }

    editState.pushNext();
  };

  if (countryLevelInfo == null) {
    return null;
  }

  const renderNumberField = () => {
    const title = taxStore.getTaxNumberName({ countryCode, entityType });
    const desc = taxStore.getTaxDescription({
      countryCode,
      entityType,
    });

    return (
      <HorizontalField
        title={title}
        popoverContent={desc}
        className={css(styles.field)}
        centerTitleVertically
      >
        <TextInput
          className={css(styles.input)}
          value={countryLevelInfo.taxNumber}
          height={35}
          onChange={({ text }: OnTextChangeEvent) => {
            countryLevelInfo.taxNumber = text;
          }}
          onValidityChanged={(isValid) =>
            (countryLevelInfo.numberIsInvalid = !isValid)
          }
          placeholder={i`Enter tax number here`}
          validators={[validator]}
          focusOnMount
          debugValue={TaxEnrollmentV2State.debugValue(countryCode)}
        />
      </HorizontalField>
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <Text weight="bold" className={css(styles.title)}>
          Tax for {getCountryName(countryCode)}
        </Text>
        {infoCountries.has(countryCode) && (
          <Info
            className={css(styles.info)}
            text={getCountryTooltipText(countryCode)}
            size={16}
            sentiment="info"
            position="right"
          />
        )}
      </div>
      <div className={css(styles.content)}>
        <Text weight="regular" className={css(styles.subTitle)}>
          Please provide tax details for the selected tax jurisdictions.
        </Text>
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
        {renderNumberField()}
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => editState.pushPrevious()} isRouterLink />

        <PrimaryButton onClick={onContinueClicked}>
          {editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(EUProvideTaxNumber);

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
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
        gstContainer: {
          display: "flex",
          flexDirection: "column",
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
        info: {
          marginLeft: 6,
        },
      }),
    [textBlack, borderPrimary]
  );
};
