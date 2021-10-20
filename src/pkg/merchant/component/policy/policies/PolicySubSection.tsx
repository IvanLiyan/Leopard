// Disabling these rules for the following reasons:
// We want to be able to jump to subsections based on the URL. However,
// if we used ScrollableAnchor from react-scrollable-anchor, then the anchor
// would almost never be what the user expected as they scroll. Instead, we
// use DOM IDs for the sole purpose of an anchor; there is no actual DOM
// manipulation here.

/* eslint-disable local-rules/no-dom-manipulation */
/* eslint-disable react/forbid-dom-props */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H6, Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import LocalizationStore from "@stores/LocalizationStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedPolicyAnnouncementItemSchema } from "@merchant/container/policy/policies/MerchantPoliciesContainer";
import { useTheme } from "@stores/ThemeStore";

import HeadingNumber from "./HeadingNumber";

type PolicySubSectionProps = BaseProps & {
  readonly title?: string;
  readonly subSectionNumber?: string;
  readonly announcementsMap?: Map<string, PickedPolicyAnnouncementItemSchema>;
  readonly currentSection?: string;
};

const PolicySubSection = ({
  title,
  subSectionNumber,
  children,
  announcementsMap,
  currentSection,
}: PolicySubSectionProps) => {
  const { textWhite, warning } = useTheme();
  const styles = useStylesheet({ textWhite, warning });
  const { preferredProperLocale } = useMemo(() => {
    return LocalizationStore.instance();
  }, []);

  const announcement: PickedPolicyAnnouncementItemSchema | null =
    useMemo(() => {
      if (subSectionNumber && announcementsMap) {
        return announcementsMap.get(subSectionNumber) || null;
      }
      return null;
    }, [subSectionNumber, announcementsMap]);

  const lastUpdatedDate: string | null = useMemo(() => {
    if (announcement && announcement.effectiveDate) {
      // Our backend dates are in seconds, but JS Date takes in milleseconds
      return new Date(
        announcement.effectiveDate.unix * 1000,
      ).toLocaleDateString(preferredProperLocale);
    }
    return null;
  }, [announcement, preferredProperLocale]);

  return (
    <div className={css(styles.root)}>
      <span id={subSectionNumber} />
      {title && (
        <H6 className={css(styles.heading)}>
          <HeadingNumber
            className={css(styles.headingNumber)}
            index={subSectionNumber}
          />
          <span className={css(styles.headingText)}>{title}</span>
        </H6>
      )}
      <div
        className={css(
          styles.indented,
          currentSection &&
            subSectionNumber == currentSection &&
            styles.highlight,
        )}
      >
        {children}
      </div>
      {announcement && !announcement.requireLogIn && (
        <Alert
          className={css(styles.adjustment)}
          sentiment="info"
          title={i`Policy ${subSectionNumber} has a temporary adjustment that was last updated on ${lastUpdatedDate}`}
          text={i`View the most recent adjustment to Policy ${subSectionNumber}.`}
          link={{
            text: i`View Policy Announcement`,
            url: `/announcement/${announcement.announcementId}`,
          }}
        />
      )}
      {announcement && announcement.requireLogIn && (
        <Alert
          className={css(styles.adjustment)}
          sentiment="info"
          title={i`Policy ${subSectionNumber} has a temporary adjustment`}
          text={i`Please log in to view the most recent adjustment to Policy ${subSectionNumber}.`}
          link={{
            text: i`Log In`,
            url: `/login`,
          }}
        />
      )}
    </div>
  );
};

const useStylesheet = ({
  textWhite,
  warning,
}: {
  textWhite: string;
  warning: string;
}) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: 20,
        },
        heading: {
          display: "flex",
          flexDirection: "row",
        },
        headingNumber: {
          width: 55,
          textAlign: "right",
        },
        headingText: {
          flex: 1,
        },
        indented: {
          marginLeft: 70,
        },
        adjustment: {
          marginLeft: 70,
          marginTop: 20,
        },
        highlight: {
          animationName: {
            "0%": {
              backgroundColor: warning,
            },
            "100%": {
              backgroundColor: textWhite,
            },
          },
          animationDuration: "2500ms",
          animationIterationCount: 1,
        },
      }),
    [textWhite, warning],
  );

export default observer(PolicySubSection);
