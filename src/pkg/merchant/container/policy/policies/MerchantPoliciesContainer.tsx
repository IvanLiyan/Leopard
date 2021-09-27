import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PolicyNav, {
  getLocationHash,
} from "@merchant/component/policy/policies/PolicyNav";
import MerchantPolicies, {
  merchantPolicies,
} from "@merchant/component/policy/policies/latest/MerchantPolicies";

import { PolicyAnnouncementItemSchema } from "@schema/types";

export type PickedPolicyAnnouncementItemSchema = Pick<
  PolicyAnnouncementItemSchema,
  "section" | "requireLogIn" | "announcementId" | "effectiveDate"
>;

type InitialData = {
  readonly policyPublic: {
    announcements?: ReadonlyArray<PickedPolicyAnnouncementItemSchema> | null;
  };
};

type InitialProps = {
  readonly initialData: InitialData;
};

const MerchantPoliciesContainer = ({ initialData }: InitialProps) => {
  const styles = useStylesheet();

  const announcementsMap: Map<
    string,
    PickedPolicyAnnouncementItemSchema
  > | null = useMemo(() => {
    if (initialData.policyPublic.announcements) {
      return new Map(
        initialData.policyPublic.announcements.map(
          (announcement: PickedPolicyAnnouncementItemSchema) => [
            announcement.section,
            announcement,
          ]
        )
      );
    }
    return null;
  }, [initialData]);

  const currentSection = getLocationHash();

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Merchant Policies`}
        body={() => (
          <>
            <div className={css(styles.headerParagraph)}>
              As a merchant on Wish, you are required to follow these policies.
            </div>
            {announcementsMap && announcementsMap.size > 0 && (
              <div className={css(styles.headerIconSection)}>
                <Icon name="tooltip" className={css(styles.headerIcon)} />
                <Markdown
                  text={
                    i`There are currently temporary policies in place. Please go to ` +
                    i`[Announcements](${"/announcements/system-update?categories=POLICIES_AND_TERMS"})` +
                    i` for the most up-to-date policy adjustments.`
                  }
                />
              </div>
            )}
          </>
        )}
        illustration="thirdPartyBrandedGoodsDeclaration"
      />
      <PolicyNav policies={merchantPolicies} currentSection={currentSection}>
        <MerchantPolicies
          announcementsMap={announcementsMap ? announcementsMap : undefined}
          currentSection={currentSection}
        />
      </PolicyNav>
    </div>
  );
};

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      flex: 1,
      WebkitFlex: "1 0 auto",
      display: "flex",
      flexDirection: "column",
    },
    headerParagraph: {
      paddingTop: 10,
      paddingBottom: 25,
    },
    headerIconSection: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      width: 25,
      marginRight: 10,
    },
  });

export default observer(MerchantPoliciesContainer);
