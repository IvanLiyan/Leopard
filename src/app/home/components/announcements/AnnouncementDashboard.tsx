/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, Fragment } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Card, StaggeredFadeIn } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AnnouncementCard from "@home/components/announcements/AnnouncementCard";
import { PickedAnnouncementV2 } from "@home/toolkit/announcements";
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";

export type Props = BaseProps & {
  readonly announcements: ReadonlyArray<PickedAnnouncementV2>;
};

const AnnouncementDashboard = ({
  style,
  className,
  announcements: announcementProps,
}: Props) => {
  const styles = useStylesheet();

  const announcements: ReadonlyArray<PickedAnnouncementV2> =
    announcementProps || [];

  return (
    <StaggeredFadeIn deltaY={5}>
      <Card style={[styles.root, className, style]}>
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
  const { corePrimaryDarker, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: corePrimaryDarker,
          padding: "24px 16px",
        },
        separator: {
          height: 1,
          backgroundColor: borderPrimary,
          fontSize: 0,
          margin: "15.2px 0",
        },
      }),
    [corePrimaryDarker, borderPrimary],
  );
};
