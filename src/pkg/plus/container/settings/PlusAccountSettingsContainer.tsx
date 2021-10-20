import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useStringQueryParam } from "@toolkit/url";

/* Merchant Plus Components */
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import AccountSettings from "@plus/component/settings/account-settings/AccountSettings";

/* Merchant Stores */
import { useToastStore } from "@stores/ToastStore";

/* Schema */
import { AccountSettingsInitialData } from "@toolkit/account-settings";

type Props = {
  readonly initialData: AccountSettingsInitialData;
};

const PlusAccountSettingsContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const [fromConfirmEmail] = useStringQueryParam("confirm-email", undefined);

  useEffect(() => {
    if (fromConfirmEmail === "true") {
      toastStore.positive(i`Your email address has been updated!`);
    } else if (fromConfirmEmail === "false") {
      toastStore.negative(i`There was a problem verifying your email`);
    }
  }, [fromConfirmEmail, toastStore]);

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Account`}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          { name: i`Account`, href: "/plus/settings/account" },
        ]}
      />
      <PageGuide>
        <AccountSettings
          className={css(styles.content)}
          initialData={initialData}
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
    [],
  );

export default observer(PlusAccountSettingsContainer);
