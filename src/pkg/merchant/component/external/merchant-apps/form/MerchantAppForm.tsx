/* eslint-disable local-rules/no-empty-link */
import React, { useRef, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { DeleteButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { CheckboxGrid } from "@ContextLogic/lego";
import { StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import DefaultLocaleForm from "@merchant/component/external/merchant-apps/form/DefaultLocaleForm";
import LocalizedForm from "@merchant/component/external/merchant-apps/form/LocalizedForm";
import UserContactForm from "@merchant/component/external/merchant-apps/form/UserContactForm";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Merchant Model */
import { translatedLocaleNames } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { supportedLanguagesOptions } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Locale } from "@toolkit/locales";
import MerchantAppGlobalState, {
  LocalizedFormState,
} from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

export type MerchantAppFormProps = BaseProps & {
  readonly clientId?: string;
  readonly submitAction: string;
  readonly globalFormState: MerchantAppGlobalState;
};

const MerchantAppForm = (props: MerchantAppFormProps) => {
  const styles = useStylesheet(props);
  const { clientId, submitAction, globalFormState } = props;
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { locale } = useLocalizationStore();
  const [currentLocale, setCurrentLocale] = useState(
    globalFormState.mainForm.supportedLanguages[0] || locale,
  );
  const localeForm = globalFormState.localizedForms.get(currentLocale);
  const localizedFormRef = useRef<HTMLDivElement>(null);

  const sendRequest = async () => {
    globalFormState.isLoading = true;
    const intros = {};
    const descriptions = {};

    try {
      globalFormState.localizedForms.forEach(
        (formState: LocalizedFormState, locale: Locale) => {
          if (formState.intro) {
            (intros as any)[locale] = formState.intro;
          }
          if (formState.description) {
            (descriptions as any)[locale] = formState.description;
          }
        },
      );

      const { attachments } = globalFormState.mainForm;

      let newLogoSource = attachments && attachments[0] && attachments[0].url;
      if (globalFormState.isUploadHidden) {
        newLogoSource = newLogoSource || globalFormState.mainForm.logoSource;
      }

      const redirectUri = globalFormState.mainForm.redirectUri || "";
      const website = globalFormState.mainForm.website || "";
      const supportEmail = globalFormState.mainForm.supportEmail || "";
      const name = globalFormState.mainForm.name || "";

      const params = {
        redirect_uri: redirectUri,
        intros: JSON.stringify(intros),
        descriptions: JSON.stringify(descriptions),
        website,
        support_email: supportEmail,
        support_phone: globalFormState.mainForm.supportPhone,
        support_wechat: globalFormState.mainForm.supportWechat,
        logo_source: newLogoSource,
        name,
        supported_languages: Array.from(
          globalFormState.mainForm.supportedLanguages,
        ),
      };

      let message = "";
      if (submitAction == "create") {
        const resp = await merchantAppsApi.createMerchantApp(params).call();
        const merchantApp = resp.data?.merchant_app;
        if (merchantApp) {
          message =
            i`Your app has been successfully submitted! ` +
            i`After review, we will send you an update by email.`;
          if (merchantApp.listing_state_name == "APPROVED") {
            message =
              i`Your app has been successfully submitted! ` +
              i`Thank you for your contribution to the Wish community!`;
          }
        }
      } else if (submitAction == "update") {
        const resp = await merchantAppsApi
          .updateMerchantApp({
            ...params,
            client_id: clientId || "",
          })
          .call();
        const merchantApp = resp.data?.merchant_app;
        if (merchantApp) {
          message =
            i`The revisions for your app have been saved! ` +
            i`We will review the changes and send you an update by email.`;
          if (
            ["APPROVED", "REJECTED", "HIDDEN"].includes(
              merchantApp.listing_state_name,
            )
          ) {
            message =
              i`The revisions for your app have been saved! ` +
              i`Thank you for your contribution to the Wish community!`;
          }
        }
      }
      if (message) {
        toastStore.positive(message, {
          deferred: true,
          timeoutMs: 4000,
        });
        navigationStore.navigate(`/merchant_app/show`);
      } else {
        toastStore.error(i`Something went wrong`);
      }
    } catch {
      globalFormState.isLoading = false;
    }
  };

  const onDeleteLocale = (locale: Locale) => {
    const localeName = translatedLocaleNames[locale].name;
    new ConfirmationModal(
      i`Are you sure you want to delete your ${localeName} listing?`,
    )
      .setHeader({
        title: i`Delete ${localeName} listing`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Delete ${localeName} listing`, () => {
        const localeFormToDelete = globalFormState.localizedForms.get(locale);
        if (localeFormToDelete != null) {
          localeFormToDelete.description = "";
          localeFormToDelete.intro = "";
          localeFormToDelete.introIsValid = true;
          localeFormToDelete.descriptionIsValid = true;
        }
        globalFormState.mainForm.supportedLanguages =
          globalFormState.mainForm.supportedLanguages.filter(
            (val) => val !== locale,
          );
        setCurrentLocale(globalFormState.mainForm.supportedLanguages[0]);
      })
      .render();
  };

  const onDiscard = () => {
    if (submitAction == "update") {
      navigationStore.navigate("/merchant_app/show");
    } else {
      navigationStore.navigate("/");
    }
  };

  const documentationLink = `[${i`here`}](/documentation/public-app)`;

  return (
    <div className={css(styles.form)}>
      <div className={css(styles.formSection)}>
        <DefaultLocaleForm globalFormState={globalFormState} />
        <HorizontalField
          title={i`Supported languages`}
          className={css(styles.field)}
          popoverContent={
            i`Select the languages that your app fully supports. ` +
            i`Your app user interface will be thoroughly reviewed ` +
            i`to verify that your app is fully functional for users ` +
            i`of each of the languages you choose here.`
          }
          titleWidth={"30%"}
          required
          centerContentVertically
        >
          <CheckboxGrid
            options={supportedLanguagesOptions}
            selected={globalFormState.mainForm.supportedLanguages}
            onCheckedChanged={(value, checked) => {
              if (checked) {
                globalFormState.mainForm.supportedLanguages = [
                  ...globalFormState.mainForm.supportedLanguages,
                  value,
                ];
                setCurrentLocale(value);
                if (localizedFormRef.current) {
                  localizedFormRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              } else {
                onDeleteLocale(value);
              }
            }}
            maxColumns={3}
          />
        </HorizontalField>
        <UserContactForm globalFormState={globalFormState} />
      </div>
      <div className={css(styles.formSection)}>
        <>
          {localeForm != null && globalFormState.localeOptions.length && (
            <StaggeredFadeIn animationDurationMs={800}>
              <HorizontalField
                title={i`Listing language`}
                popoverContent={i`Add translated versions of your listing details in various languages.`}
                className={css(styles.field)}
                titleWidth={"30%"}
                centerContentVertically
              >
                <Select
                  dontCheckSelected
                  iconStyle={{ marginLeft: 10 }}
                  className={css(styles.localeSelector)}
                  options={globalFormState.localeOptions}
                  onSelected={(locale: Locale) => {
                    setCurrentLocale(locale);
                  }}
                  selectedValue={currentLocale}
                  minWidth={200}
                  position="bottom center"
                  buttonHeight={35}
                />
                {!globalFormState.otherLocalizedFormsValid(currentLocale) && (
                  <section className={css(styles.errorText)}>
                    There are problems with one or more of your translated
                    listing details
                  </section>
                )}
                <DeleteButton
                  onClick={() => onDeleteLocale(currentLocale)}
                  popoverContent={null}
                  style={{ padding: "7px 12px" }}
                >
                  Delete {translatedLocaleNames[currentLocale].name} listing
                </DeleteButton>
              </HorizontalField>
              <div ref={localizedFormRef} key={localeForm.locale}>
                <LocalizedForm
                  isLoading={globalFormState.isLoading}
                  localizedFormState={localeForm}
                />
              </div>
            </StaggeredFadeIn>
          )}
          <div className={css(styles.buttonField)}>
            <div className={css(styles.emptyTitle)} />
            <div className={css(styles.bottomSection)}>
              <div className={css(styles.cardTitle)}>
                <div className={css(styles.bottomSubsection)}>
                  <div className={css(styles.bottomButtonRow)}>
                    <SecondaryButton
                      className={css(styles.bottomButton)}
                      type="default"
                      padding="7px 20px"
                      onClick={() => onDiscard()}
                    >
                      {submitAction == "update"
                        ? i`Discard changes`
                        : i`Cancel`}
                    </SecondaryButton>
                    <PrimaryButton
                      className={css(styles.bottomButton)}
                      isLoading={globalFormState.isLoading}
                      onClick={async () => sendRequest()}
                      isDisabled={!globalFormState.canSubmit}
                    >
                      {submitAction == "update"
                        ? i`Save changes`
                        : i`Submit app`}
                    </PrimaryButton>
                  </div>
                  <Markdown
                    text={
                      i`For more information on building an app, ` +
                      i`click ${documentationLink}`
                    }
                    openLinksInNewTab
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default observer(MerchantAppForm);

const useStylesheet = (props: MerchantAppFormProps) => {
  const { dimenStore } = AppStore.instance();
  const errorKeyframes = useMemo(
    () => ({
      from: {
        transform: "translateY(-5px)",
        opacity: 0,
      },

      to: {
        transform: "translate(-5px)",
        opacity: 1,
      },
    }),
    [],
  );
  return useMemo(
    () =>
      StyleSheet.create({
        field: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        fieldTitle: {
          fontSize: 16,
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightSemibold,
          cursor: "default",
          lineHeight: 1.5,
          textAlign: !dimenStore.isSmallScreen ? "right" : "center",
        },
        asterisk: {
          color: palettes.reds.DarkestRed,
        },
        buttonField: {
          display: "flex",
          flexDirection: !dimenStore.isSmallScreen ? "row" : "column",
          flexWrap: "wrap",
          alignItems: dimenStore.isSmallScreen ? "stretch" : "flex-start",
        },
        title: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          marginBottom: 25,
          fontSize: 25,
          lineHeight: 1.33,
        },
        cardTitle: {
          color: palettes.textColors.Ink,
          fontSize: 15,
          lineHeight: 1.33,
        },
        form: {
          display: "flex",
          flexDirection: "column",
        },
        bottomSection: {
          display: "flex",
          padding: "25px 0px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          maxWidth: "610px",
          flex: "1 1 0%",
        },
        bottomSubsection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        },
        bottomButtonRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        },
        bottomButton: {
          marginLeft: 10,
        },
        localeSelector: {
          maxWidth: "570px",
          marginBottom: 10,
          borderRadius: 4,
          overflow: "hidden",
          minWidth: 95,
          height: 30,
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          cursor: "pointer",
          border: "solid 1px #c4cdd5",
          color: palettes.textColors.White,
        },
        formSection: {
          padding: "40px 25px",
          display: "flex",
          flexDirection: "column",
          ":not(:last-child)": {
            borderBottom: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
          },
        },
        buttonContainer: {
          display: "flex",
          alignItems: "stretch",
        },
        localeButton: {
          maxWidth: 200,
          marginRight: 5,
        },
        modal: {},
        emptyTitle: {
          width: "30%",
        },
        errorText: {
          fontSize: 12,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.33,
          color: palettes.reds.DarkRed,
          marginTop: -7,
          marginBottom: 7,
          animationName: [errorKeyframes],
          animationDuration: "300ms",
          cursor: "default",
        },
      }),
    [dimenStore.isSmallScreen, errorKeyframes],
  );
};
