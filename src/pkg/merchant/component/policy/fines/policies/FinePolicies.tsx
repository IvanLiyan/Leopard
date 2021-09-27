import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";

/* Relative Imports */
import FinePolicyTable from "./FinePolicyTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

@observer
export default class FinePolicies extends Component<BaseProps> {
  @observable
  expandedRows: ObservableSet = new ObservableSet();

  @computed
  get expandedRowsIndeces(): ReadonlyArray<number> {
    const { expandedRows } = this;
    return expandedRows.toArray().map((row) => parseInt(row));
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
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
    });
  }

  render() {
    const { className, style } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        <FinePolicyTable
          expandedRows={this.expandedRowsIndeces}
          onRowExpandToggled={this.onRowExpandToggled}
        />
      </div>
    );
  }
}
