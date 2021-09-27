import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { LoadingIndicator, Markdown, TextInput } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import {
  CharacterLength,
  RequiredValidator,
  UrlValidator,
} from "@toolkit/validators";

/* Merchant Components */
import ClientSettingsSection from "@merchant/component/external/merchant-apps/ClientSettingsSection";
import MerchantAppOauthDetails from "@merchant/component/external/merchant-apps/MerchantAppOauthDetails";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";
import { getPrivateApp } from "@merchant/api/merchant-apps";

/* Merchant Model */
import {
  MerchantAppPreviewState,
  PrivateAppCreationState,
} from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { PrivateMerchantApp } from "@merchant/api/merchant-apps";
import WebhookTableSection from "@merchant/component/external/merchant-apps/WebhookTableSection";

type ClientSettingsPrivateAppProps = {
  readonly creationState: PrivateAppCreationState;
  readonly previewState: MerchantAppPreviewState;
};

const ClientSettingsPrivateApp = ({
  creationState,
  previewState,
}: ClientSettingsPrivateAppProps) => {
  const styles = useStylesheet();
  const learnMoreLink = zendeskURL(
    "360034132014-Guide-for-Wish-API-Integrations-Private-App-"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [privateApp, setPrivateApp] = useState<
    PrivateMerchantApp | typeof undefined
  >(undefined);

  const requiredValidator = new RequiredValidator();

  useEffect(() => {
    const fetchPrivateApp = async () => {
      try {
        const fetchedPrivateApp = await getPrivateApp({}).call();
        if (fetchedPrivateApp.data && fetchedPrivateApp.data.merchant_app) {
          const { merchant_app: merchantApp } = fetchedPrivateApp.data;
          if (!merchantApp.public) {
            setPrivateApp(merchantApp);
            previewState.clientSecrets = [...merchantApp.client_secrets];
            previewState.clientId = merchantApp.client_id;
          }
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    };
    fetchPrivateApp();
  }, [setPrivateApp, previewState]);

  const learnMoreMarkdown = `[${i`Learn more`}](${learnMoreLink})`;

  // if you find this please fix the any types (legacy)
  const modalRenderFn = (onCloseFn: any) => (
    <div className={css(styles.modalWrapper)}>
      <Alert
        title={i`Are you sure you want to register a private app?`}
        text={
          i`Private apps should only be used to integrate an app that you have created, ` +
          i`and the app credentials should never be shared with a third party. ` +
          i`If you would like to use a third party app, consider one of the many trusted, ` +
          i`Wish-approved public apps featured in the Wish App Store.`
        }
        sentiment="warning"
        link={{
          text: i`Browse public apps`,
          url: "/merchant_apps",
        }}
      />
      <Markdown
        style={{
          margin: "30px 0",
          display: "flex",
          justifyContent: "center",
          alignSelf: "stretch",
        }}
        openLinksInNewTab
        text={
          i`Not sure how to proceed? ` +
          i`${learnMoreMarkdown} about creating an app. `
        }
      />
      <div className={css(styles.modalFormInputWrapper)}>
        <HorizontalField
          title={() => (
            <span className={css(styles.modalFormField)}>App Name</span>
          )}
          className={css(styles.modalFormFieldWrapper)}
          required
          titleWidth={"30%"}
          centerTitleVertically
        >
          <TextInput
            validators={[
              requiredValidator,
              new CharacterLength({ maximum: 49 }),
            ]}
            onChange={({ text }: OnTextChangeEvent) => {
              creationState.name = text;
            }}
            onValidityChanged={(valid) => {
              creationState.isNameValid = valid;
            }}
            value={creationState.name}
          />
        </HorizontalField>
        <HorizontalField
          title={() => (
            <span className={css(styles.modalFormField)}>Redirect URI</span>
          )}
          className={css(styles.modalFormFieldWrapper)}
          required
          titleWidth={"30%"}
          centerTitleVertically
        >
          <TextInput
            validators={[requiredValidator, new UrlValidator()]}
            onChange={({ text }: OnTextChangeEvent) => {
              creationState.redirectUri = text.trim();
            }}
            onValidityChanged={(valid) => {
              creationState.isRedirectUriValid = valid;
            }}
            value={creationState.redirectUri}
          />
        </HorizontalField>
        <CheckboxField
          title={() => (
            <div className={css(styles.checkboxWrapper)}>
              <span className={css(styles.redAsterisk)}>*</span>
              <Markdown
                text={
                  i`I agree not to share my private app credentials with any third parties. ` +
                  i`I understand that Wish reserves the right to remove my private app if I ` +
                  i`share the app credentials with third parties.`
                }
              />
            </div>
          )}
          onChange={(checked) => {
            creationState.termAgreed = checked;
          }}
          checked={creationState.termAgreed}
          wrapTitle
        />
      </div>
    </div>
  );

  // if you find this please fix the any types (legacy)
  const modalDeleteRenderFn = (onCloseFn: any) =>
    privateApp && (
      <Markdown
        text={i`The app **${privateApp.name}** will no longer have access to your account.`}
      />
    );

  const onClickRegister = async () =>
    new ConfirmationModal(modalRenderFn)
      .setHeader({ title: i`Register a private app` })
      .setAction(i`Submit`, async () => {
        const params = {
          name: creationState.name || "",
          redirect_uri: creationState.redirectUri || "",
        };
        try {
          const fetchedPrivateApp = await merchantAppsApi
            .createPrivateApp(params)
            .call();
          if (fetchedPrivateApp.data && fetchedPrivateApp.data.merchant_app) {
            const { merchant_app: merchantApp } = fetchedPrivateApp.data;
            previewState.clientSecrets = [...merchantApp.client_secrets];
            previewState.clientId = merchantApp.client_id;
            setPrivateApp(merchantApp);
          }
        } catch (e) {
          // eslint-disable no-empty
        }
      })
      .setWidthPercentage(50)
      .setContentPadding(0)
      .setOnDismiss(() => {
        creationState.name = undefined;
        creationState.redirectUri = undefined;
        creationState.isNameValid = false;
        creationState.isRedirectUriValid = false;
      })
      .setActionDisabled(() => !creationState.canSubmit)
      .render();

  const onClickUpdate = async () => {
    if (privateApp) {
      creationState.name = privateApp.name;
      creationState.redirectUri = privateApp.redirect_uri;
      creationState.isNameValid = true;
      creationState.isRedirectUriValid = true;
    }
    return new ConfirmationModal(modalRenderFn)
      .setHeader({ title: i`Update a private app` })
      .setAction(i`Submit`, async () => {
        if (privateApp) {
          const params = {
            name: creationState.name || "",
            client_id: privateApp.client_id,
            redirect_uri: creationState.redirectUri || "",
          };
          try {
            const fetchedPrivateApp = await merchantAppsApi
              .updatePrivateApp(params)
              .call();
            if (fetchedPrivateApp.data && fetchedPrivateApp.data.merchant_app) {
              const { merchant_app: merchantApp } = fetchedPrivateApp.data;
              const fetchedPrivateAppInfo = {
                name: merchantApp.name,
                client_secrets: merchantApp.client_secrets,
                client_id: merchantApp.client_id,
                redirect_uri: merchantApp.redirect_uri,
                public: merchantApp.public,
              };
              previewState.clientSecrets = [
                ...fetchedPrivateAppInfo.client_secrets,
              ];
              previewState.clientId = fetchedPrivateAppInfo.client_id;
              setPrivateApp(fetchedPrivateAppInfo);
            }
          } catch (e) {
            // eslint-disable no-empty
          }
        }
      })
      .setWidthPercentage(50)
      .setContentPadding(0)
      .setOnDismiss(() => {
        creationState.name = undefined;
        creationState.redirectUri = undefined;
        creationState.isNameValid = false;
        creationState.isRedirectUriValid = false;
      })
      .setActionDisabled(() => !creationState.canSubmit)
      .render();
  };

  const onClickDelete = async () =>
    new ConfirmationModal(modalDeleteRenderFn)
      .setHeader({ title: i`Remove app?` })
      .setAction(i`Remove`, async () => {
        if (privateApp) {
          const params = { client_id: privateApp.client_id };
          try {
            await merchantAppsApi.deleteMerchantApp(params).call();
            previewState.clientSecrets = [];
            previewState.clientId = "";
            setPrivateApp(undefined);
          } catch (e) {
            // eslint-disable no-empty
          }
        }
      })
      .setWidthPercentage(50)
      .setCancel(i`Cancel`)
      .render();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ClientSettingsSection title={i`Private app`} isPrivate>
      {privateApp ? (
        <div className={css(styles.privateAppRoot)}>
          <div className={css(styles.appName)}>{privateApp.name}</div>
          <div className={css(styles.appContentWrapper)}>
            <div className={css(styles.infoTextWrapper)}>
              <div className={css(styles.infoTitle)}>Client ID</div>
              <div className={css([styles.infoText, styles.noSelectText])}>
                {privateApp.client_id}
              </div>
            </div>
            <div className={css(styles.infoTextWrapper)}>
              <div className={css(styles.infoTitle)}>Client Secret</div>
              <MerchantAppOauthDetails
                previewState={previewState}
                secretStyle={[styles.infoText, styles.noSelectText]}
                dateStyle={styles.dateText}
                addKeyStyle={styles.addKeyText}
              />
            </div>
            <div className={css(styles.infoTextWrapper)}>
              <div className={css(styles.infoTitle)}>Redirect URI</div>
              <div className={css(styles.infoText)}>
                {privateApp.redirect_uri}
              </div>
            </div>
            <div className={css(styles.buttonWrapper)}>
              <PrimaryButton
                onClick={onClickUpdate}
                style={styles.updateButton}
              >
                Update
              </PrimaryButton>
              <PrimaryButton
                onClick={onClickDelete}
                style={styles.deleteButton}
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : (
        <div className={css(styles.emptyPrivateAppRoot)}>
          <Illustration
            name="lockEmptyState"
            className={css(styles.contentImage)}
            alt={i`Picture representing empty private app page`}
          />
          <div className={css(styles.contentTitle)}>
            You haven't registered a private app yet
          </div>
          <div className={css(styles.contentMessageWrapper)}>
            <div className={css(styles.contentMessage)}>
              Custom Requirements?
            </div>
            <Link
              className={css(styles.contentAction)}
              onClick={onClickRegister}
            >
              Register a private app
            </Link>
          </div>
        </div>
      )}
      <WebhookTableSection
        infoText={
          i`Create webhooks to subscribe to events via push notifications sent to ` +
          i`URLs specified by you. You may leverage these notifications to take actions.`
        }
      />
    </ClientSettingsSection>
  );
};

export default observer(ClientSettingsPrivateApp);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        emptyPrivateAppRoot: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "40px 20px",
          flex: 1,
        },
        privateAppRoot: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          backgroundColor: "white",
          padding: "24px",
        },
        contentImage: {
          marginBottom: 16,
        },
        contentTitle: {
          fontSize: 16,
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          lineHeight: 1.5,
          marginBottom: 8,
        },
        contentMessageWrapper: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        },
        contentMessage: {
          fontSize: 12,
          color: palettes.textColors.Ink,
          paddingRight: 5,
          lineHeight: 1.5,
        },
        contentAction: {
          fontSize: 12,
          color: palettes.coreColors.WishBlue,
          fontWeight: fonts.weightSemibold,
          cursor: "pointer",
          lineHeight: 1.5,
        },
        modalWrapper: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        modalFormInputWrapper: {
          backgroundColor: palettes.greyScaleColors.LighterGrey,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: "36px 100px",
        },
        modalTextInput: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          height: 40,
        },
        modalFormField: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        },
        modalFormFieldWrapper: {
          marginBottom: 20,
        },
        modalFormFieldContent: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          flex: 1,
        },
        appName: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          color: palettes.textColors.Ink,
          marginBottom: 30,
        },
        appContentWrapper: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        infoTitle: {
          width: "90px",
          fontSize: 14,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.4,
          marginRight: 44,
          textAlign: "right",
        },
        infoText: {
          fontSize: 14,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.4,
          marginRight: 30,
        },
        noSelectText: {
          userSelect: "none",
        },
        dateText: {
          fontSize: 12,
          fontWeight: fonts.weightMedium,
          color: palettes.textColors.LightInk,
          paddingRight: 10,
        },
        infoTextWrapper: {
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
        },
        trashImage: {
          marginLeft: "10px",
          cursor: "pointer",
        },
        buttonWrapper: {
          display: "flex",
          alignSelf: "stretch",
        },
        updateButton: {
          padding: "6px 38px",
        },
        deleteButton: {
          backgroundColor: palettes.reds.DarkerRed,
          borderColor: palettes.reds.DarkerRed,
          marginLeft: "10px",
          ":hover": {
            opacity: 0.5,
            cursor: "pointer",
          },
        },
        addKeyText: {
          fontSize: 12,
        },
        redAsterisk: {
          color: palettes.reds.DarkestRed,
          marginRight: 5,
        },
        checkboxWrapper: {
          display: "flex",
          alignItems: "center",
        },
      }),
    []
  );
};
