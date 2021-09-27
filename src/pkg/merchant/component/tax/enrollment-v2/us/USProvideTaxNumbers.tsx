/*
 * USProvideTaxNumbers.tsx
 *
 * Created by Jonah Dlin on Thu Nov 26 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { TextInput, BackButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { TaxNumberValidator } from "@toolkit/validators";
import { getStateName } from "@ContextLogic/lego/toolkit/states";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTaxStore } from "@merchant/stores/TaxStore";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import { CellInfo } from "@ContextLogic/lego";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { useRouteStore } from "@merchant/stores/RouteStore";

type StateInfo = {
  readonly stateCode: string;
  readonly stateName: string;
  readonly taxInfo: CommerceMerchantTaxInfo;
};

type USProvideTaxNumbersProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const USProvideTaxNumbers: React.FC<USProvideTaxNumbersProps> = ({
  className,
  style,
  editState,
}: USProvideTaxNumbersProps) => {
  const styles = useStylesheet();
  const taxStore = useTaxStore();
  const toastStore = useToastStore();
  const routeStore = useRouteStore();

  const {
    currentStates,
    usNoStateLevelTaxIDRequiredStates,
    pendingTaxInfos,
    readyToSave,
  } = editState;

  const usCurrentStates = currentStates("US");

  const data = useMemo((): ReadonlyArray<StateInfo> => {
    const stateInfos: ReadonlyArray<StateInfo> = usCurrentStates
      .filter(
        (stateCode) =>
          usNoStateLevelTaxIDRequiredStates.includes(stateCode) === false ||
          stateCode === "AK"
      )
      .map((stateCode) => {
        const taxInfos: ReadonlyArray<CommerceMerchantTaxInfo> = pendingTaxInfos.filter(
          (info) =>
            info.stateCode === stateCode &&
            info.countryCode === "US" &&
            info.authorityLevel === "STATE"
        );

        return {
          stateCode,
          stateName: getStateName("US", stateCode),
          taxInfo: taxInfos[0],
        };
      });

    return _.sortBy(stateInfos, (info) => info.stateName);
  }, [usCurrentStates, usNoStateLevelTaxIDRequiredStates, pendingTaxInfos]);

  useMountEffect(() => {
    if (data.length === 0) {
      routeStore.pushPath("/tax/v2-enroll/US/fien");
    }
  });

  const [validator] = useState(new TaxNumberValidator({ countryCode: "US" }));

  const onContinueClicked = () => {
    const hasInvalidNumbers = data.some(
      ({ taxInfo }) => taxInfo.numberIsInvalid
    );

    if (hasInvalidNumbers) {
      toastStore.error(i`Please provide valid tax IDs for the states listed.`, {
        timeoutMs: 5000,
      });
      return;
    }

    editState.pushNext();
  };

  const renderTextInput = (info: CommerceMerchantTaxInfo) => {
    return (
      <TextInput
        className={css(styles.stateInput)}
        value={info.taxNumber}
        height={35}
        onChange={({ text }: OnTextChangeEvent) => {
          info.taxNumber = text;
        }}
        onValidityChanged={(isValid) => (info.numberIsInvalid = !isValid)}
        placeholder={i`Enter TIN here`}
        validators={[validator]}
        focusOnMount={info === data[0].taxInfo}
      />
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.titleContainerInner)}>
          <Text weight="bold" className={css(styles.title)}>
            Tax for United States
          </Text>
        </div>
        <Text weight="medium" className={css(styles.stepsText)}>
          2 of 2
        </Text>
      </div>
      <Table className={css(styles.table)} data={data} hideBorder>
        <Table.Column columnKey="stateName" title={i`States`} />

        <Table.Column
          columnKey="taxInfo"
          title={taxStore.getTaxNumberName({ countryCode: "US" })}
          description={taxStore.getTaxDescription({ countryCode: "US" })}
          handleEmptyRow
          minWidth={300}
        >
          {({ value }: CellInfo<CommerceMerchantTaxInfo, StateInfo>) =>
            renderTextInput(value)
          }
        </Table.Column>
      </Table>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => routeStore.push("/tax/v2-enroll/US")} />

        <PrimaryButton onClick={onContinueClicked}>
          {readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(USProvideTaxNumbers);

const useStylesheet = () => {
  const { borderPrimary, textLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "0px 25px 15px 25px",
          justifyContent: "space-between",
        },
        title: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
        },
        titleContainerInner: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        stepsText: {
          fontSize: 16,
          lineHeight: 1.5,
          cursor: "default",
          userSelect: "none",
          color: textLight,
        },
        table: {
          margin: "15px 10px",
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        stateInput: {
          // eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 320,
        },
      }),
    [borderPrimary, textLight, textBlack]
  );
};
