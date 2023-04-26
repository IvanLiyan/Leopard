/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, Layout } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AnnouncementProgram } from "@schema";
import {
  PickedAnnouncementV2,
  ProgramIdToIllustrationName,
} from "@home/toolkit/announcements";
import { useTheme } from "@core/stores/ThemeStore";
import AnnouncementPill from "./AnnouncementPill";

type AnnouncementTagsProps = BaseProps & {
  readonly announcement: PickedAnnouncementV2;
};

const AnnouncementTags = (props: AnnouncementTagsProps) => {
  const styles = useStylesheet();
  const { announcement, className, style } = props;

  const renderPill = () => {
    if (announcement) {
      if (announcement.program != null) {
        const programType: AnnouncementProgram = announcement.program.type;
        const programText: string = announcement.program.text;
        return (
          <AnnouncementPill
            style={styles.pill}
            illustrationName={ProgramIdToIllustrationName[programType]}
            text={programText}
            height={24}
          />
        );
      } else if (announcement.categories.length > 0) {
        return (
          <AnnouncementPill
            style={styles.pill}
            text={announcement.categories[0].text}
            height={24}
          />
        );
      }
    }
    return null;
  };

  // number of extra tags
  const number =
    announcement.categories.length + (announcement.program ? 1 : 0) - 1;

  return (
    <Layout.FlexRow style={[styles.root, className, style]}>
      {renderPill()}
      {number > 0 && (
        <Text weight="semibold" style={styles.extraTags}>
          + {number} more
        </Text>
      )}
    </Layout.FlexRow>
  );
};

export default observer(AnnouncementTags);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          lineHeight: "24px",
          flexWrap: "wrap",
        },
        pill: {
          marginRight: 8,
        },
        extraTags: {
          color: textLight,
          fontSize: 14,
          fontStretch: "normal",
          fontStyle: "normal",
        },
      }),
    [textLight],
  );
};
