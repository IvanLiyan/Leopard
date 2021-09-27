/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { EditButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import LogoUploadInstructions from "@merchant/component/external/merchant-apps/form/LogoUploadInstructions";
import RedirectUriInstructions from "@merchant/component/external/merchant-apps/form/RedirectUriInstructions";
import { SecureFileInput } from "@merchant/component/core";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type DefaultLocaleFormProps = BaseProps & {
  readonly globalFormState: MerchantAppGlobalState;
};

const DefaultLocaleForm = (props: DefaultLocaleFormProps) => {
  const styles = useStylesheet(props);
  const { globalFormState } = props;
  const { isLoading } = globalFormState;
  const {
    requiredValidator,
    urlValidator,
    secureUrlValidator,
    lengthValidator,
  } = globalFormState.mainForm.validators;

  return (
    <>
      <HorizontalField
        title={i`App logo`}
        className={css(styles.field)}
        popoverContent={() => <LogoUploadInstructions />}
        popoverPosition="bottom center"
        titleWidth={"30%"}
        required
        centerContentVertically
      >
        <div className={css(styles.fileContainer)}>
          {globalFormState.mainForm.logoSource &&
          globalFormState.isUploadHidden ? (
            <>
              <img
                className={css(styles.illustration)}
                src={globalFormState.mainForm.logoSource}
              />
              <EditButton
                popoverContent={null}
                onClick={() => {
                  globalFormState.isUploadHidden = false;
                }}
                className={css(styles.button)}
              >
                Change logo
              </EditButton>
            </>
          ) : (
            <SecureFileInput
              bucket="PUBLIC_APP_LOGO"
              disabled={isLoading}
              accepts=".jpeg,.jpg,.png"
              className={css(styles.input)}
              onAttachmentsChanged={(attachments) => {
                globalFormState.mainForm.attachments = attachments;
              }}
              maxSizeMB={2}
              minDimensions={[100, 100]}
              maxAttachments={1}
              attachments={globalFormState.mainForm.attachments}
              backgroundColor={palettes.greyScaleColors.LightGrey}
            />
          )}
        </div>
      </HorizontalField>
      <HorizontalField
        title={i`App name`}
        className={css(styles.field)}
        popoverContent={i`This is the name that will appear publicly to merchants.`}
        titleWidth={"30%"}
        required
        centerContentVertically
      >
        <TextInput
          disabled={isLoading}
          validators={[requiredValidator, lengthValidator]}
          onChange={({ text }) => {
            globalFormState.mainForm.name = text;
          }}
          onValidityChanged={(nameIsValid) => {
            globalFormState.mainForm.nameIsValid = nameIsValid;
          }}
          focusOnMount
          className={css(styles.input)}
          value={globalFormState.mainForm.name}
        />
      </HorizontalField>
      <HorizontalField
        title={i`Redirect URI`}
        popoverContent={() => <RedirectUriInstructions />}
        className={css(styles.field)}
        titleWidth={"30%"}
        required
        centerContentVertically
      >
        <TextInput
          disabled={isLoading}
          validators={[requiredValidator, secureUrlValidator]}
          onChange={({ text }) => {
            globalFormState.mainForm.redirectUri = text.trim();
          }}
          onValidityChanged={(isValid) => {
            globalFormState.mainForm.redirectUriIsValid = isValid;
          }}
          className={css(styles.input)}
          value={globalFormState.mainForm.redirectUri}
        />
      </HorizontalField>
      <HorizontalField
        title={i`Website`}
        popoverContent={i`A merchant facing website for your app.`}
        className={css(styles.field)}
        titleWidth={"30%"}
        required
        centerContentVertically
      >
        <TextInput
          disabled={isLoading}
          validators={[requiredValidator, urlValidator]}
          onChange={({ text }) => {
            globalFormState.mainForm.website = text.trim();
          }}
          onValidityChanged={(isValid) => {
            globalFormState.mainForm.websiteIsValid = isValid;
          }}
          className={css(styles.input)}
          value={globalFormState.mainForm.website}
        />
      </HorizontalField>
    </>
  );
};

export default observer(DefaultLocaleForm);

const useStylesheet = (props: DefaultLocaleFormProps) => {
  const { dimenStore } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          maxWidth: "570px",
        },
        asterisk: {
          color: palettes.reds.DarkestRed,
        },
        title: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          marginBottom: 25,
          fontSize: 25,
          lineHeight: 1.33,
        },
        form: {
          display: "flex",
          flexDirection: "column",
        },
        field: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        fileInput: {
          flex: 2,
        },
        fileContainer: {
          display: "flex",
          flexDirection: "column",
        },
        button: {
          maxWidth: 150,
        },
        illustration: {
          backgroundColor: "#ffffff",
          padding: 15,
          maxWidth: 200,
        },
        fieldTitle: {
          fontSize: 16,
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightSemibold,
          cursor: "default",
          lineHeight: 1.5,
          textAlign: !dimenStore.isSmallScreen ? "right" : "center",
        },
      }),
    [dimenStore.isSmallScreen]
  );
};
