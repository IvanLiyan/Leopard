/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import Pill from "@merchant/component/announcements/Pill";
import { programIdToImgNameMap } from "@merchant/component/announcements/AnnouncementCategories";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedAnnouncement } from "@toolkit/announcement";

type AnnouncementTagsProps = BaseProps & {
  readonly announcement: PickedAnnouncement;
};

const AnnouncementTags = (props: AnnouncementTagsProps) => {
  const styles = useStylesheet();
  const { announcement, className } = props;

  const renderPill = () => {
    if (announcement.program != null) {
      return (
        <Pill
          className={css(styles.pill)}
          illustrationName={programIdToImgNameMap[announcement.program.type]}
          text={announcement.program.text}
          height={24}
        />
      );
    } else if (announcement.categories.length > 0) {
      return (
        <Pill
          className={css(styles.pill)}
          text={announcement.categories[0].text}
          height={24}
        />
      );
    }

    return null;
  };

  // number of extra tags
  const number =
    announcement.categories.length + (announcement.program ? 1 : 0) - 1;

  return (
    <div className={css(styles.root, className)}>
      {renderPill()}
      {number > 0 && (
        <div className={css(styles.extraTags)}>+ {number} more</div>
      )}
    </div>
  );
};

export default observer(AnnouncementTags);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          lineHeight: "24px",
          flexWrap: "wrap",
        },
        pill: {
          marginRight: 8,
        },
        extraTags: {
          color: palettes.textColors.LightInk,
          fontSize: 14,
          fontWeight: fonts.weightSemibold,
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
        },
      }),
    []
  );
};
