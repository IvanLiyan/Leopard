/* eslint-disable local-rules/no-pageParams */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { CheckboxField } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { ThemeContext } from "@merchant/stores/ThemeStore";

/* Merchant API */
import * as taxApi from "@merchant/api/tax";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import TaxStore from "@merchant/stores/TaxStore";
import { OnCloseFn } from "@merchant/component/core/modal/Modal";
import { AuthorityLevel, HomeRuleAuthority } from "@merchant/api/tax";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

export type USHomeRuleSelectionProps = BaseProps & {
  readonly stateCode: string;
  readonly onClose?: OnCloseFn;
  readonly editState: TaxEnrollmentV2State;
};

type SelectionTableProps = BaseProps & {
  readonly stateCode: string;
  readonly data: ReadonlyArray<HomeRuleAuthority>;
  readonly authorityLevel: AuthorityLevel;
  readonly editState: TaxEnrollmentV2State;
};

@observer
class SelectionTable extends Component<SelectionTableProps> {
  @computed
  get taxStore(): TaxStore {
    return AppStore.instance().taxStore;
  }

  @computed
  get numColumns(): number {
    const { dimenStore } = AppStore.instance();
    return dimenStore.isSmallScreen ? 2 : 3;
  }

  @computed
  get rows(): ReadonlyArray<ReadonlyArray<HomeRuleAuthority>> {
    const { data } = this.props;
    return _.chunk(
      _.sortBy(data, (_) => _.display_name),
      this.numColumns
    );
  }

  @computed
  get styles() {
    const { numColumns } = this;
    return StyleSheet.create({
      root: {
        display: "table",
      },
      table: {
        width: "100%",
        tableLayout: "fixed",
      },
      item: {
        width: `${Math.round((1 / numColumns) * 100)}%`,
      },
    });
  }

  renderRow(items: ReadonlyArray<HomeRuleAuthority>, rowIndex: number) {
    const {
      props: { stateCode, authorityLevel, editState },
    } = this;
    return (
      <tr key={`row-${rowIndex}`}>
        {items.map((item, columnIndex) => {
          const checked = editState.isLocalAuthoritySelected({
            stateCode,
            countryCode: "US",
            displayName: item.display_name,
            authorityLevel,
          });

          const marketplaceDescription =
            i`The associated transaction tax for this local ` +
            i`jurisdiction will be collected and remitted by Wish ` +
            i`as a marketplace.`;

          return (
            <td
              key={item.display_name}
              className={css(this.styles.item)}
              style={{
                paddingLeft: 25,
                paddingTop: 7,
                paddingBottom: 7,
              }}
            >
              <CheckboxField
                onChange={() =>
                  editState.setLocalAuthoritySelected(
                    {
                      stateCode,
                      countryCode: "US",
                      authorityLevel,
                      displayName: item.display_name,
                    },
                    !checked
                  )
                }
                disabled={!item.is_home_rule}
                description={
                  item.is_marketplace ? marketplaceDescription : undefined
                }
                checked={!item.is_marketplace && checked}
                title={item.display_name}
              />
            </td>
          );
        })}
      </tr>
    );
  }

  render() {
    const { className } = this.props;
    if (this.rows.length === 0) {
      return null;
    }

    return (
      <div className={css(this.styles.root, className)}>
        <table className={css(this.styles.table)}>
          <tbody>
            {this.rows.map((rowItems, index) =>
              this.renderRow(rowItems, index)
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

@observer
class USHomeRuleSelection extends Component<USHomeRuleSelectionProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @observable
  countiesExpanded = true;

  @observable
  citiesExpanded = false;

  @observable
  districtsExpanded = false;

  onSave = () => {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    }
  };

  @computed
  get taxStore(): TaxStore {
    return AppStore.instance().taxStore;
  }

  @computed
  get authoritiesRequest() {
    const { stateCode } = this.props;
    return taxApi.getAvailableHomeRuleAuthorities({
      state_code: stateCode,
      country_code: "US",
    });
  }

  @computed
  get cities(): ReadonlyArray<HomeRuleAuthority> {
    const cities = this.authoritiesRequest.response?.data?.cities;
    return cities || [];
  }

  @computed
  get counties(): ReadonlyArray<HomeRuleAuthority> {
    const counties = this.authoritiesRequest.response?.data?.counties;
    return counties || [];
  }

  @computed
  get districts(): ReadonlyArray<HomeRuleAuthority> {
    const districts = this.authoritiesRequest.response?.data?.districts;
    return districts || [];
  }

  @computed
  get cityIsSelected(): boolean {
    const {
      cities,
      props: { stateCode, editState },
    } = this;

    return cities.some((cityInfo) =>
      editState.isLocalAuthoritySelected({
        stateCode,
        countryCode: "US",
        authorityLevel: "CITY",
        displayName: cityInfo.display_name,
      })
    );
  }

  @computed
  get countyIsSelected(): boolean {
    const {
      counties,
      props: { stateCode, editState },
    } = this;

    return counties.some((countyInfo) =>
      editState.isLocalAuthoritySelected({
        stateCode,
        countryCode: "US",
        authorityLevel: "COUNTY",
        displayName: countyInfo.display_name,
      })
    );
  }

  @computed
  get districtIsSelected(): boolean {
    const {
      districts,
      props: { stateCode, editState },
    } = this;

    return districts.some((districtInfo) =>
      editState.isLocalAuthoritySelected({
        stateCode,
        countryCode: "US",
        authorityLevel: "DISTRICT",
        displayName: districtInfo.display_name,
      })
    );
  }

  @action
  toggleAllCitiesSelected = () => {
    const {
      props: { stateCode, editState },
    } = this;
    const enableAllCities = !this.cityIsSelected;

    for (const cityInfo of this.cities) {
      if (!cityInfo.is_home_rule) {
        continue;
      }
      editState.setLocalAuthoritySelected(
        {
          stateCode,
          countryCode: "US",
          authorityLevel: "CITY",
          displayName: cityInfo.display_name,
        },
        enableAllCities
      );
    }

    if (enableAllCities) {
      this.citiesExpanded = true;
    }
  };

  @action
  toggleAllCountiesSelected = () => {
    const {
      props: { stateCode, editState },
    } = this;
    const enableAllCounties = !this.countyIsSelected;

    for (const countyInfo of this.counties) {
      if (!countyInfo.is_home_rule) {
        continue;
      }
      editState.setLocalAuthoritySelected(
        {
          stateCode,
          countryCode: "US",
          authorityLevel: "COUNTY",
          displayName: countyInfo.display_name,
        },
        enableAllCounties
      );
    }

    if (enableAllCounties) {
      this.countiesExpanded = true;
    }
  };

  @action
  toggleAllDistrictsSelected = () => {
    const {
      props: { stateCode, editState },
    } = this;
    const enableAllDistrics = !this.districtIsSelected;

    for (const districtInfo of this.districts) {
      if (!districtInfo.is_home_rule) {
        continue;
      }
      editState.setLocalAuthoritySelected(
        {
          stateCode,
          countryCode: "US",
          authorityLevel: "DISTRICT",
          displayName: districtInfo.display_name,
        },
        enableAllDistrics
      );
    }

    if (enableAllDistrics) {
      this.districtsExpanded = true;
    }
  };

  @computed
  get styles() {
    const { primary, textBlack } = this.context;

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingBottom: 25,
      },
      description: {
        padding: "25px 25px",
        cursor: "default",
        fontSize: 15,
        fontWeight: fonts.weightNormal,
        lineHeight: 1.5,
        color: textBlack,
      },
      sectionHeaderContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      sectionHeader: {
        fontSize: 14,
        fontWeight: fonts.weightBold,
        lineHeight: 1.4,
        color: textBlack,
        cursor: "default",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      sections: {
        display: "flex",
        flexDirection: "column",
      },
      table: {
        padding: "5px 0px",
      },
      link: {
        color: primary,
        fontWeight: fonts.weightNormal,
        marginTop: 3,
        marginLeft: 11,
        fontSize: 14,
        cursor: "pointer",
        userSelect: "none",
        lineHeight: 1.4,
      },
    });
  }

  renderSectionHeader = (title: string, onSelectAllToggled: () => unknown) => {
    return (
      <div className={css(this.styles.sectionHeaderContainer)}>
        <section className={css(this.styles.sectionHeader)}>{title}</section>
        <div className={css(this.styles.link)} onClick={onSelectAllToggled}>
          Select all
        </div>
      </div>
    );
  };

  renderCountiesSection() {
    const { stateCode, editState } = this.props;
    if (this.counties.length === 0) {
      return null;
    }

    return (
      <Accordion
        header={() => (
          <div className={css(this.styles.sectionHeaderContainer)}>
            <section className={css(this.styles.sectionHeader)}>
              Counties
            </section>
            <div
              className={css(this.styles.link)}
              onClick={this.toggleAllCountiesSelected}
            >
              {this.countyIsSelected ? i`Deselect all` : i`Select all`}
            </div>
          </div>
        )}
        isOpen={this.countiesExpanded}
        chevronSize={13}
        onOpenToggled={(isOpen) => (this.countiesExpanded = isOpen)}
      >
        <SelectionTable
          stateCode={stateCode}
          data={this.counties}
          className={css(this.styles.table)}
          authorityLevel="COUNTY"
          editState={editState}
        />
      </Accordion>
    );
  }

  renderCitiesSection() {
    const { stateCode, editState } = this.props;
    if (this.cities.length === 0) {
      return null;
    }

    return (
      <Accordion
        header={() => (
          <div className={css(this.styles.sectionHeaderContainer)}>
            <section className={css(this.styles.sectionHeader)}>Cities</section>
            <div
              className={css(this.styles.link)}
              onClick={this.toggleAllCitiesSelected}
            >
              {this.cityIsSelected ? i`Deselect all` : i`Select all`}
            </div>
          </div>
        )}
        isOpen={this.citiesExpanded}
        chevronSize={13}
        onOpenToggled={(isOpen) => (this.citiesExpanded = isOpen)}
      >
        <SelectionTable
          stateCode={stateCode}
          data={this.cities}
          className={css(this.styles.table)}
          authorityLevel="CITY"
          editState={editState}
        />
      </Accordion>
    );
  }

  renderDistrictsSection() {
    const { stateCode, editState } = this.props;
    if (this.districts.length === 0) {
      return null;
    }

    return (
      <Accordion
        header={() => (
          <div className={css(this.styles.sectionHeaderContainer)}>
            <section className={css(this.styles.sectionHeader)}>
              Districts
            </section>
            <div
              className={css(this.styles.link)}
              onClick={this.toggleAllDistrictsSelected}
            >
              {this.districtIsSelected ? i`Deselect all` : i`Select all`}
            </div>
          </div>
        )}
        isOpen={this.districtsExpanded}
        chevronSize={13}
        onOpenToggled={(isOpen) => (this.districtsExpanded = isOpen)}
      >
        <SelectionTable
          stateCode={stateCode}
          data={this.districts}
          className={css(this.styles.table)}
          authorityLevel="DISTRICT"
          editState={editState}
        />
      </Accordion>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <LoadingIndicator
        loadingComplete={this.authoritiesRequest.response != null}
      >
        <div className={css(this.styles.root, className)}>
          <section className={css(this.styles.description)}>
            Select counties, cities, and districts to indicate where you have
            Nexus.
          </section>
          <div className={css(this.styles.sections)}>
            {this.renderCountiesSection()}
            {this.renderCitiesSection()}
            {this.renderDistrictsSection()}
          </div>
        </div>
      </LoadingIndicator>
    );
  }
}

export default class USHomeRuleSelectionModal extends Modal {
  constructor(props: USHomeRuleSelectionProps) {
    const { stateCode } = props;

    super((onClose: OnCloseFn) => (
      <USHomeRuleSelection {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Edit Nexus for ${getStateName("US", stateCode)}`,
    });

    this.setRenderFooter(() => (
      <ModalFooter
        cancel={{
          children: i`Close`,
          onClick: () => this.close(),
        }}
      />
    ));

    this.setWidthPercentage(0.9);
    this.setTopPercentage(0.03);
  }
}
