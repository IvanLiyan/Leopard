/*
 * USSelectStates.tsx
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
import {
  Accordion,
  BackButton,
  EditButton,
  CheckboxField,
  StaggeredScaleIn,
  Text,
  Layout,
} from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getStateName, StateCode } from "@ContextLogic/lego/toolkit/states";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import USHomeRuleSelectionModal from "@merchant/component/tax/enrollment-v2/us/USHomeRuleSelectionModal";
import USMarketplaceTable from "@merchant/component/tax/USMarketplaceTable";

/* Toolkit */
import { USNomadStates, USHomeRuleStates } from "@toolkit/tax/enrollment";

/* Relative Imports */
import USNomadStatesTable from "./USNomadStatesTable";

/* Merchant Stores */
import { useDeviceStore } from "@merchant/stores/DeviceStore";
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

type USSelectStatesProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

type StateInfo = {
  readonly stateCode: StateCode;
  readonly stateName: string;
};

const USSelectStates: React.FC<USSelectStatesProps> = ({
  className,
  style,
  editState,
}: USSelectStatesProps) => {
  const [marketplaceAccordionIsOpen, setMarketplaceAccordionIsOpen] = useState(
    false
  );
  const [nonTaxableAccordionIsOpen, setNonTaxableAccordionIsOpen] = useState(
    false
  );

  const { usMarketplaceStates, usMarketplaceMunicipalities } = editState;

  const taxStore = useTaxStore();
  const { isSmallScreen } = useDeviceStore();
  const routeStore = useRouteStore();

  const numColumns = isSmallScreen ? 2 : 4;
  const styles = useStylesheet(numColumns);

  const marketplaceStates = usMarketplaceStates as ReadonlyArray<StateCode>;

  const data = useMemo((): ReadonlyArray<StateInfo> => {
    const { availableUSStates } = taxStore;
    const noMarketplaceStates: ReadonlyArray<StateCode> = [
      "AK",
      ..._.difference(availableUSStates, marketplaceStates, USNomadStates),
    ];
    const stateInfos: ReadonlyArray<StateInfo> = noMarketplaceStates.map(
      (stateCode) => ({
        stateCode,
        stateName: getStateName("US", stateCode),
      })
    );

    return _.sortBy(stateInfos, (_) => _.stateName);
  }, [marketplaceStates, taxStore]);

  const rows = useMemo((): ReadonlyArray<ReadonlyArray<StateInfo>> => {
    return _.chunk([...data], numColumns);
  }, [data, numColumns]);

  const descriptionForState = (
    stateCode: StateCode
  ): string | null | undefined => {
    if (marketplaceStates.includes(stateCode)) {
      return (
        i`The associated transaction tax for this order will ` +
        i`be collected and remitted by Wish as a marketplace.`
      );
    }

    if (USNomadStates.includes(stateCode)) {
      return i`There is no state-wide sales tax in this state.`;
    }

    return null;
  };

  const setStateSelected = (stateCode: StateCode, selected: boolean) => {
    if (
      selected === true &&
      USNomadStates.includes(stateCode) &&
      USHomeRuleStates.includes(stateCode)
    ) {
      new USHomeRuleSelectionModal({
        stateCode,
        editState,
      }).render();
    }

    editState.setStateSelected({
      countryCode: "US",
      stateCode,
      selected,
    });
  };

  const onContinueClicked = () => {
    if (editState.needStateTaxIdsFromUS) {
      routeStore.push("/tax/v2-enroll/US/provide-numbers");
    } else {
      editState.pushNext();
    }
  };

  const renderRow = (states: ReadonlyArray<StateInfo>, rowIndex: number) => {
    return (
      <tr key={`row-${rowIndex}`}>
        {states.map((stateInfo: StateInfo, colIndex: number) => {
          const { stateCode, stateName } = stateInfo;
          const isHomeRuleState = USHomeRuleStates.includes(stateCode);
          const isMarketplaceState = marketplaceStates.includes(stateCode);
          const isNomadState = USNomadStates.includes(stateCode);
          const checked = editState.currentStates("US").includes(stateCode);

          const disabled =
            isMarketplaceState || (isNomadState && !isHomeRuleState);

          let showEditButton = false;
          if (isHomeRuleState) {
            showEditButton = stateCode == "AK" || checked;
          }

          return (
            <td key={stateName} className={css(styles.column)}>
              <Layout.FlexRow
                className={css(styles.checkboxContent)}
                justifyContent="flex-start"
              >
                <CheckboxField
                  className={css(styles.checkbox)}
                  onChange={(selected) => setStateSelected(stateCode, selected)}
                  checked={checked}
                  disabled={disabled}
                  description={descriptionForState(stateCode)}
                  popoverPosition={
                    colIndex === 0 ? "right center" : "top center"
                  }
                >
                  <div className={css(styles.checkboxTitle)}>{stateName}</div>
                </CheckboxField>

                {showEditButton && (
                  <StaggeredScaleIn animationDurationMs={80}>
                    <EditButton
                      onClick={() => {
                        new USHomeRuleSelectionModal({
                          stateCode,
                          editState,
                        }).render();
                      }}
                    />
                  </StaggeredScaleIn>
                )}
              </Layout.FlexRow>
            </td>
          );
        })}
      </tr>
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
          1 of {editState.needStateTaxIdsFromUS ? 2 : 1}
        </Text>
      </div>
      <table className={css(styles.table)}>
        <tbody>{rows.map((rows, index) => renderRow(rows, index))}</tbody>
      </table>
      <Accordion
        header={i`Wish marketplace areas`}
        isOpen={marketplaceAccordionIsOpen}
        chevronSize={12}
        headerPadding="10px 15px 10px 5px"
        onOpenToggled={(isOpen) => setMarketplaceAccordionIsOpen(isOpen)}
      >
        <USMarketplaceTable
          marketplaceStates={marketplaceStates}
          marketplaceMunicipalities={usMarketplaceMunicipalities}
        />
      </Accordion>
      <Accordion
        header={i`Non-taxable areas`}
        isOpen={nonTaxableAccordionIsOpen}
        chevronSize={12}
        headerPadding="10px 15px 10px 5px"
        onOpenToggled={(isOpen) => setNonTaxableAccordionIsOpen(isOpen)}
      >
        <div className={css(styles.usContent)}>
          <Text weight="regular" className={css(styles.description)}>
            The following states in the United States do not have state-wide
            sales taxes.
          </Text>
          <USNomadStatesTable className={css(styles.extraTable)} />
        </div>
      </Accordion>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => editState.pushPrevious()} isRouterLink />

        <SecondaryButton
          disabled={
            editState.currentStates("US") == null ||
            editState.currentStates("US").length === 0
          }
          onClick={onContinueClicked}
        >
          Continue
        </SecondaryButton>
      </div>
    </div>
  );
};

export default observer(USSelectStates);

const useStylesheet = (numColumns: number) => {
  const { textBlack, textLight, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          transform: "translateZ(0)",
          backfaceWisibility: "hidden",
          perspective: 1000,
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
        },
        checkbox: {
          margin: 15,
        },
        column: {
          width: `${Math.round((1 / numColumns) * 100)}%`,
        },
        bottomSection: {
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        checkboxContent: {
          width: "25%",
        },
        checkboxTitle: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 14,
          color: textBlack,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginRight: 10,
        },
        extraTable: {
          border: `1px solid ${borderPrimary}`,
        },
        usContent: {
          padding: 24,
        },
        description: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          cursor: "default",
          paddingBottom: 16,
        },
      }),
    [textBlack, textLight, borderPrimary, numColumns]
  );
};
