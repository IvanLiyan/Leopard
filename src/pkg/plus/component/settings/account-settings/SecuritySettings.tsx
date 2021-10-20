/*
 *
 * SecuritySettings.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020, 10:05:06 AM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";
import { useBoolQueryParam } from "@toolkit/url";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import locales from "@toolkit/locales";

import { useNavigationStore } from "@stores/NavigationStore";

/* Merchant Plus Components */
import { Flag } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";
import SettingsSection, {
  SettingsSectionProps,
} from "@plus/component/settings/toolkit/SettingsSection";
import SettingsRow from "@plus/component/settings/toolkit/SettingsRow";

/* Relative Imports */
import ChangePasswordModal from "./modals/change-password-modal/ChangePasswordModal";
import ChangeEmailModal from "./modals/change-email-modal/ChangeEmailModal";
import TwoFactorModal from "./modals/two-factor-modal/TwoFactorModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { AccountSettingsInitialData } from "@toolkit/account-settings";

export type SecuritySettingsProps = BaseProps & {
  readonly hasBottomBorder?: SettingsSectionProps["hasBottomBorder"];
  readonly initialData: AccountSettingsInitialData;
};

const SecuritySettings: React.FC<SecuritySettingsProps> = (
  props: SecuritySettingsProps,
) => {
  const { className, style, hasBottomBorder, initialData } = props;
  const styles = useStylesheet(props);
  const navigationStore = useNavigationStore();
  const { locale } = useLocalizationStore();
  const [openTwoFactorModal] = useBoolQueryParam("open-2fa", undefined);
  const [email] = useState<string>(initialData.currentUser.email);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    initialData.currentUser.twoFactorEnabled,
  );
  const [tfaTokenSentTime, setTfaTokenSentTime] = useState(
    initialData.currentUser.tfaTokenSentTime?.iso8061,
  );
  const { hasTfaBackupCodes } = initialData.currentUser;
  const canAccessTfa = !!initialData.currentUser.phoneNumber;
  const canEditEmailAndPassword =
    initialData.currentMerchant?.isStoreMerchant == false;
  const numCurrentDevices = initialData.currentUser.numCurrentDevices || 0;

  useMountEffect(() => {
    if (openTwoFactorModal) {
      new TwoFactorModal({
        turningOnTwoFactor: true,
        updateTwoFactorEnabled: setTwoFactorEnabled,
        tfaSentTime: tfaTokenSentTime,
        updateTfaSentTime: setTfaTokenSentTime,
        hasTfaBackupCodes,
      }).render();

      navigationStore.clearPathParams(); // prevent the modal from refiring if the user hits the back button
    }
  });

  const twoFAPopover =
    i`Your account must have two-factor authentication enabled to receive ` +
    i`payments from Wish. Once enabled, you will be paid on the next ` +
    i`scheduled disbursement.`;

  const twoFAOn = twoFactorEnabled !== null && (
    <div className={css(styles.twoFAOn)}>
      {twoFactorEnabled ? i`ON` : i`OFF`}
    </div>
  );

  return (
    <SettingsSection
      className={css(className, style)}
      title={i`Security`}
      hasBottomBorder={hasBottomBorder}
    >
      <div className={css(styles.root)}>
        {canEditEmailAndPassword && (
          <SettingsRow
            title={i`Password`}
            onEdit={() => {
              new ChangePasswordModal({}).render();
            }}
          >
            ••••••••
          </SettingsRow>
        )}
        {canEditEmailAndPassword && (
          <SettingsRow
            title={i`Email`}
            onEdit={
              email !== null
                ? () => {
                    new ChangeEmailModal({ currentEmail: email }).render();
                  }
                : undefined
            }
          >
            {email}
          </SettingsRow>
        )}
        {canAccessTfa && (
          <SettingsRow
            title={i`Two-factor authentication`}
            popoverMarkdown={twoFAPopover}
            onEdit={
              twoFactorEnabled !== null
                ? () => {
                    new TwoFactorModal({
                      turningOnTwoFactor: !twoFactorEnabled,
                      updateTwoFactorEnabled: setTwoFactorEnabled,
                      tfaSentTime: tfaTokenSentTime,
                      updateTfaSentTime: setTfaTokenSentTime,
                      hasTfaBackupCodes,
                    }).render();
                  }
                : undefined
            }
          >
            {twoFAOn}
          </SettingsRow>
        )}
        <SettingsRow
          title={i`Language settings`}
          onEdit={() => {
            navigationStore.navigate("/plus/settings/account/language");
          }}
        >
          <div className={css(styles.row)}>
            <Flag
              style={{ height: 24, marginRight: 8 }}
              countryCode={locales[locale].country}
            />
            {locales[locale].name}
          </div>
        </SettingsRow>
        <SettingsRow title={i`Devices`}>
          <Link href="/plus/settings/account/devices">
            {ni18n(
              numCurrentDevices,
              "1 device used to login",
              "%1$d devices used to login",
            )}
          </Link>
        </SettingsRow>
      </div>
    </SettingsSection>
  );
};

export default observer(SecuritySettings);

const useStylesheet = (props: SecuritySettingsProps) => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        twoFAOn: {
          color: textDark,
          fontWeight: weightSemibold,
        },
        row: {
          display: "flex",
          alignItems: "center",
        },
      }),
    [textDark],
  );
};
