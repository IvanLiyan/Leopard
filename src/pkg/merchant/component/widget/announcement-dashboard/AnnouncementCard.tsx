/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { star } from "@assets/icons";

/* Relative Imports */
import AnnouncementTags from "./AnnouncementTags";
import { PickedAnnouncement } from "@toolkit/announcement";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type AnnouncementCardProps = BaseProps & {
  readonly announcement: PickedAnnouncement;
};

const AnnouncementCard = (props: AnnouncementCardProps) => {
  const styles = useStylesheet();
  const { announcement, className, style } = props;

  const importantToolTipContent = () => (
    <div className={css(styles.flexRow, styles.importantTooltip)}>
      <img
        className={css(styles.star, styles.importantTooltipStar)}
        src={star}
        alt="star"
      />
      {i`Important`}
    </div>
  );

  return (
    <div className={css(styles.root, className, style)}>
      <AnnouncementTags
        className={css(styles.tagsContainer)}
        announcement={announcement}
      />
      <div className={css(styles.flexRow, styles.dateContainer)}>
        {announcement.important && (
          <div className={css(styles.important)}>
            <Popover
              position={"right"}
              popoverMaxWidth={256}
              popoverContent={importantToolTipContent}
            >
              <img className={css(styles.star)} src={star} alt="star" />
            </Popover>
          </div>
        )}
        <div>{announcement.createdAt.inTimezone.formatted}</div>
      </div>
      <div className={css(styles.flexRow, styles.titleContainer)}>
        <Link
          href={`/announcement/${announcement.id}`}
          openInNewTab
          className={css(styles.titleLink)}
          style={{
            color: palettes.coreColors.DarkerWishBlue,
          }}
        >
          {announcement.title}
        </Link>
      </div>
      {announcement.important && (
        <div className={css(styles.flexRow, styles.actionRequiredContainer)}>
          Action Required
        </div>
      )}
    </div>
  );
};

export default observer(AnnouncementCard);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          boxSizing: "border-box",
        },
        flexRow: {
          display: "flex",
          flexDirection: "row",
        },
        tagsContainer: {
          marginBottom: 8,
        },
        dateContainer: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          lineHeight: 1.43,
          color: palettes.textColors.LightInk,
          marginBottom: 8,
        },
        titleContainer: {
          fontSize: 16,
          fontWeight: fonts.weightBold,
          lineHeight: "normal",
          color: palettes.coreColors.DarkerWishBlue,
        },
        titleLink: {
          ":hover": {
            textDecoration: "underline",
          },
        },
        actionRequiredContainer: {
          marginTop: 8,
          fontSize: 14,
          fontWeight: fonts.weightSemibold,
          lineHeight: "normal",
          color: palettes.textColors.LightInk,
        },
        important: {
          paddingRight: 10,
          display: "flex",
          alignItems: "center",
        },
        star: {
          width: 13,
        },
        importantTooltip: {
          fontFamily: fonts.proxima,
          fontSize: 12,
          padding: 8,
        },
        importantTooltipStar: {
          marginRight: 8,
        },
      }),
    []
  );
};
