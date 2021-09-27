/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import MerchantAppConfigDetails from "@merchant/component/external/merchant-apps/MerchantAppConfigDetails";

/* Merchant Model */
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import {
  MerchantAppPreviewState,
  translatedLocaleNames,
} from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

import AppStore, { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import _ from "lodash";

import LocalizationStore from "@merchant/stores/LocalizationStore";

export type MerchantAppShowProps = BaseProps & {
  readonly showState: MerchantAppGlobalState;
  readonly previewState?: MerchantAppPreviewState;
  readonly clientId?: string | null | undefined;
  readonly isLoading: boolean;
};

const MerchantAppShow = (props: MerchantAppShowProps) => {
  const styles = useStylesheet();
  const { showState, previewState, clientId, isLoading } = props;
  const { userStore } = useStore();
  const { locale } = LocalizationStore.instance();
  const { supportedLanguages } = showState.mainForm;

  const localeData = showState.localizedForms.get(
    previewState?.previewLocale || locale
  );

  const defaultForm = showState.localizedForms.get("en");
  let defaultIntro = defaultForm?.intro;
  let defaultDescription = defaultForm?.description;
  const sortedForms = _.sortBy(
    Array.from(showState.localizedForms.values()),
    (x) => x.locale
  );
  for (const form of sortedForms) {
    defaultIntro = defaultIntro || form.intro;
    defaultDescription = defaultDescription || form.description;
  }

  if (isLoading) {
    return <LoadingIndicator className={css(styles.loading)} />;
  }

  const addPopover = !userStore.isMerchant
    ? i`Only merchants may authorize apps`
    : undefined;

  return (
    <div className={css(styles.root)}>
      <StaggeredFadeIn className={css(styles.body)} animationDurationMs={800}>
        <div className={css(styles.main)}>
          <div className={css(styles.row)}>
            <div className={css(styles.leftSide)}>
              <div className={css(styles.titleWrapper)}>
                <div className={css(styles.title)}>
                  {showState.mainForm.name}
                </div>
                {showState.isAlreadyAdded && (
                  <div className={css(styles.tag)}>Connected</div>
                )}
              </div>
              <div className={css(styles.intro)}>
                {localeData?.intro || defaultIntro}
              </div>
              <div className={css(styles.description)}>
                {localeData?.description || defaultDescription}
              </div>
              <div className={css(styles.sheet)}>
                <div className={css(styles.sideBySide)}>
                  {showState.mainForm.website && (
                    <SheetItem
                      className={css(styles.fixedHeightSheetItem)}
                      title={i`Website`}
                    >
                      <Link href={showState.mainForm.website} openInNewTab>
                        {showState.mainForm.website.replace(
                          /^(?:https?:\/\/)?(?:www\.)?/i,
                          ""
                        )}
                      </Link>
                    </SheetItem>
                  )}
                </div>
                <div className={css(styles.sideBySide)}>
                  {showState.mainForm.supportEmail && (
                    <SheetItem
                      className={css(styles.fixedHeightSheetItem)}
                      title={i`Support email`}
                    >
                      {showState.mainForm.supportEmail}
                    </SheetItem>
                  )}
                </div>
                <div className={css(styles.sideBySide)}>
                  {showState.mainForm.supportPhone && (
                    <SheetItem
                      className={css(styles.fixedHeightSheetItem)}
                      title={i`Support phone`}
                    >
                      {showState.mainForm.supportPhone}
                    </SheetItem>
                  )}
                </div>
                <div className={css(styles.sideBySide)}>
                  {showState.mainForm.supportWechat && (
                    <SheetItem
                      className={css(styles.fixedHeightSheetItem)}
                      title={i`Support wechat`}
                    >
                      {showState.mainForm.supportWechat}
                    </SheetItem>
                  )}
                </div>

                <div className={css(styles.sideBySide)}>
                  {supportedLanguages && (
                    <SheetItem
                      className={css(styles.fixedHeightSheetItem)}
                      title={i`Supported languages`}
                    >
                      {supportedLanguages
                        .map((locale) => translatedLocaleNames[locale].name)
                        .join(", ")}
                    </SheetItem>
                  )}
                </div>
              </div>
            </div>

            {showState.mainForm.logoSource && (
              <div className={css(styles.rightSide)}>
                <div className={css(styles.imgContainer)}>
                  <img
                    className={css(styles.illustration)}
                    src={showState.mainForm.logoSource}
                  />
                </div>
              </div>
            )}
          </div>

          {previewState && (
            <MerchantAppConfigDetails
              showState={showState}
              previewState={previewState}
            />
          )}
          {clientId && (
            <div className={css(styles.appButtonRow)}>
              {showState.isAlreadyAdded ? (
                <PrimaryButton
                  href="/client-settings"
                  className={css(styles.appPrimaryButton)}
                >
                  View app settings
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  href={showState.mainForm.website}
                  openInNewTab
                  popoverContent={addPopover}
                  popoverPosition="top center"
                  className={css(styles.appPrimaryButton)}
                >
                  Visit website
                </PrimaryButton>
              )}
            </div>
          )}
        </div>
      </StaggeredFadeIn>
    </div>
  );
};

export default observer(MerchantAppShow);

const useStylesheet = () => {
  const { dimenStore } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: colors.white,
        },
        main: {
          backgroundColor: colors.pageBackground,
          padding: "60px 70px",
          minWidth: !dimenStore.isSmallScreen ? 475 : undefined,
        },
        body: {
          padding: `0px ${dimenStore.pageGuideX}`,
          display: "flex",
          justifyContent: "center",
          minHeight: "88vh",
        },
        appButtonRow: {
          display: "flex",
          marginTop: 20,
        },
        appPrimaryButton: {
          display: "flex",
          padding: "4px 13px",
          height: 25,
        },
        title: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          fontSize: 24,
        },
        row: {
          display: "flex",
        },
        leftSide: {
          flex: "1",
          overflow: "hidden",
          maxWidth: 600,
        },
        rightSide: {
          flex: "0 1 auto",
        },
        imgContainer: {
          paddingLeft: 20,
          maxWidth: 200,
          minWidth: 100,
          display: "flex",
        },
        illustration: {
          alignSelf: "center",
          backgroundColor: "#ffffff",
          padding: 15,
        },
        form: {
          display: "flex",
          flexDirection: "column",
        },
        loading: {
          margin: "300px 50%",
        },
        intro: {
          fontSize: 20,
          fontWeight: fonts.weightNormal,
          ":not(:last-child)": {
            marginBottom: 20,
          },
          color: palettes.textColors.Ink,
          overflowWrap: "break-word",
        },
        description: {
          fontSize: "16px",
          fontWeight: fonts.weightNormal,
          marginBottom: 20,
          color: palettes.textColors.Ink,
          overflowWrap: "break-word",
        },
        sheet: {
          display: "flex",
          flexDirection: "column",
        },
        fixedHeightSheetItem: {
          marginBottom: 20,
          overflowWrap: "anywhere",
        },
        sideBySide: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          ":nth-child(1n) > div": {
            flexGrow: 1,
            flexBasis: 0,
            flexShrink: 1,
          },
        },
        titleWrapper: {
          display: "flex",
          marginBottom: 25,
          lineHeight: 1.33,
          minWidth: !dimenStore.isSmallScreen ? 310 : undefined,
        },
        tag: {
          backgroundColor: palettes.greyScaleColors.DarkGrey,
          color: "rgba(0,0,0,.6)",
          margin: "0 10px",
          padding: "5px 10px",
          fontSize: 15,
          borderRadius: 4,
          maxHeight: 21,
        },
      }),
    [dimenStore.pageGuideX, dimenStore.isSmallScreen]
  );
};
