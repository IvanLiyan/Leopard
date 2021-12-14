/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, Fragment } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  HomeAnnouncementsResponseData,
  GET_ANNOUNCEMENTS_QUERY,
} from "@toolkit/announcement";

/* Relative Imports */
import AnnouncementCard from "./AnnouncementCard";

export type Props = BaseProps;

const AnnouncementDashboard = ({ style, className }: Props) => {
  const { data, loading } = useQuery<HomeAnnouncementsResponseData, void>(
    GET_ANNOUNCEMENTS_QUERY,
  );

  const announcements = data?.announcements?.forUsers;

  const styles = useStylesheet();
  if (loading) {
    return <LoadingIndicator className={css(styles.loading)} />;
  } else if (
    announcements == null ||
    (announcements != null && announcements.length === 0)
  ) {
    // let's not show this when there are no announcements
    return null;
  }

  return (
    <StaggeredFadeIn deltaY={5}>
      <Card className={css(styles.root, className, style)}>
        {announcements.map((announcement, index) => (
          <Fragment key={announcement.id}>
            <AnnouncementCard announcement={announcement} />
            {index < announcements.length - 1 && (
              <div className={css(styles.separator)} />
            )}
          </Fragment>
        ))}
      </Card>
    </StaggeredFadeIn>
  );
};

export default observer(AnnouncementDashboard);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontFamily: fonts.proxima,
          color: palettes.coreColors.DarkerWishBlue,
          padding: "24px 16px",
        },
        allAnnouncementsSection: {
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
        },
        allAnnouncementsLink: {
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: palettes.coreColors.DarkerWishBlue, // override link default
          fontSize: 16,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: 1.5,
          letterSpacing: "normal",
          ":hover": {
            textDecoration: "none",
            opacity: 1,
          },
          // eslint-disable-next-line local-rules/no-broad-styling-rules
          ":hover span:not(.fa)": { textDecoration: "underline" },
        },
        separator: {
          height: 1,
          backgroundColor: palettes.greyScaleColors.Grey,
          fontSize: 0,
          margin: "15.2px 0",
        },
        loading: {},
      }),
    [],
  );
};
