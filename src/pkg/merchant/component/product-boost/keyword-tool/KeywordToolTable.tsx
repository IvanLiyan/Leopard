import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SortOrder } from "@ContextLogic/lego";

export type KeywordToolTableSortByProps = {
  readonly keyword: SortOrder;
  readonly reach: SortOrder;
  readonly competition: SortOrder;
  readonly suggestedBid: SortOrder;
};

export type KeywordToolTableProps = BaseProps & {
  readonly data: { results: { rows: ReadonlyArray<unknown> } };
  readonly type: string;
  readonly sortBy: KeywordToolTableSortByProps;
  readonly onReachSortToggled?: () => unknown;
  readonly onCompetitionSortToggled?: () => unknown;
};

@observer
class KeywordToolTable extends Component<KeywordToolTableProps> {
  static defaultProps = {
    data: [],
  };

  @computed
  get tableRows() {
    const { data } = this.props;
    // Check if data is from list_keywords API
    if ("results" in data) {
      return [...data.results.rows];
      // Check if data is from multi_get_keywords API
    }

    return Object.values(data);
  }

  @computed
  get styles() {
    return StyleSheet.create({});
  }

  renderReachColumn() {
    const { onReachSortToggled, sortBy, type } = this.props;
    if (type === "search") {
      return (
        <Table.Column
          title={i`Estimated Potential Reach`}
          columnKey="reach_text"
          align="left"
          width={300}
          noDataMessage={""}
          description={i`Estimate of how many times this keyword will be searched`}
        />
      );
    }
    return (
      <Table.Column
        title={i`Estimated Potential Reach`}
        columnKey="reach_text"
        align="center"
        width={300}
        noDataMessage={""}
        description={i`Estimate of how many times this keyword will be searched`}
        sortOrder={sortBy.reach}
        onSortToggled={onReachSortToggled}
      />
    );
  }

  renderCompetitionColumn() {
    const { onCompetitionSortToggled, sortBy, type } = this.props;
    if (type === "search") {
      return (
        <Table.Column
          title={i`Estimated Competition`}
          columnKey="competition_text"
          align="left"
          width={300}
          noDataMessage={""}
          description={
            i`Estimate of how many other ` +
            i`merchants are bidding this keyword`
          }
        />
      );
    }
    return (
      <Table.Column
        title={i`Estimated Competition`}
        columnKey="competition_text"
        align="center"
        width={300}
        noDataMessage={""}
        description={i`Estimate of how many other merchants are bidding this keyword`}
        sortOrder={sortBy.competition}
        onSortToggled={onCompetitionSortToggled}
      />
    );
  }

  render() {
    const { className } = this.props;
    return (
      <Table
        className={css(className)}
        data={this.tableRows}
        noDataMessage={i`No Records Found`}
        maxVisibleColumns={20}
      >
        <Table.Column
          title={i`Keyword`}
          columnKey="keyword"
          align="left"
          width={250}
          noDataMessage={""}
        />
        {this.renderReachColumn()}
        {this.renderCompetitionColumn()}
      </Table>
    );
  }
}
export default KeywordToolTable;
