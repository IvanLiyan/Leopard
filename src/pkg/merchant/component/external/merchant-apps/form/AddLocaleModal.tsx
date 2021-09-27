import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { closeIcon } from "@assets/icons";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Locale } from "@toolkit/locales";
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { useTheme } from "@merchant/stores/ThemeStore";

export type LocaleModalProps = BaseProps & {
  readonly closeModal: () => unknown;
  readonly globalFormState: MerchantAppGlobalState;
  readonly setCurrentLocale: (arg0: Locale) => unknown;
};

const LocaleModalContent = observer((props: LocaleModalProps) => {
  const { closeModal, globalFormState, setCurrentLocale } = props;
  const styles = useStylesheet();
  const [localeToAdd, setLocaleToAdd] = useState<Locale>("en");

  return (
    <div className={css(styles.contentContainer)}>
      <div className={css(styles.root)}>
        <div className={css(styles.exitButton)} onClick={closeModal}>
          <img src={closeIcon} alt="close" />
        </div>
        <div className={css(styles.modalHeader)}>Add translated listing</div>
        <Markdown
          text={
            i`The appropriate translated listing for your app will appear for ` +
            i`merchants based on their regional language settings.`
          }
        />
        <Select
          className={css(styles.localeSelector)}
          options={globalFormState.localesToAdd}
          onSelected={(locale: Locale) => {
            setLocaleToAdd(locale);
          }}
          selectedValue={localeToAdd}
          minWidth={200}
          position="bottom center"
          buttonHeight={35}
          placeholder={i`Select a language`}
        />
      </div>
      <div className={css(styles.footer)}>
        <PrimaryButton
          isDisabled={!localeToAdd}
          className={css(styles.actionButton)}
          onClick={async () => {
            globalFormState.mainForm.supportedLanguages = [
              ...(globalFormState.mainForm.supportedLanguages || []),
              localeToAdd,
            ];
            closeModal();
            setCurrentLocale(localeToAdd);
          }}
        >
          Add language
        </PrimaryButton>
      </div>
    </div>
  );
});

export class AddLocaleModal extends Modal {
  globalFormState: MerchantAppGlobalState;
  setCurrentLocale: (arg0: Locale) => unknown;

  constructor(
    globalFormState: MerchantAppGlobalState,
    setCurrentLocale: (arg0: Locale) => unknown
  ) {
    super(() => null);

    this.setNoMaxHeight(false);
    this.setWidthPercentage(0.5);
    this.setContentOverflow("visible");

    this.globalFormState = globalFormState;
    this.setCurrentLocale = setCurrentLocale;
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return (
      <LocaleModalContent
        closeModal={this.closeModal}
        globalFormState={this.globalFormState}
        setCurrentLocale={this.setCurrentLocale}
      />
    );
  }
}

const useStylesheet = () => {
  const { textBlack, textWhite } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingLeft: 52,
          paddingRight: 52,
          paddingBottom: 30,
          alignItems: "center",
        },
        modalHeader: {
          display: "flex",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: fonts.weightSemibold,
          fontStyle: "normal",
          fontStretch: "normal",
          lineHeight: 1.17,
          textAlign: "center",
          marginBottom: 20,
          color: textBlack,
          paddingTop: 20,
        },
        subHeader: {
          fontSize: "16px",
          fontWeight: fonts.weightMedium,
          fontStyle: "normal",
          fontStretch: "normal",
          textAlign: "left",
        },
        exitButton: {
          position: "absolute",
          right: 0,
          top: 0,
          paddingTop: 16,
          paddingRight: 24,
          width: 24,
          backgroundColor: "ffffff",
          cursor: "pointer",
        },
        actionButton: {
          marginBottom: 15,
          marginTop: 15,
        },
        footer: {
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          placeContent: "center",
          borderRadius: "4px",
          boxShadow: "inset 0 1px 0 0 #c4cdd5",
          backgroundBlendMode: "darken",
          backgroundImage: "linear-gradient(to bottom, #ffffff, #ffffff)",
        },
        contentContainer: {
          borderRadius: "4px",
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          backgroundColor: "#ffffff",
        },
        localeSelector: {
          maxWidth: "570px",
          marginTop: 20,
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
          color: textWhite,
        },
      }),
    [textBlack, textWhite]
  );
};
