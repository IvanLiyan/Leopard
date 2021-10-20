import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, CellInfo, Text, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { weightSemibold } from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import { UsTaxMarketplaceMunicipalities } from "@schema/types";

/* Toolkit */
import {
  AccountTypeDisplayNames,
  UsOtherDropdown,
  UsStateTaxInfo,
} from "@toolkit/tax/types-v2";

/* Merchant Components */
import ValidatedLabel from "./ValidatedLabel";

/* Merchant Stores */
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useTheme } from "@stores/ThemeStore";

export type PickedUSMarketplaceMunicipalities = Pick<
  UsTaxMarketplaceMunicipalities,
  "stateCode" | "cities" | "counties" | "districts"
>;

type Props = BaseProps & {
  readonly usTaxInfo: UsOtherDropdown;
};

const USTaxInfo: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    usTaxInfo: { accountType, accountValidation, statesInfo },
  } = props;

  const styles = useStylesheet();

  const { preferredProperLocale } = useLocalizationStore();

  return (
    <>
      <Table
        style={[className, style]}
        rowStyle={() => ({ minHeight: 68 })}
        hideBorder
      >
        <Table.FixtureColumn title={i`Your tax information`} width={135} />
        <Table.FixtureColumn />
        <Table.FixtureRow>
          <Table.FixtureCell style={styles.titleCell}>
            Account type
          </Table.FixtureCell>
          <Table.FixtureCell>
            <Layout.FlexRow style={[styles.accountTypeCell, styles.font]}>
              {AccountTypeDisplayNames[accountType || "COMPANY"]}
              <ValidatedLabel
                style={[styles.accountTypeLabel, styles.cell]}
                state={accountValidation}
              />
            </Layout.FlexRow>
          </Table.FixtureCell>
        </Table.FixtureRow>
      </Table>
      <Table
        style={[className, style]}
        rowStyle={() => ({ minHeight: 68 })}
        data={statesInfo}
        hideBorder
      >
        <Table.Column
          className={css(styles.font, styles.cell)}
          columnKey="code"
          title={i`US state`}
          width={345}
        >
          {({
            row: { code, subRegions },
          }: CellInfo<UsStateTaxInfo, UsStateTaxInfo>) => (
            <Layout.FlexColumn style={styles.stateContainer} key={code}>
              <Text>{getStateName("US", code)}</Text>
              {subRegions != null && subRegions.length > 0 && (
                <Text style={styles.cities}>{`(${subRegions.join(
                  ", ",
                )})`}</Text>
              )}
            </Layout.FlexColumn>
          )}
        </Table.Column>
        <Table.Column
          className={css(styles.font, styles.cell)}
          columnKey="taxId"
          title={i`Tax Identification Number (TIN)`}
          description={
            i`Tax Identity Number (TIN) is commonly used term in the USA ` +
            i`(“TIN”), but may also be found in foreign jurisdictions as ` +
            i`well (“foreign TIN”). From a USA perspective, A Taxpayer ` +
            i`Identification Number (TIN) is an identification number used ` +
            i`by the Internal Revenue Service (IRS) in the administration of ` +
            i`tax laws. A USA TIN must be furnished on returns, statements, ` +
            i`and other tax related documents.`
          }
        >
          {({ row: { taxId } }: CellInfo<UsStateTaxInfo, UsStateTaxInfo>) => (
            <Layout.FlexRow style={styles.font}>{taxId}</Layout.FlexRow>
          )}
        </Table.Column>
        <Table.Column
          className={css(styles.font, styles.cell)}
          columnKey="lastUpdated.unix"
          title={i`Last updated`}
          align="right"
        >
          {({
            row: { lastUpdated },
          }: CellInfo<UsStateTaxInfo, UsStateTaxInfo>) =>
            lastUpdated &&
            new Date(lastUpdated.unix * 1000).toLocaleDateString(
              preferredProperLocale,
            )
          }
        </Table.Column>
      </Table>
    </>
  );
};

export default observer(USTaxInfo);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        cell: {
          wordWrap: "break-word",
          overflow: "hidden",
          whiteSpace: "normal",
        },
        font: {
          fontSize: 14,
          color: textBlack,
        },
        accountTypeCell: {
          display: "flex",
        },
        accountTypeLabel: {
          marginLeft: 8,
        },
        titleCell: {
          fontWeight: weightSemibold,
          lineHeight: "24px",
          color: textBlack,
          padding: "0px 14px",
        },
        stateContainer: {
          paddingTop: 12,
          paddingBottom: 12,
        },
        cities: {
          marginTop: 8,
        },
      }),
    [textBlack],
  );
};
