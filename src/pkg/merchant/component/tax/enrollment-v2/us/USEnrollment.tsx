/*
 * USEnrollment.tsx
 *
 * Created by Jonah Dlin on Thu Nov 26 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import USProvideFEIN from "@merchant/component/tax/enrollment-v2/us/USProvideFEIN";
import USSelectStates from "@merchant/component/tax/enrollment-v2/us/USSelectStates";
import USProvideTaxNumbers from "@merchant/component/tax/enrollment-v2/us/USProvideTaxNumbers";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useRouteStore } from "@merchant/stores/RouteStore";

type USEnrollmentProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const USEnrollment: React.FC<USEnrollmentProps> = ({
  className,
  style,
  editState,
}) => {
  const styles = useStylesheet();
  const routeStore = useRouteStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentStep: string | null | undefined = routeStore.pathParams(
    "/tax/v2-enroll/US/:step"
  ).step;

  const renderContent = () => {
    if (currentStep == "provide-numbers") {
      return <USProvideTaxNumbers editState={editState} />;
    }

    if (currentStep == "fien") {
      return <USProvideFEIN editState={editState} />;
    }

    return <USSelectStates editState={editState} />;
  };

  return (
    <div className={css(styles.root, className, style)}>{renderContent()}</div>
  );
};

export default observer(USEnrollment);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
      }),
    []
  );
};
