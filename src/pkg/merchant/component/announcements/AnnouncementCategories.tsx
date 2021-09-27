/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import Pill from "@merchant/component/announcements/Pill";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Announcement, ProgramType } from "@merchant/api/announcements";
import { IllustrationName } from "@merchant/component/core";

type AnnouncementDetailPageProps = BaseProps & {
  readonly announcement: Announcement;
};

export const programIdToImgNameMap: {
  [key in ProgramType]: IllustrationName;
} = {
  ADVANCED_LOGISTICS_PROGRAM: "advancedLogistics",
  EPC: "epc",
  FBW_FBS: "fbw2",
  MERCHANT_STANDING: "platinumMerchantStanding",
  PARTIAL_REFUNDS: "refunds",
  PRODUCTBOOST: "productBoostDarkBlue",
  RETURNS_PROGRAM: "returns",
  WISH_EXPRESS: "wishExpressBlueBox",
  WISHPOST: "wishPost",
};

const AnnouncementDetail = (props: AnnouncementDetailPageProps) => {
  const { announcement, className, style } = props;
  const styles = useStylesheet();

  const programExists = !!announcement.program;
  if (!announcement.categories) {
    return null;
  }

  return (
    <StaggeredFadeIn
      className={css(className, style, styles.root)}
      animationDelayMs={200}
      deltaY={5}
      animationDurationMs={1000}
    >
      {announcement.program && (
        <Pill
          illustrationName={programIdToImgNameMap[announcement.program[0]]}
          text={announcement.program[1]}
        />
      )}
      {announcement.categories.map(([categoryType, categoryName], index) => {
        // If the program exists, it is shown first. If it doesn't, we don't want
        // padding to be applied to the category when it is the very first one
        const className = css(
          programExists || index > 0 ? styles.programPillContainer : null
        );
        return (
          <Pill text={categoryName} key={categoryType} className={className} />
        );
      })}
    </StaggeredFadeIn>
  );
};

export default observer(AnnouncementDetail);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "15px 52px",
          backgroundColor: palettes.greyScaleColors.LighterGrey,
        },
        programPillContainer: {
          marginLeft: 15,
        },
      }),
    []
  );
};
