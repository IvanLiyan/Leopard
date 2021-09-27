import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";

/* Merchant Components */
import HomeRuleStateSettings from "@merchant/component/tax/HomeRuleStateSettings";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import TaxStore from "@merchant/stores/TaxStore";
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type USTaxSettingsTableProps = BaseProps & {
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly showLastUpdated?: boolean;
};

type DataRow = {
  readonly stateName: string;
  readonly stateCode: string;
  readonly isStateLevel: boolean;
  readonly taxNumber?: string | null | undefined;
  readonly lastUpdated: number;
};

@observer
class USTaxSettingsTable extends Component<USTaxSettingsTableProps> {
  static defaultProps = {
    showLastUpdated: true,
  };

  @observable
  expandedRows: ObservableSet = new ObservableSet();

  @computed
  get taxStore(): TaxStore {
    return AppStore.instance().taxStore;
  }

  @computed
  get expandedRowIndeces(): ReadonlyArray<number> {
    const { expandedRows } = this;
    return expandedRows.toArray().map((row) => parseInt(row));
  }

  @computed
  get currentStates(): ReadonlyArray<string> {
    const { taxInfos } = this.props;

    const stateCodes: ReadonlyArray<string> = taxInfos
      .filter((info) => info.countryCode === "US" && info.stateCode != null)
      .map((info) => info.stateCode || "");

    return Array.from(new Set(stateCodes));
  }

  @computed
  get data(): ReadonlyArray<DataRow> {
    const {
      props: { taxInfos },
    } = this;
    const rows = this.currentStates.map((stateCode) => {
      const stateTaxInfos = taxInfos.filter(
        (info) => info.stateCode === stateCode
      );

      const isStateLevel = stateTaxInfos.every(
        (info) => info.authorityLevel === "STATE"
      );

      const stateTaxInfosWithNumber = stateTaxInfos.filter(
        (info) => info.taxNumber != null
      );
      let taxNumber: string | null | undefined = null;
      if (stateTaxInfosWithNumber.length > 0) {
        taxNumber = stateTaxInfosWithNumber[0].taxNumber;
      }

      const lastUpdated = Math.max(
        ...stateTaxInfos.map((info) =>
          info.lastUpdated == null ? -1 : info.lastUpdated
        )
      );
      return {
        stateCode,
        taxNumber,
        isStateLevel,

        stateName: getStateName("US", stateCode),
        lastUpdated,
      };
    });

    return _.sortBy(rows, (info) => info.stateName);
  }

  @action
  onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      this.expandedRows.add(index.toString());
    } else {
      this.expandedRows.remove(index.toString());
    }
  };

  @computed
  get fienInfo(): CommerceMerchantTaxInfo | null | undefined {
    const { taxInfos } = this.props;
    const countryTaxInfos = taxInfos.filter(
      (info) => info.authorityLevel === "COUNTRY"
    );

    if (countryTaxInfos.length === 0) {
      return null;
    }

    return countryTaxInfos[0];
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        border: `1px solid ${palettes.greyScaleColors.Grey}`,
        borderRadius: 4,
      },
      rowExpansion: {
        backgroundColor: "rgba(238, 242, 245, 0.5)",
      },
      authorityGroup: {
        padding: "20px 0px",
        margin: "0px 30px",
        ":not(:last-child)": {
          borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
        },
      },
      fienInfo: {
        minWidth: 112,
        backgroundColor: palettes.textColors.White,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      fienInfoTitle: {
        cursor: "default",
        fontWeight: fonts.weightBold,
        color: palettes.textColors.Ink,
        padding: "15px 50px 15px 25px",
        borderRight: `1px solid ${palettes.greyScaleColors.LightGrey}`,
      },
      fienInfoContent: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 20,
      },
      fienInfoNumber: {
        fontSize: 14,
        marginRight: 20,
        fontWeight: fonts.weightSemibold,
      },
    });
  }

  renderStateAuthorities = ({ stateCode }: DataRow) => {
    const { taxInfos } = this.props;

    return (
      <div className={css(this.styles.rowExpansion)}>
        <HomeRuleStateSettings
          title={i`Counties`}
          stateCode={stateCode}
          countryCode="US"
          authorityLevel="COUNTY"
          taxInfos={taxInfos.filter(
            (info) =>
              info.authorityLevel === "COUNTY" && info.stateCode == stateCode
          )}
          className={css(this.styles.authorityGroup)}
        />
        <HomeRuleStateSettings
          title={i`Cities`}
          stateCode={stateCode}
          countryCode="US"
          authorityLevel="CITY"
          taxInfos={taxInfos.filter(
            (info) =>
              info.authorityLevel === "CITY" && info.stateCode == stateCode
          )}
          className={css(this.styles.authorityGroup)}
        />
        <HomeRuleStateSettings
          title={i`Districts`}
          stateCode={stateCode}
          countryCode="US"
          authorityLevel="DISTRICT"
          taxInfos={taxInfos.filter(
            (info) =>
              info.authorityLevel === "DISTRICT" && info.stateCode == stateCode
          )}
          className={css(this.styles.authorityGroup)}
        />
      </div>
    );
  };

  render() {
    const { showLastUpdated, className } = this.props;

    return (
      <div className={css(this.styles.root, className)}>
        <Table
          className={css(this.styles.root, className)}
          data={this.data}
          rowExpands={(row) => !row.isStateLevel}
          expandedRows={this.expandedRowIndeces}
          renderExpanded={this.renderStateAuthorities}
          onRowExpandToggled={this.onRowExpandToggled}
          hideBorder
        >
          <Table.Column columnKey="stateName" title={i`US State`} width="25%" />

          <Table.Column
            columnKey="taxNumber"
            title={this.taxStore.getTaxNumberName({ countryCode: "US" })}
            minWidth="10%"
            canCopyText
            noDataMessage=""
            description={this.taxStore.getTaxDescription({ countryCode: "US" })}
          />

          {showLastUpdated && (
            <Table.DatetimeColumn
              columnKey="lastUpdated"
              title={i`Last updated`}
              format="MM/DD/YYYY"
            />
          )}
        </Table>
      </div>
    );
  }
}
export default USTaxSettingsTable;
