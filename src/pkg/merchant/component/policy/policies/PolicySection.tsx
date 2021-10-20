import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import ScrollableAnchor from "react-scrollable-anchor";

/* Lego Components */
import { H4 } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useNavigationStore } from "@stores/NavigationStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import { PickedPolicyAnnouncementItemSchema } from "@merchant/container/policy/policies/MerchantPoliciesContainer";
import HeadingNumber from "./HeadingNumber";
import PolicySubSection from "./PolicySubSection";

type PolicySectionProps = BaseProps & {
  readonly dateUpdated: string;
  readonly name: string;
  readonly sectionNumber?: string;
  readonly title: string;
  readonly linkToVersion?: string;
};

export type PolicyProps = BaseProps & {
  readonly sectionNumber: string;
  readonly version?: string;
  readonly announcementsMap?: Map<string, PickedPolicyAnnouncementItemSchema>;
  readonly currentSection?: string;
};

const PolicySection = ({
  className,
  dateUpdated,
  name: policyName,
  sectionNumber,
  title,
  linkToVersion,
  children,
}: PolicySectionProps) => {
  const { isNavyBlueNav } = useNavigationStore();
  const styles = useStylesheet();

  return (
    <ScrollableAnchor id={policyName}>
      <Card className={css(className, styles.root)}>
        <H4>
          <HeadingNumber
            className={css(styles.headingNumber)}
            index={sectionNumber ? sectionNumber : undefined}
          />
          {title}
        </H4>
        <div className={css(styles.dateUpdated)}>
          Last updated on {dateUpdated}
        </div>
        {children}
        {!!linkToVersion && (
          <PolicySubSection>
            <Link
              className={css(styles.archiveLink)}
              href={`/policy-${linkToVersion}#${policyName}`}
              openInNewTab
            >
              <span>View archived {title} policies</span>
              <Icon
                className={css(styles.archiveIcon)}
                name={isNavyBlueNav ? "arrowRightDarkBlue" : "arrowRightBlue"}
              />
            </Link>
          </PolicySubSection>
        )}
      </Card>
    </ScrollableAnchor>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 25,
          paddingLeft: 10,
        },
        headingNumber: {
          width: 55,
          textAlign: "right",
        },
        dateUpdated: {
          marginTop: 10,
          marginLeft: 70,
        },
        archiveLink: {
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          ":hover > :not(span)": {
            marginLeft: 15,
          },
        },
        archiveIcon: {
          width: 15,
          marginLeft: 10,
          transition: "margin 0.2s ease",
        },
      }),
    [],
  );

export default observer(PolicySection);
