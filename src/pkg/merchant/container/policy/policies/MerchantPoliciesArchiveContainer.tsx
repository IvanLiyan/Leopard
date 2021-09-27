import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PolicyNav, {
  getLocationHash,
} from "@merchant/component/policy/policies/PolicyNav";
import MerchantPoliciesArchive, {
  merchantPoliciesArchive,
} from "@merchant/component/policy/policies/archive/MerchantPoliciesArchive";

const MerchantPoliciesArchiveContainer = () => {
  const styles = useStylesheet();
  const currentSection = getLocationHash();

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Archived Policies`}
        body={() => (
          <Markdown
            text={
              i`View archived policies on this page. To access our ` +
              i`current policies, go to [Merchant Policies](${"/policy"}).`
            }
          />
        )}
        illustration="policyArchiveHeader"
      />
      <PolicyNav
        policies={merchantPoliciesArchive}
        currentSection={currentSection}
      >
        <MerchantPoliciesArchive currentSection={currentSection} />
      </PolicyNav>
    </div>
  );
};

const useStylesheet = () =>
  StyleSheet.create({
    root: {
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

export default observer(MerchantPoliciesArchiveContainer);
