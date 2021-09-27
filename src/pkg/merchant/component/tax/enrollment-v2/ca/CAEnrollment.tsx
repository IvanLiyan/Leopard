/*
 * CAEnrollment.tsx
 *
 * Created by Jonah Dlin on Mon Nov 30 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Components */
import CASelectProvinces from "@merchant/component/tax/enrollment-v2/ca/CASelectProvinces";
import CAProvideTaxNumbers from "@merchant/component/tax/enrollment-v2/ca/CAProvideTaxNumbers";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useRouteStore } from "@merchant/stores/RouteStore";

type CAEnrollmentProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const CAEnrollment: React.FC<CAEnrollmentProps> = ({
  className,
  style,
  editState,
}: CAEnrollmentProps) => {
  const styles = useStylesheet();
  const routeStore = useRouteStore();

  useMountEffect(() => {
    window.scrollTo(0, 0);
  });

  const currentStep: string | null | undefined = routeStore.pathParams(
    "/tax/v2-enroll/CA/:step"
  ).step;

  return (
    <div className={css(styles.root, className, style)}>
      {currentStep === "provide-numbers" ? (
        <CAProvideTaxNumbers editState={editState} />
      ) : (
        <CASelectProvinces editState={editState} />
      )}
    </div>
  );
};

export default observer(CAEnrollment);

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
