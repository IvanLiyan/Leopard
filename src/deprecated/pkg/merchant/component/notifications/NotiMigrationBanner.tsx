import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { RichTextBanner } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import * as notificationAPI from "@merchant/api/notifications";

const NotiMigrationBanner = () => {
  const styles = useStylesheet();

  const [visible, setVisible] = useState(true);
  const [dismissEnabled, setDismissEnabled] = useState(true);

  const dismissBanner = useCallback(async () => {
    const response = await notificationAPI
      .markNotiMigrationBannerDismiss()
      .call();
    const responseData = response?.data;
    const showBanner = responseData?.show_noti_migration_banner;
    setVisible(showBanner || false);
  }, []);

  const handleDismissClick = () => {
    if (dismissEnabled) {
      setDismissEnabled(false);
      dismissBanner();
    }
  };

  const descriptionMarkdown = () => {
    const markDown = `[${i`settings`}](/settings#notification-preferences)`;
    const markDownText =
      i`You can now manage notification preferences in your account ` +
      i`${markDown}. To help provide an ` +
      i`improved Notifications experience, ` +
      i`we have updated this page to only show recent Notifications from the last ` +
      i`few months. For your convenience, previous Notifications have been ` +
      i`marked as Read.`;

    return <Markdown text={markDownText} openLinksInNewTab />;
  };

  if (visible) {
    return (
      <div className={css(styles.root)}>
        <RichTextBanner
          title={i`Updated Notifications Experience`}
          description={descriptionMarkdown}
          sentiment="info"
          buttonText={i`Dismiss`}
          onClick={handleDismissClick}
        />
      </div>
    );
  }

  return <></>;
};

export default observer(NotiMigrationBanner);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingBottom: 20,
        },
      }),
    []
  );
};
