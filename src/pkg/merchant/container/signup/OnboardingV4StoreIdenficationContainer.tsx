import React, { useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { Route } from "react-router-dom";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

/* Merchant Components */
import SelectStoreType from "@merchant/component/signup/SelectStoreType";
import CompanyIdentification from "@merchant/component/signup/CompanyIdentification";
import IndividualIdentification from "@merchant/component/signup/IndividualIdentification";

/* Merchant Model */
import { PartnerState } from "@merchant/model/PartnerState";
import { PspDetails } from "@merchant/model/PspDetails";

const OnboardingV4StoreIdenficationContainer: React.FC<{}> = () => {
  const styles = useStylesheet();
  const [partnerState] = useState(new PartnerState());
  const [pspDetails] = useState(new PspDetails());

  return (
    <div className={css(styles.root)}>
      <Route
        path="/onboarding-v4/store-id/individual"
        render={() => (
          <IndividualIdentification className={css(styles.content)} />
        )}
      />
      <Route
        path="/onboarding-v4/store-id/company"
        render={() => <CompanyIdentification className={css(styles.content)} />}
      />
      <Route
        path="/onboarding-v4/store-id"
        exact
        render={() => (
          <SelectStoreType
            partnerState={partnerState}
            pspDetails={pspDetails}
            className={css(styles.content)}
          />
        )}
      />
      <Route
        path="/onboarding-express/store-id"
        exact
        render={() => (
          <SelectStoreType
            partnerState={partnerState}
            pspDetails={pspDetails}
            className={css(styles.content)}
          />
        )}
      />
    </div>
  );
};

const useStylesheet = () => {
  const contentKeyframes = {
    from: {
      transform: "translate(-5px)",
      opacity: 0.3,
    },

    to: {
      transform: "translate(0px)",
      opacity: 1,
    },
  };

  return StyleSheet.create({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      padding: "50px 10px 200px 10px",
      backgroundColor: colors.pageBackground,
    },
    content: {
      flex: 1,
      animationName: [contentKeyframes],
      animationDuration: "400ms",
    },
  });
};

export default observer(OnboardingV4StoreIdenficationContainer);
