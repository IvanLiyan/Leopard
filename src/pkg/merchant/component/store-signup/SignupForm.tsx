import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { runInAction } from "mobx";

/* Lego Components */
import {
  Field,
  FormSelect,
  TextInput,
  PrimaryButton,
} from "@ContextLogic/lego";
import faker from "faker/locale/en";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { weightSemibold } from "@toolkit/fonts";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import StoreSignupTOSText from "./StoreSignupTOSText";
import AutocompleteField from "./single-page-fields/AutocompleteField";
import PersonalInfoFields from "./single-page-fields/PersonalInfoFields";
import AddressFields from "./single-page-fields/AddressFields";

/* Toolkit */
import StoreSignupSinglePageState from "@merchant/model/StoreSignupSinglePageState";
import { RequiredValidator } from "@toolkit/validators";

type SignupFormProps = BaseProps & {
  readonly signupState: StoreSignupSinglePageState;
  readonly prefillStoreInfo: boolean;
};

const SignupForm: React.FC<SignupFormProps> = (props: SignupFormProps) => {
  const { className, style, signupState, prefillStoreInfo } = props;
  const styles = useStylesheet();

  const {
    hasRetailStorefront,
    hasSelectedHasRetailStoreFront,
    storeCategory,
    referralCode,
    isHasRetailStorefrontValid,
    hasRetailStorefrontOptions,
    storeCategoryOptions,
    isSaving,
    storeName,
    canSave,
    onSubmit,
    onSendEmail,
  } = signupState;

  const { negative, borderPrimaryDark } = useTheme();

  const hasRetailStorefrontError =
    hasSelectedHasRetailStoreFront && !isHasRetailStorefrontValid;

  const actionText = prefillStoreInfo ? i`Send Email` : i`Sign up`;

  return (
    <div className={css(styles.root, className, style)}>
      <PersonalInfoFields signupState={signupState} />
      <AutocompleteField
        className={css(styles.wideField)}
        signupState={signupState}
        inputText={storeName}
        onTextChange={(text) => (signupState.storeName = text)}
        field="STORE_NAME"
        title={i`Store Name`}
        debugValue={faker.company.companyName()}
        validators={[new RequiredValidator()]}
        onValidityChanged={(isValid) =>
          (signupState.isStoreNameValid = isValid)
        }
      />
      <AddressFields signupState={signupState} />
      <Field
        className={css(styles.wideField)}
        title={i`Do you have a retail storefront?`}
      >
        <FormSelect
          error={hasRetailStorefrontError}
          placeholder="--"
          options={hasRetailStorefrontOptions}
          selectedValue={hasRetailStorefront}
          onSelected={(value: string) => {
            runInAction(() => {
              signupState.hasRetailStorefront = value;
              if (!hasSelectedHasRetailStoreFront) {
                signupState.hasSelectedHasRetailStoreFront = true;
              }
            });
          }}
          borderColor={hasRetailStorefrontError ? negative : borderPrimaryDark}
        />
        {hasRetailStorefrontError && (
          <div className={css(styles.errorText)}>This field is required</div>
        )}
      </Field>
      <Field className={css(styles.wideField)} title={i`Store Category`}>
        <FormSelect
          placeholder="--"
          options={storeCategoryOptions}
          selectedValue={storeCategory}
          onSelected={(value: string) => (signupState.storeCategory = value)}
          borderColor={borderPrimaryDark}
        />
      </Field>
      <Field className={css(styles.wideField)} title={i`Referral Code`}>
        <TextInput
          placeholder={prefillStoreInfo ? i`Required` : i`Optional`}
          required={prefillStoreInfo}
          value={referralCode}
          onChange={({ text }) => (signupState.referralCode = text)}
          borderColor={borderPrimaryDark}
        />
      </Field>
      <PrimaryButton
        popoverStyle={css(styles.submitButton)}
        onClick={prefillStoreInfo ? onSendEmail : onSubmit}
        isLoading={isSaving}
        isDisabled={
          !canSave ||
          (prefillStoreInfo && (referralCode == null || !referralCode.trim()))
        }
      >
        {actionText}
      </PrimaryButton>
      {!prefillStoreInfo && (
        <StoreSignupTOSText
          className={css(styles.tos)}
          buttonText={actionText}
        />
      )}
    </div>
  );
};

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "16px",
          rowGap: 12,
        },
        wideField: {
          display: "flex",
          flexDirection: "column",
          gridColumn: "1 / 3",
        },
        errorText: {
          fontSize: 12,
          fontWeight: weightSemibold,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          cursor: "default",
        },
        submitButton: {
          gridColumn: "1 / 3",
          marginTop: 12,
        },
        tos: {
          gridColumn: "1 / 3",
        },
      }),
    [negative],
  );
};

export default observer(SignupForm);
