/*
 * CASelectProvinces.tsx
 *
 * Created by Jonah Dlin on Mon Nov 30 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import {
  Info,
  BackButton,
  CheckboxField,
  PrimaryButton,
  Text,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import states, { getStateName } from "@ContextLogic/lego/toolkit/states";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

type CASelectProvincesProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

type StateInfo = {
  readonly stateCode: string;
  readonly stateName: string;
};

const CASelectProvinces: React.FC<CASelectProvincesProps> = ({
  className,
  style,
  editState,
}: CASelectProvincesProps) => {
  const taxStore = useTaxStore();
  const { isSmallScreen } = useDimenStore();
  const routeStore = useRouteStore();

  const { pushPrevious, setStateSelected, taxConstantsCA } = editState;

  const numColumns = useMemo((): number => (isSmallScreen ? 2 : 4), [
    isSmallScreen,
  ]);

  const styles = useStylesheet({ numColumns });

  const { pstAndQstCaProvinceCodes, mpfCaProvinceCodes } = taxConstantsCA;

  const data = useMemo((): ReadonlyArray<StateInfo> => {
    const stateInfos: ReadonlyArray<StateInfo> = Object.keys(states.CA).map(
      (stateCode) => ({
        stateCode,
        stateName: getStateName("CA", stateCode),
      })
    );

    return _.sortBy(stateInfos, (_) => _.stateName);
  }, []);

  const rows = useMemo((): ReadonlyArray<ReadonlyArray<StateInfo>> => {
    return _.chunk([...data], numColumns);
  }, [data, numColumns]);

  const handleSetStateSelected = (stateCode: string, selected: boolean) => {
    setStateSelected({
      countryCode: "CA",
      stateCode,
      selected,
    });
  };

  const renderRow = (states: ReadonlyArray<StateInfo>, rowIndex: number) => {
    return (
      <tr key={`row-${rowIndex}`}>
        {states.map((stateInfo: StateInfo) => {
          const { stateCode, stateName } = stateInfo;
          const isPSTorQSTProvince = pstAndQstCaProvinceCodes.includes(
            stateCode
          );
          const isMPFProvince = mpfCaProvinceCodes.includes(stateCode);
          const checked = editState.currentStates("CA").includes(stateCode);

          return (
            <td key={stateName} className={css(styles.column)}>
              <CheckboxField
                className={css(styles.checkbox)}
                onChange={(selected) =>
                  handleSetStateSelected(stateCode, selected)
                }
                checked={checked}
                disabled={!isPSTorQSTProvince}
              >
                <div className={css(styles.checkboxContent)}>
                  <div className={css(styles.checkboxTitle)}>{stateName}</div>

                  {(isPSTorQSTProvince || isMPFProvince) && (
                    <Info
                      popoverContent={taxStore.getTaxDescription({
                        countryCode: "CA",
                        stateCode,
                        taxConstants: taxConstantsCA,
                      })}
                      className={css(styles.info)}
                    />
                  )}
                </div>
              </CheckboxField>
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
            Tax for Canada
          </Text>
        </div>
        <Text weight="medium" className={css(styles.stepsText)}>
          1 of 2
        </Text>
      </div>
      <table className={css(styles.table)}>
        <tbody>{rows.map((rows, index) => renderRow(rows, index))}</tbody>
      </table>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => pushPrevious()} isRouterLink />

        <PrimaryButton
          onClick={() => routeStore.push("/tax/v2-enroll/CA/provide-numbers")}
          isReactRouterLink
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(CASelectProvinces);

const useStylesheet = ({ numColumns }: { numColumns: number }) => {
  const { textBlack, textDark, textLight, borderPrimary } = useTheme();
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
        },
        checkbox: {
          margin: "15px 15px 15px 15px",
        },
        column: {
          width: `${Math.round((1 / numColumns) * 100)}%`,
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        checkboxContent: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        checkboxTitle: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 14,
          color: textDark,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        info: {
          marginLeft: 3,
        },
      }),
    [numColumns, textBlack, textDark, borderPrimary, textLight]
  );
};
