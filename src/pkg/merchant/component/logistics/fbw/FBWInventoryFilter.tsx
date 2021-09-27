/* eslint-disable local-rules/unwrapped-i18n */

import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed } from "mobx";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { params_DEPRECATED, DEPRECATED_QueryParamState } from "@toolkit/url";

import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";

export class FBWInventoryQueryState extends DEPRECATED_QueryParamState {
  @params_DEPRECATED.array("warehouses")
  warehouses: ReadonlyArray<string> = [];
}

type BaseProps = any;

type FBWInventoryFilterProps = BaseProps & {
  readonly warehouseFilters: ReadonlyArray<unknown>;
  readonly queryState: FBWInventoryQueryState;
};

@observer
class FBWInventoryFilter extends Component<FBWInventoryFilterProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "20px 20px 0px 20px",
      },
      body: {
        padding: "0px 20px",
      },
      title: {
        color: palettes.textColors.Ink,
        fontSize: 20,
        height: 28,
        cursor: "default",
        userSelect: "none",
        alignSelf: "center",
        textAlign: "center",
      },
      filter: {
        paddingBottom: 16,
        marginTop: 16,
      },
    });
  }

  @computed
  get selectedWarehouseFilters() {
    const { warehouseFilters } = this.props;
    // if you find this please fix the any types (legacy)
    return warehouseFilters.sort((a: any, b: any) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }

  @action
  onWarehouseFilterToggled = ({ value }: OptionType<number>) => {
    const { queryState } = this.props;
    const typeSet = new Set(queryState.warehouses);

    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }
    queryState.warehouses = Array.from(typeSet);
  };

  @action
  onFiltersDeselected = () => {
    const { queryState } = this.props;
    queryState.warehouses = [];
  };

  render() {
    const { queryState, className, warehouseFilters } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.header)}>
          <section className={css(this.styles.title)}>All Filters</section>
          {queryState.hasActiveFilters && (
            <Button
              onClick={() => this.onFiltersDeselected()}
              disabled={false}
              hideBorder
              style={{
                padding: "7px 0px",
                color: palettes.textColors.DarkInk,
              }}
            >
              Deselect all
            </Button>
          )}
        </div>
        <div className={css(this.styles.body)}>
          <CheckboxGroupField
            className={css(this.styles.filter)}
            title={i`Warehouses`}
            options={warehouseFilters}
            onChecked={this.onWarehouseFilterToggled}
            selected={queryState.warehouses}
          />
        </div>
      </div>
    );
  }
}

export default FBWInventoryFilter;
