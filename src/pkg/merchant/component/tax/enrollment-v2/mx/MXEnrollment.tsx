import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  TextInput,
  BackButton,
  HorizontalField,
  RadioGroup,
} from "@ContextLogic/lego";
import { HorizontalFieldProps } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import {
  Validator,
  RequiredValidator,
  RegexBasedValidator,
} from "@toolkit/validators";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

import { useTaxStore } from "@merchant/stores/TaxStore";
import { useTheme } from "@merchant/stores/ThemeStore";

import { UserEntityType } from "@schema/types";

import AccountTypeLabel from "./AccountLabelType";

export type MXEnrollmentProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const MXEnrollment = ({ className, style, editState }: MXEnrollmentProps) => {
  const styles = useStylesheet();
  const taxStore = useTaxStore();

  const mxSettings = editState.getCountryLevelSettings("MX");

  if (mxSettings == null) {
    return null;
  }

  const fieldProps: Partial<HorizontalFieldProps> = {
    className: css(styles.field),
    titleWidth: 200,
    titleAlign: "start",
    centerTitleVertically: true,
    centerContentVertically: true,
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <section className={css(styles.title)}>Tax for Mexico</section>
      </div>
      <div className={css(styles.content)}>
        <section className={css(styles.subTitle)}>
          For Mexico-bound orders, please select the default ship-from location
          below. Your selection may be used to calculate VAT at the time of
          customer purchase.
        </section>
        <section>
          <HorizontalField
            title={i`Account type`}
            popoverContent={
              i`Based on our record, your account type ` +
              i`has been successfully validated.`
            }
            {...fieldProps}
          >
            <AccountTypeLabel entityType={editState.entityType} />
          </HorizontalField>
          <HorizontalField
            title={taxStore.getTaxNumberName({ countryCode: "MX" })}
            popoverMaxWidth={250}
            popoverContent={taxStore.getTaxDescription({ countryCode: "MX" })}
            {...fieldProps}
          >
            <TextInput
              value={mxSettings.taxNumber}
              placeholder={i`Enter RFC ID here`}
              onChange={({ text }) => {
                mxSettings.taxNumber = text;
              }}
              onValidityChanged={(isValid) => {
                mxSettings.numberIsInvalid = !isValid;
              }}
              validators={[
                new MXValidator({ entityType: editState.entityType }),
              ]}
              debugValue={
                editState?.entityType === "INDIVIDUAL"
                  ? "MEXI-123456-789"
                  : "MEX-123456-789"
              }
              focusOnMount
            />
          </HorizontalField>
          <HorizontalField
            title={i`Default ship-from location`}
            popoverContent={
              i`For Mexico-bound orders, please select the default ` +
              i`ship-from location below. Your selection may be used to ` +
              i`calculate VAT at the time of customer purchase.` // TODO (lliepert): add learn more link once FAQ ready (not before launch)
            }
            {...fieldProps}
          >
            <RadioGroup
              onSelected={(value: boolean) => {
                mxSettings.mxDefaultShipFromIsMX = value;
              }}
              selectedValue={mxSettings.mxDefaultShipFromIsMX}
            >
              <RadioGroup.Item
                value // value = true
                text={i`Orders are shipped from Mexico`}
              />
              <RadioGroup.Item
                value={false}
                text={i`Orders are not shipped from Mexico`}
              />
            </RadioGroup>
          </HorizontalField>
        </section>
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => editState.pushPrevious()} isRouterLink />

        <PrimaryButton
          isDisabled={
            mxSettings.numberIsInvalid ||
            mxSettings.mxDefaultShipFromIsMX == null
          }
          onClick={() => {
            editState.pushNext();
          }}
        >
          {editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(MXEnrollment);

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
          padding: 25,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        title: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
        },
        subTitle: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: textBlack,
          marginBottom: 15,
          alignSelf: "stretch",
        },
        field: {
          width: "100%",
          maxWidth: 540,
          ":not(:last-child)": {
            marginBottom: 24,
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
      }),
    [textBlack, borderPrimary],
  );
};

class MXValidator extends Validator {
  entityType: UserEntityType | null | undefined;

  constructor({
    customMessage = i`You entered an invalid tax ID. Please check and try again.`,
    entityType,
  }: {
    customMessage?: string | null | undefined;
    entityType: UserEntityType | null | undefined;
  }) {
    super({ customMessage });
    this.entityType = entityType;
  }

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage, entityType } = this;

    const pattern =
      entityType === "INDIVIDUAL"
        ? /^[A-Z&]{4}-?\d{6}-?\w{3}$/
        : /^[A-Z&]{3}-?\d{6}-?\w{3}$/;

    return [
      new RequiredValidator({ customMessage }),
      new RegexBasedValidator({
        customMessage,
        pattern,
      }),
    ];
  }
}
