/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, Link, Popover, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { PickedAnnouncementV2 } from "@home/toolkit/announcements";
import AnnouncementTags from "./AnnouncementTags";
import { merchFeURL } from "@core/toolkit/router";

type AnnouncementCardProps = BaseProps & {
  readonly announcement: PickedAnnouncementV2;
};

const AnnouncementCard = (props: AnnouncementCardProps) => {
  const styles = useStylesheet();
  const { announcement, className, style } = props;

  const importantToolTipContent = () => (
    <Layout.FlexRow style={styles.importantTooltip}>
      <Icon
        className={css(styles.star, styles.importantTooltipStar)}
        name="star"
      />
      {i`Important`}
    </Layout.FlexRow>
  );

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <AnnouncementTags
        style={styles.tagsContainer}
        announcement={announcement}
      />
      <Layout.FlexRow style={styles.dateContainer}>
        {announcement.important && (
          <Layout.FlexRow alignItems="center" style={styles.important}>
            <Popover
              position={"right"}
              popoverMaxWidth={256}
              popoverContent={importantToolTipContent}
            >
              <Icon className={css(styles.star)} name="star" />
            </Popover>
          </Layout.FlexRow>
        )}
        <Text weight="medium">
          {announcement.publishDate.inTimezone.formatted}
        </Text>
      </Layout.FlexRow>
      <Layout.FlexRow style={styles.titleContainer}>
        <Link
          href={merchFeURL(`/announcement/${announcement.id}`)}
          openInNewTab
          style={styles.titleLink}
        >
          <Text weight="semibold">{announcement.title}</Text>
        </Link>
      </Layout.FlexRow>
      {announcement.important && (
        <Layout.FlexRow style={styles.actionRequiredContainer}>
          <Text weight="semibold">Action Required</Text>
        </Layout.FlexRow>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(AnnouncementCard);

const useStylesheet = () => {
  const { textLight, corePrimaryDarker } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          boxSizing: "border-box",
        },
        tagsContainer: {
          marginBottom: 8,
        },
        dateContainer: {
          fontSize: 14,
          lineHeight: 1.43,
          color: textLight,
          marginBottom: 8,
        },
        titleContainer: {
          fontSize: 16,
          lineHeight: "normal",
          color: corePrimaryDarker,
        },
        titleLink: {
          ":hover": {
            textDecoration: "underline",
          },
          color: corePrimaryDarker,
        },
        actionRequiredContainer: {
          marginTop: 8,
          fontSize: 14,
          lineHeight: "normal",
          color: textLight,
        },
        important: {
          paddingRight: 10,
        },
        star: {
          width: 13,
        },
        importantTooltip: {
          fontSize: 12,
          padding: 8,
        },
        importantTooltipStar: {
          marginRight: 8,
        },
      }),
    [textLight, corePrimaryDarker],
  );
};
