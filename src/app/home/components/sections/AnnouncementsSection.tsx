import React, { useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Link, Layout, LoadingIndicator } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import HomeSection from "./HomeSection";
import AnnouncementDashboard from "@home/components/announcements/AnnouncementDashboard";
import { useToastStore } from "@core/stores/ToastStore";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import { useApolloStore } from "@core/stores/ApolloStore";
import { useQuery } from "@apollo/client";
import {
  AnnouncementTypeConstants,
  GET_USER_ANNOUNCEMENTS_V2,
  GetUserAnnouncementsV2ResponseType,
} from "@home/toolkit/announcements";
import { AnnouncementsForUsersV2SchemaListArgs } from "@schema";
import { merchFeUrl } from "@core/toolkit/router";

type Props = BaseProps;

const AnnouncementsSection: React.FC<Props> = ({ style, className }: Props) => {
  const { client } = useApolloStore();

  const toastStore = useToastStore();

  const {
    data: announcementV2Data,
    loading: announcementV2DataLoading,
    error: announcementV2Error,
  } = useQuery<
    GetUserAnnouncementsV2ResponseType,
    AnnouncementsForUsersV2SchemaListArgs
  >(GET_USER_ANNOUNCEMENTS_V2, {
    client: client,
    variables: {
      announcementType:
        AnnouncementTypeConstants.ANNOUNCEMENT_TYPE_SYSTEM_UPDATE,
      offset: 0,
      limit: 5,
    },
  });

  useEffect(() => {
    if (announcementV2Error) {
      toastStore.negative(
        i`Something went wrong with loading your announcements. Please try again later.`,
      );
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [announcementV2Error]);

  const styles = useStylesheet();
  const { primary } = useTheme();

  if (announcementV2DataLoading) {
    return <LoadingIndicator style={styles.loading} />;
  }

  const announcementsV2 = announcementV2Data?.announcements.forUsersV2.list;

  if (announcementsV2 == null) {
    return null;
  }

  const renderRight = () => (
    <Link href={merchFeUrl("/announcements/system-update")}>
      <Layout.FlexRow>
        {i`View all`}
        <Icon name="arrowRight" color={primary} />
      </Layout.FlexRow>
    </Link>
  );

  return (
    <HomeSection
      title={i`Announcements`}
      renderRight={renderRight}
      className={css(className, style)}
    >
      <AnnouncementDashboard
        announcements={announcementsV2}
        style={styles.root}
      />
    </HomeSection>
  );
};

export default observer(AnnouncementsSection);

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    loading: {
      margin: "5px",
    },
  });
