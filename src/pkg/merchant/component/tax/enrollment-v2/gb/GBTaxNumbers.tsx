/*
 * GBTaxNumbers.tsx
 *
 * Created by Jonah Dlin on Thu Dec 03 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInput, RadioGroup, OnTextChangeEvent } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  RegexBasedValidator,
  RequiredValidator,
  TaxNumberValidator,
  Validator,
} from "@toolkit/validators";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Toolkit */
import {
  GBMerchantCompanyNumberOptions,
  GBMerchantIndividualNumberOptions,
  GBNumberDisplayNameInfo,
} from "@toolkit/tax/types-v2";

const DebugValues = {
  TIN: "GB123456789",
  NIN: "GG 12 34 56 A",
  VAT: "GB123456789",
  CRN: "SC12345678",
};

type GBTaxNumbersProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const GBTaxNumbers: React.FC<GBTaxNumbersProps> = ({
  className,
  style,
  editState,
}: GBTaxNumbersProps) => {
  const { getCountryLevelSettings, entityType } = editState;

  const isIndividual = entityType === "INDIVIDUAL";

  const countryLevelInfo = useMemo(():
    | CommerceMerchantTaxInfo
    | null
    | undefined => {
    return getCountryLevelSettings("GB");
  }, [getCountryLevelSettings]);

  useMountEffect(() => {
    window.scrollTo(0, 0);
  });

  const styles = useStylesheet();

  if (countryLevelInfo == null) {
    return null;
  }

  const { gbMerchantState, gbIndividualState } = countryLevelInfo;
  if (gbMerchantState == null || gbIndividualState == null) {
    return null;
  }

  const renderIndividualTaxIds = () => {
    const { selectedValue } = gbIndividualState;
    const { TIN, NIN } = GBNumberDisplayNameInfo;
    return (
      <RadioGroup
        onSelected={(value: GBMerchantIndividualNumberOptions) => {
          gbIndividualState.selectedValue = value;
        }}
        selectedValue={selectedValue}
        layout="vertical"
        className={css(className, style)}
      >
        <RadioGroup.Item
          className={css(styles.fieldTitle)}
          text={TIN.title}
          value="TIN"
          description={TIN.desc}
        >
          {selectedValue == "TIN" && (
            <TextInput
              className={css(styles.numberInput)}
              placeholder={i`Enter TIN here`}
              value={gbIndividualState.tinNumber}
              onChange={(event: OnTextChangeEvent) => {
                countryLevelInfo.taxNumber = event.text;
                gbIndividualState.tinNumber = event.text;
              }}
              validators={[new TaxNumberValidator({ countryCode: "GB" })]}
              onValidityChanged={(isValid) => {
                countryLevelInfo.numberIsInvalid = !isValid;
                gbIndividualState.isTinValid = isValid;
              }}
              debugValue={DebugValues.TIN}
            />
          )}
        </RadioGroup.Item>

        <RadioGroup.Item
          className={css(styles.fieldTitle)}
          text={NIN.title}
          value="NIN"
          description={NIN.desc}
        >
          {selectedValue == "NIN" && (
            <TextInput
              className={css(styles.numberInput)}
              placeholder={i`Enter NIN here`}
              value={gbIndividualState.ninNumber}
              onChange={(event: OnTextChangeEvent) => {
                countryLevelInfo.taxNumber = event.text;
                gbIndividualState.ninNumber = event.text;
              }}
              validators={[new NINValidator({})]}
              onValidityChanged={(isValid) => {
                countryLevelInfo.numberIsInvalid = !isValid;
                gbIndividualState.isNinValid = isValid;
              }}
              debugValue={DebugValues.NIN}
            />
          )}
        </RadioGroup.Item>
      </RadioGroup>
    );
  };

  const renderCompanyTaxIds = () => {
    const { selectedValue } = gbMerchantState;
    const { VAT, CRN } = GBNumberDisplayNameInfo;
    return (
      <RadioGroup
        onSelected={(value: GBMerchantCompanyNumberOptions) =>
          (gbMerchantState.selectedValue = value)
        }
        selectedValue={selectedValue}
        layout="vertical"
        className={css(className, style)}
      >
        <RadioGroup.Item
          className={css(styles.fieldTitle)}
          text={VAT.title}
          value="VAT"
          description={VAT.desc}
        >
          {selectedValue == "VAT" && (
            <TextInput
              className={css(styles.numberInput)}
              placeholder={i`Enter VAT here`}
              value={gbMerchantState.vatNumber}
              onChange={(event: OnTextChangeEvent) => {
                countryLevelInfo.taxNumber = event.text;
                gbMerchantState.vatNumber = event.text;
              }}
              validators={[new TaxNumberValidator({ countryCode: "GB" })]}
              onValidityChanged={(isValid) => {
                countryLevelInfo.numberIsInvalid = !isValid;
                gbMerchantState.isVatValid = isValid;
              }}
              debugValue={DebugValues.VAT}
            />
          )}
        </RadioGroup.Item>

        <RadioGroup.Item
          className={css(styles.fieldTitle)}
          text={CRN.title}
          value="CRN"
          description={CRN.desc}
        >
          {selectedValue == "CRN" && (
            <TextInput
              className={css(styles.numberInput)}
              placeholder={i`Enter CRN here`}
              value={gbMerchantState.crnNumber}
              onChange={(event: OnTextChangeEvent) => {
                countryLevelInfo.taxNumber = event.text;
                gbMerchantState.crnNumber = event.text;
              }}
              validators={[new CRNValidator({})]}
              onValidityChanged={(isValid) => {
                countryLevelInfo.numberIsInvalid = !isValid;
                gbMerchantState.isCrnValid = isValid;
              }}
              debugValue={DebugValues.CRN}
            />
          )}
        </RadioGroup.Item>
      </RadioGroup>
    );
  };

  return isIndividual ? renderIndividualTaxIds() : renderCompanyTaxIds();
};

export default observer(GBTaxNumbers);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fieldTitle: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        validatedLabel: {
          marginLeft: 12,
        },
        numberInput: {
          marginLeft: 24,
          marginTop: 16,
          maxWidth: 280,
        },
      }),
    [textDark]
  );
};

class NINValidator extends Validator {
  constructor({
    customMessage = i`Invalid NIN format. Please try again.`,
  }: {
    customMessage?: string | null | undefined;
  }) {
    super({ customMessage });
  }

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;

    // Based on https://www.gov.uk/hmrc-internal-manuals/national-insurance-manual/nim39110
    const pattern = /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1} ?[0-9]{2} ?[0-9]{2} ?[0-9]{2} ?[A-DFMP ]$/g;

    return [
      new RequiredValidator({ customMessage }),
      new RegexBasedValidator({
        customMessage,
        pattern,
      }),
    ];
  }
}

class CRNValidator extends Validator {
  constructor({
    customMessage = i`Invalid CRN format. Please try again.`,
  }: {
    customMessage?: string | null | undefined;
  }) {
    super({ customMessage });
  }

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;

    // Based on http://www.hmrc.gov.uk/gds/com/attachments/coy_reg_no_formats.doc
    const pattern = /((AC)|(FC)|(GE)|(GN)|(GS)|(IC)|(IP)|(LP)|(NA)|(NF)|(NI)|(NL)|(NO)|(NP)|(NR)|(NZ)|(OC)|(R)|(RC)|(SA)|(SC)|(SF)|(SI)|(SL)|(SO)|(SP)|(SR)|(SZ)|(ZC))?[0-9]{8}/g;

    return [
      new RequiredValidator({ customMessage }),
      new RegexBasedValidator({
        customMessage,
        pattern,
      }),
    ];
  }
}
