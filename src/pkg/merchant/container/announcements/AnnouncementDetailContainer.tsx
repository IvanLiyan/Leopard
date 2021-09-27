/* eslint-disable local-rules/no-empty-link */
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import AnnouncementDetail from "@merchant/component/announcements/AnnouncementDetail";

/* Merchant API */
import * as announcementAPI from "@merchant/api/announcements";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const AnnouncementDetailContainer = () => {
  const { announcementId } = usePathParams("/announcement/:announcementId");

  const [response] = useRequest(
    announcementAPI.getAnnouncementDetail({ ann_id: announcementId })
  );

  const errorMessage = response?.msg;
  useEffect(() => {
    const { toastStore } = AppStore.instance();
    if (errorMessage) {
      toastStore.error(errorMessage);
    }
  }, [errorMessage]);

  const responseData = response?.data;

  const announcement = responseData?.announcement;

  const styles = useStylesheet();

  if (announcement == null) {
    return <LoadingIndicator className={css(styles.loading)} />;
  }

  return (
    <div className={css(styles.root)}>
      <AnnouncementDetail
        className={css(styles.announcement)}
        announcement={announcement}
      />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        },
        announcement: {
          maxWidth: 900,
          marginBottom: 50,
        },
        loading: {
          margin: "300px 50%",
        },
      }),
    []
  );
};

export default observer(AnnouncementDetailContainer);
