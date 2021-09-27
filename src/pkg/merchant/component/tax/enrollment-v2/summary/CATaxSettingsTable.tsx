import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import states, { getStateName } from "@ContextLogic/lego/toolkit/states";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import TaxStore from "@merchant/stores/TaxStore";
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import { ThemeContext } from "@merchant/stores/ThemeStore";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

export type CATaxSettingsTableProps = BaseProps & {
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly editState: TaxEnrollmentV2State;
};

type DataRow = {
  readonly provinceCode: string;
  readonly provinceName: string;
  readonly taxSystem?: string | null | undefined;
  readonly taxNumber?: string | null | undefined;
  readonly lastUpdated: number | undefined;
};

@observer
export default class CATaxSettingsTable extends Component<
  CATaxSettingsTableProps
> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @computed
  get taxStore(): TaxStore {
    return TaxStore.instance();
  }

  @computed
  get gstInfo(): CommerceMerchantTaxInfo {
    const { taxInfos } = this.props;
    const countryTaxInfos = taxInfos.filter(
      (info) => info.authorityLevel === "COUNTRY"
    );

    return countryTaxInfos[0];
  }

  get data(): ReadonlyArray<DataRow> {
    const {
      props: { taxInfos, editState },
      taxStore,
      gstInfo,
    } = this;
    const { taxConstantsCA } = editState;

    let rows: Array<DataRow> = taxInfos
      .filter((info) => info.authorityLevel === "STATE")
      .map(
        (info): DataRow => ({
          provinceName: getStateName("CA", info.stateCode),
          provinceCode: info.stateCode || "",
          taxNumber: info.taxNumber,
          taxSystem: taxStore.getTaxNumberName({
            countryCode: "CA",
            stateCode: info.stateCode,
            taxConstants: taxConstantsCA,
          }),
          lastUpdated: info.lastUpdated,
        })
      );

    // Add remaining provinces
    const currentProvinces = new Set(rows.map((row) => row.provinceCode));
    const remainingProvinces = Object.keys(states.CA).filter(
      (provinceCode) => !currentProvinces.has(provinceCode)
    );

    const remainingRows = remainingProvinces.map((provinceCode) => {
      return {
        provinceCode,
        provinceName: getStateName("CA", provinceCode),
        lastUpdated: gstInfo.lastUpdated,
      };
    });

    rows = [...rows, ...remainingRows];
    return _.sortBy(rows, (info) => info.provinceName);
  }

  @computed
  get styles() {
    const {
      surfaceLightest,
      borderPrimary,
      textBlack,
      surfaceLight,
    } = this.context;
    return StyleSheet.create({
      root: {
        border: `1px solid ${borderPrimary}`,
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
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
      gstInfoNumber: {
        fontSize: 14,
        marginRight: 20,
        fontWeight: fonts.weightSemibold,
      },
      gstInfoTitle: {
        cursor: "default",
        marginRight: 6,
        fontWeight: fonts.weightBold,
        color: textBlack,
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
    });
  }

  renderGSTInfo() {
    const { gstInfo } = this;
    if (gstInfo == null) {
      return null;
    }

    return (
      <div className={css(this.styles.gstInfo)}>
        <section className={css(this.styles.gstTitleContainer)}>
          <div className={css(this.styles.gstInfoTitle)}>
            GST/HST Account Number
          </div>
          <Info
            text={
              i`This GST/HST account number applies to all ` +
              i`provinces/territories. If a provincial tax number has been ` +
              i`provided for a given province/territory, it will be ` +
              i`displayed in the Tax & Account Number columns below.`
            }
            position="top center"
            popoverMaxWidth={250}
          />
        </section>
        <div className={css(this.styles.gstInfoContent)}>
          <CopyButton
            className={css(this.styles.gstInfoNumber)}
            text={gstInfo.taxNumber}
            copyOnBodyClick
          >
            {gstInfo.taxNumber}
          </CopyButton>
        </div>
      </div>
    );
  }

  render() {
    const { taxStore } = this;
    const { className, editState } = this.props;
    const { taxConstantsCA } = editState;
    return (
      <div className={css(this.styles.root, className)}>
        {this.renderGSTInfo()}
        <Table data={this.data} hideBorder>
          <Table.Column
            columnKey="provinceName"
            title={i`Provinces & territories`}
            width={280}
          />

          <Table.Column columnKey="taxSystem" title={i`Tax`} noDataMessage="">
            {({ row }) => (
              <div className={css(this.styles.taxNameCell)}>
                <div>{row.taxSystem}</div>
                {row.taxSystem && (
                  <Info
                    popoverContent={taxStore.getTaxDescription({
                      countryCode: "CA",
                      stateCode: row.provinceCode,
                      taxConstants: taxConstantsCA,
                    })}
                    className={css(this.styles.info)}
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
        </Table>
      </div>
    );
  }
}
