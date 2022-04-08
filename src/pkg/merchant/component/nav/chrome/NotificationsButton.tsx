import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { useQuery } from "@apollo/client";
import { useApolloStore } from "@stores/ApolloStore";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import NotificationCountBadge from "@merchant/component/nav/chrome/badges/NotificationCountBadge";
import {
  GET_NOTIFICATION_BUTTON_QUERY,
  GetNotificationButtonResponse,
} from "@toolkit/chrome";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@merchant/component/core/Icon";
import { useTheme } from "@stores/ThemeStore";
import { useEnvironmentStore } from "@stores/EnvironmentStore";

import Link from "@next-toolkit/Link";

type Props = BaseProps;

const NotificationsButton: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  const apolloStore = useApolloStore();
  const { data } = useQuery<GetNotificationButtonResponse, void>(
    GET_NOTIFICATION_BUTTON_QUERY,
    {
      client: apolloStore.client,
    }
  );
  const notificationCount = data?.notifications.notificationCount;
  const { isDev, isStaging } = useEnvironmentStore();
  const { textDark, textWhite } = useTheme();

  const useLightIcon = isDev || isStaging;

  return (
    <Link href="/notifications">
      <Layout.FlexRow className={css(styles.root, style, className)}>
        <Icon
          name="bell"
          className={css(styles.bell)}
          size={20}
          color={useLightIcon ? textWhite : textDark}
        />
        {notificationCount != null && (
          <NotificationCountBadge
            count={notificationCount}
            className={css(styles.count)}
          />
        )}
      </Layout.FlexRow>
    </Link>
  );
};

export default observer(NotificationsButton);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          cursor: "pointer",
          padding: 7,
        },
        bell: {
          marginTop: 2,
        },
        count: {
          marginLeft: 5,
        },
      }),
    []
  );
};
