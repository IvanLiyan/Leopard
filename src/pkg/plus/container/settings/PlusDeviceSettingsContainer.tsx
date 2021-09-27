import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import DeviceSettings from "@plus/component/settings/device-settings/DeviceSettings";

/* Toolkit */
import { UserSchema } from "@schema/types";

type Props = {
  readonly initialData: {
    readonly currentUser: Pick<UserSchema, "phoneNumber">;
  };
};

const PlusDeviceSettingsContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Devices`}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          { name: i`Account`, href: "/plus/settings/account" },
          { name: i`Devices`, href: "/plus/settings/account/devices" },
        ]}
      />
      <PageGuide>
        <DeviceSettings
          className={css(styles.content)}
          phoneNumber={initialData.currentUser.phoneNumber}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          marginTop: 20,
        },
      }),
    []
  );

export default observer(PlusDeviceSettingsContainer);
