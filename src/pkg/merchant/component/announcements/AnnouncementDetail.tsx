/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Link, StaggeredFadeIn, Text } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Relative Imports */
import AnnouncementCategories from "./AnnouncementCategories";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Announcement } from "@merchant/api/announcements";

type AnnouncementDetailPageProps = BaseProps & {
  readonly announcement: Announcement;
};

const AnnouncementDetail = (props: AnnouncementDetailPageProps) => {
  const styles = useStylesheet();
  const { announcement, className, style } = props;

  const showHeader = !!(
    announcement.program ||
    (announcement.categories && announcement.categories.length)
  );

  return (
    <Card className={css(className, style, styles.root)}>
      {showHeader && <AnnouncementCategories announcement={announcement} />}
      <StaggeredFadeIn
        deltaY={5}
        animationDelayMs={400}
        className={css(styles.content)}
      >
        <div className={css(styles.titleContainer)}>
          <div className={css(styles.important)}>
            {announcement.important && (
              <Illustration
                className={css(styles.star)}
                name="star"
                alt="star image"
              />
            )}
          </div>
          <Text className={css(styles.title)} weight="bold">
            {announcement.title}
          </Text>
        </div>
        <Text weight="regular" className={css(styles.dateContainer)}>
          {announcement.created_dt_str_day}
        </Text>
        <div className={css(styles.textContainer)}>
          {announcement.message &&
            announcement.message.split("\n").map((paragraph) => (
              <React.Fragment key={paragraph}>
                <span>{paragraph}</span>
                <br />
              </React.Fragment>
            ))}
        </div>
        <Link href={announcement.link}>{announcement.link}</Link>
        {announcement.important && (
          <div className={css(styles.ctaContainer)}>
            <Text weight="regular" className={css(styles.ctaText)}>
              {announcement.cta_text}
            </Text>
            <Text weight="regular" className={css(styles.ctaDate)}>
              Effective Date: {announcement.cta_due_date}
            </Text>
          </div>
        )}
      </StaggeredFadeIn>
    </Card>
  );
};

export default observer(AnnouncementDetail);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexShrink: 1,
        },
        content: {
          padding: "40px 52px",
        },
        important: {
          width: 20,
          paddingTop: 4,
          flexGrow: 0,
        },
        star: {
          width: 17.5,
          height: 16,
        },
        title: {
          flexGrow: 1,
        },
        titleContainer: {
          fontSize: 24,
          align: "center",
          lineHeight: 1.33,
          letterSpacing: "normal",
          color: palettes.textColors.Ink,
          textAlign: "center",
          marginRight: 20,
          display: "flex",
          flexDirection: "row",
        },
        dateContainer: {
          marginTop: 6,
          fontSize: "16px",
          color: palettes.textColors.DarkInk,
          textAlign: "center",
        },
        textContainer: {
          marginTop: 32,
        },
        ctaContainer: {
          marginTop: 20,
          backgroundColor: palettes.greyScaleColors.LightGrey,
          padding: "8px 16px",
          boxSizing: "border-box",
        },
        ctaText: {
          fontSize: 16,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: 1.5,
          letterSpacing: "normal",
          color: palettes.coreColors.DarkerWishBlue,
        },
        ctaDate: {
          fontSize: 14,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: 1.43,
          letterSpacing: "normal",
          color: palettes.textColors.DarkInk,
        },
      }),
    [],
  );
};
