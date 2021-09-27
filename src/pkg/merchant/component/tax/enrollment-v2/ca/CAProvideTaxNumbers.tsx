/*
 * CAProvideTaxNumbers.tsx
 *
 * Created by Jonah Dlin on Mon Nov 30 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import {
  Info,
  TextInput,
  BackButton,
  HorizontalField,
  Table,
  PrimaryButton,
  TableCell,
  Text,
  OnTextChangeEvent,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { TaxNumberValidator } from "@toolkit/validators";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

type CAProvideTaxNumbersProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

type StateInfo = {
  readonly stateCode: string;
  readonly stateName: string;
  readonly taxInfo: CommerceMerchantTaxInfo;
};

const DebugProvincialNumbers = {
  BC: "R123456",
  QC: "1234567890TQ1234",
  SK: "1234567",
  MB: "123456789MT",
};

const CAProvideTaxNumbers: React.FC<CAProvideTaxNumbersProps> = ({
  className,
  style,
  editState,
}: CAProvideTaxNumbersProps) => {
  const styles = useStylesheet();
  const taxStore = useTaxStore();
  const toastStore = useToastStore();
  const routeStore = useRouteStore();

  const [gstNumberValidator] = useState(
    new TaxNumberValidator({ countryCode: "CA" })
  );

  const {
    currentStates,
    pendingTaxInfos,
    getCountryLevelSettings,
    pushNext,
    taxConstantsCA,
  } = editState;

  const { pstAndQstCaProvinceCodes } = taxConstantsCA;

  const data = useMemo((): ReadonlyArray<StateInfo> => {
    const stateInfos: ReadonlyArray<StateInfo> = currentStates("CA")
      .filter((stateCode) => pstAndQstCaProvinceCodes.includes(stateCode))
      .map((stateCode) => {
        const taxInfos: ReadonlyArray<CommerceMerchantTaxInfo> = pendingTaxInfos.filter(
          (info) =>
            info.countryCode === "CA" &&
            info.stateCode === stateCode &&
            info.authorityLevel === "STATE"
        );
        return {
          stateCode,
          stateName: getStateName("CA", stateCode),
          taxInfo: taxInfos[0],
        };
      });

    return _.sortBy(stateInfos, (info) => info.stateName);
  }, [currentStates, pendingTaxInfos, pstAndQstCaProvinceCodes]);

  const countryLevelInfo = useMemo(():
    | CommerceMerchantTaxInfo
    | null
    | undefined => {
    return getCountryLevelSettings("CA");
  }, [getCountryLevelSettings]);

  const onContinueClicked = () => {
    if (countryLevelInfo == null) {
      return;
    }

    const hasInvalidNumbers =
      countryLevelInfo.numberIsInvalid ||
      data.some(({ taxInfo }) => taxInfo.numberIsInvalid);

    if (hasInvalidNumbers) {
      toastStore.error(i`Please provide valid account numbers`, {
        timeoutMs: 5000,
      });
      return;
    }

    pushNext();
  };

  const renderTextInput = (info: CommerceMerchantTaxInfo) => {
    const { stateCode } = info;
    const debugStateCode: keyof typeof DebugProvincialNumbers =
      stateCode && Object.keys(DebugProvincialNumbers).includes(stateCode)
        ? (stateCode as keyof typeof DebugProvincialNumbers)
        : "BC";

    return (
      <TextInput
        className={css(styles.provinceInput)}
        value={info.taxNumber}
        height={35}
        onChange={({ text }: OnTextChangeEvent) => {
          info.taxNumber = text;
        }}
        onValidityChanged={(isValid) => (info.numberIsInvalid = !isValid)}
        placeholder={taxStore.getTaxNumberName({
          countryCode: "CA",
          stateCode,
          taxConstants: taxConstantsCA,
        })}
        validators={[new TaxNumberValidator({ countryCode: "CA", stateCode })]}
        debugValue={stateCode && DebugProvincialNumbers[debugStateCode]}
      />
    );
  };

  const renderProvincialNumberEditTable = () => {
    if (data.length === 0) {
      return null;
    }

    return (
      <div className={css(styles.tableContainer)}>
        <Text weight="regular" className={css(styles.gstTitle)}>
          Select Canadian provinces and territories and provide provincial tax
          numbers for selected regions.
        </Text>
        <Table className={css(styles.table)} data={data} hideBorder>
          <Table.Column
            columnKey="stateName"
            title={i`Provinces & territories`}
          >
            {({
              row: { stateName, stateCode },
            }: TableCell<string, StateInfo>) => (
              <div className={css(styles.taxNameCell)}>
                <div>{stateName}</div>
                <Info
                  position="right center"
                  popoverContent={taxStore.getTaxDescription({
                    countryCode: "CA",
                    stateCode,
                    taxConstants: taxConstantsCA,
                  })}
                  className={css(styles.info)}
                />
              </div>
            )}
          </Table.Column>

          <Table.Column columnKey="taxInfo" title={i`Tax Account Number`}>
            {({ value }: TableCell<CommerceMerchantTaxInfo, StateInfo>) =>
              renderTextInput(value)
            }
          </Table.Column>
        </Table>
      </div>
    );
  };

  const renderGSTInfo = () => {
    if (countryLevelInfo == null) {
      return null;
    }

    return (
      <div className={css(styles.gstContainer)}>
        <Text weight="regular" className={css(styles.gstTitle)}>
          {data.length > 0
            ? i`Please provide your national and provincial account numbers.`
            : i`Please provide your national tax account number.`}
        </Text>
        <HorizontalField
          title={i`Goods and Services Tax (GST) or Harmonized Sales Tax (HST)`}
          className={css(styles.gstField)}
        >
          <TextInput
            className={css(styles.gstInput)}
            value={countryLevelInfo.taxNumber}
            height={35}
            onChange={({ text }: OnTextChangeEvent) => {
              countryLevelInfo.taxNumber = text;
            }}
            onValidityChanged={(isValid) =>
              (countryLevelInfo.numberIsInvalid = !isValid)
            }
            placeholder={i`GST/HST account number`}
            validators={[gstNumberValidator]}
            focusOnMount
            debugValue="123456789RT"
          />
        </HorizontalField>
      </div>
    );
  };

  if (countryLevelInfo == null) {
    return null;
  }

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.titleContainerInner)}>
          <Text weight="bold" className={css(styles.title)}>
            Tax for Canada
          </Text>
        </div>
        <Text weight="medium" className={css(styles.stepsText)}>
          2 of 2
        </Text>
      </div>

      <div className={css(styles.content)}>
        {renderGSTInfo()}
        {renderProvincialNumberEditTable()}
      </div>
      <div className={css(styles.bottomSection)}>
        <BackButton onClick={() => routeStore.push("/tax/v2-enroll/CA")} />

        <PrimaryButton onClick={onContinueClicked}>
          {editState.readyToSave ? i`Submit` : i`Continue`}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(CAProvideTaxNumbers);

const useStylesheet = () => {
  const { textLight, textBlack, borderPrimary } = useTheme();
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
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
        tableContainer: {
          display: "flex",
          flexDirection: "column",
        },
        bottomSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        content: {
          padding: "25px 25px",
          display: "flex",
          flexDirection: "column",
        },
        gstContainer: {
          display: "flex",
          flexDirection: "column",
        },
        gstTitle: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          marginBottom: 15,
        },
        gstField: {
          marginBottom: 25,
        },
        gstInput: {
          "@media (min-width: 900px)": {
            maxWidth: 300,
          },
        },
        provinceInput: {
          // eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 320,
        },
        taxNameCell: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        info: {
          marginLeft: 3,
        },
      }),
    [textLight, textBlack, borderPrimary]
  );
};
