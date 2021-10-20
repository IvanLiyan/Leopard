import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info, Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useTheme } from "@stores/ThemeStore";

/* Merchant Components */
import CATaxInfo from "./CATaxInfo";

/* Toolkit */
import { CaDropdown } from "@toolkit/tax/types-v2";
import { getStateName, states } from "@ContextLogic/lego/toolkit/states";

export type CATableProps = BaseProps & {
  readonly info: CaDropdown;
};

type DataRow = {
  readonly provinceCode: string;
  readonly provinceName: string;
  readonly taxSystem?: string | null | undefined;
  readonly taxNumber?: string | null | undefined;
  readonly lastUpdated: number | undefined;
};

const CATable: React.FC<CATableProps> = ({
  className,
  style,
  info: {
    accountType,
    accountValidation,
    gstAccountNumber,
    lastUpdated: { unix: lastUpdated },
    provinceNumbers,
  },
}: CATableProps) => {
  const styles = useStylesheet();
  const taxStore = useTaxStore();

  const data = useMemo((): ReadonlyArray<DataRow> => {
    return Object.keys(states.CA)
      .sort((a, b) => (getStateName("CA", a) < getStateName("CA", b) ? -1 : 1))
      .map((code) => ({
        provinceName: getStateName("CA", code),
        provinceCode: code || "",
        taxNumber: provinceNumbers[code],
        taxSystem: taxStore.getTaxNumberName({
          countryCode: "CA",
          stateCode: code,
        }),
        lastUpdated,
      }));
  }, [provinceNumbers, lastUpdated, taxStore]);

  return (
    <div className={css(styles.root, className, style)}>
      <CATaxInfo
        gstNumber={gstAccountNumber}
        accountValidation={accountValidation}
        accountType={accountType}
        className={css(styles.taxInfo)}
      />
      <Table data={data} hideBorder>
        <Table.Column
          columnKey="provinceName"
          title={i`Provinces & territories`}
          width={210}
        />

        <Table.Column columnKey="taxSystem" title={i`Tax`} noDataMessage="">
          {({ row }) => (
            <div className={css(styles.taxNameCell)}>
              <div>{row.taxSystem}</div>
              {row.taxSystem && (
                <Info
                  popoverContent={taxStore.getTaxDescription({
                    countryCode: "CA",
                    stateCode: row.provinceCode,
                  })}
                  className={css(styles.info)}
                />
              )}
            </div>
          )}
        </Table.Column>

        <Table.Column
          columnKey="taxNumber"
          title={i`Account number`}
          minWidth="15%"
          canCopyText
          noDataMessage=""
        />

        <Table.DatetimeColumn
          columnKey="lastUpdated"
          title={i`Last updated`}
          format="MM/DD/YYYY"
        />
      </Table>
    </div>
  );
};

export default observer(CATable);

const useStylesheet = () => {
  const { surfaceLight, surfaceLightest, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        taxInfo: {
          borderBottom: `1px solid ${borderPrimary}`,
        },
        gstInfo: {
          minWidth: 112,
          backgroundColor: surfaceLightest,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        gstInfoContent: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: 20,
        },
        gstTitleContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          padding: "15px 50px 15px 25px",
          borderRight: `1px solid ${surfaceLight}`,
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
    [surfaceLight, surfaceLightest, borderPrimary],
  );
};
