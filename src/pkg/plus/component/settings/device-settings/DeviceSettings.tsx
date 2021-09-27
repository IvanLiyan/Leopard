/*
 * DeviceSettings.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { formatPhoneNumber } from "@toolkit/phone-number";

/* Lego Components */
import { Card, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";

import { ci18n } from "@legacy/core/i18n";

/* Merchant Plus Components */
import SettingsSection from "@plus/component/settings/toolkit/SettingsSection";
import SettingsRow from "@plus/component/settings/toolkit/SettingsRow";

/* Relative Imports */
import DeviceTable from "./DeviceTable";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { UserSchema } from "@schema/types";

export type Props = BaseProps & {
  readonly phoneNumber?: UserSchema["phoneNumber"];
};

const DeviceSettings: React.FC<Props> = (props: Props) => {
  const { className, style, phoneNumber } = props;
  const styles = useStylesheet(props);

  const newDevicesPopover =
    i`This is how you will be alerted when someone attempts ` +
    i`to logs into your account from a new device`;
  const loggedInDevicesPopover =
    i`You are currently logged in to Wish on these devices. You ` +
    i`won't get notified when logging in from the devices below.`;
  const mailToLink =
    " [merchant_support@wish.com](mailto:merchant_support@wish.com)";
  const unregonizedDeviceText = ci18n(
    "Part of list of steps to recover your account",
    "If you don't recognize a device, somebody may have gained unauthorized access to your account. Please follow the steps below"
  );
  const removeDeviceText = ci18n(
    "Part of list of steps to recover your account",
    "Remove the device"
  );
  const clearDevicesText = ci18n(
    "Part of list of steps to recover your account",
    "Clear your device history"
  );
  const changePasswordText = ci18n(
    "Part of list of steps to recover your account",
    "Change your password"
  );
  const contactAMText = ci18n(
    "Part of list of steps to recover your account",
    "Contact your account manager at %1$s",
    mailToLink
  );
  const unregonizedDeviceInstructions =
    `${unregonizedDeviceText}:${"\n\n"}- ${removeDeviceText}${"\n\n"}- ` +
    `${clearDevicesText}${"\n\n"}- ${changePasswordText}${"\n\n"}- ${contactAMText}`;

  return (
    <Card className={css(styles.root, className, style)}>
      {phoneNumber && (
        <SettingsSection title={i`Security`} hasBottomBorder>
          <SettingsRow
            title={i`New device alerts`}
            popoverMarkdown={newDevicesPopover}
          >
            SMS to: {formatPhoneNumber(phoneNumber)}
          </SettingsRow>
        </SettingsSection>
      )}
      <SettingsSection title={i`Logged in`}>
        <SettingsRow
          title={i`${6} devices`} // TODO: fix this
          popoverMarkdown={loggedInDevicesPopover}
          className={css(styles.loggedInDevicesRow)}
        />
        <Markdown
          text={unregonizedDeviceInstructions}
          className={css(styles.markdown)}
        />
        <DeviceTable />
      </SettingsSection>
    </Card>
  );
};

export default observer(DeviceSettings);

const useStylesheet = (props: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "24px 50px 50px 50px",
        },
        phoneNumber: {
          display: "inline-block",
          fontWeight: weightSemibold,
        },
        loggedInDevicesRow: {
          marginBottom: -20,
        },
        markdown: {
          marginBottom: 20,
        },
        tip: {
          marginTop: 40,
        },
      }),
    []
  );
};
