import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { WelcomeHeaderProps } from "@merchant/component/core";

export type StatsColumnItem = {
  readonly columnTitle: string;
  readonly columnStats: string;
  readonly popoverContent?: (string | (() => ReactNode)) | null | undefined;
};

type ProductBoostHeaderProps = WelcomeHeaderProps & {
  readonly statsNode?: ReactNode;
  readonly statsColumns?: ReadonlyArray<StatsColumnItem>;
};

@observer
class ProductBoostHeader extends Component<ProductBoostHeaderProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      statsContainer: {
        display: "flex",
        maxWidth: 600,
        transform: "translateZ(0)",
        marginTop: 16,
      },
      column: {
        lineHeight: 1.4,
        flex: this.columnFlex,
        maxWidth: this.columnMaxWidthPercentage,
      },
      popoverColumn: {
        lineHeight: 1.4,
      },
      textStatsTitle: {
        fontSize: 16,
        color: palettes.textColors.LightInk,
      },
      textStatsBody: {
        fontSize: 20,
        color: palettes.textColors.Ink,
        wordWrap: "break-word",
        userSelect: "text",
      },
    });
  }

  @computed
  get columnFlex() {
    const { statsColumns } = this.props;
    let columnFlex = 1.0;
    if (statsColumns) {
      if (statsColumns.length > 3) {
        columnFlex = 1.0 / 3;
      } else {
        columnFlex = 1.0 / statsColumns.length;
      }
    }
    return columnFlex;
  }

  @computed
  get columnMaxWidthPercentage() {
    return `${this.columnFlex * 100}%`;
  }

  @computed
  get renderStatsColumns() {
    const { statsColumns } = this.props;
    if (!statsColumns) {
      return null;
    }

    // Act as key for each duplicated div element
    const uniqueKey = 0;
    return this.renderStatsColumnsRecursive(statsColumns, uniqueKey);
  }

  renderStatsColumnsRecursive(
    columns: ReadonlyArray<StatsColumnItem>,
    key: number
    // if you find this please fix the any types (legacy)
  ): any {
    const maximumColumnsPerRow = 3;
    if (columns.length > maximumColumnsPerRow) {
      const currentColumns = columns.slice(0, maximumColumnsPerRow);
      const remainderColumns = columns.slice(maximumColumnsPerRow);
      return (
        <>
          {this.renderStatsColumnsRow(currentColumns, key)}
          {this.renderStatsColumnsRecursive(remainderColumns, key + 3)}
        </>
      );
    }
    return this.renderStatsColumnsRow(columns, key);
  }

  renderStatsColumnsRow(columns: ReadonlyArray<StatsColumnItem>, key: number) {
    let uniqueKey = key;
    return (
      <div className={css(this.styles.statsContainer)}>
        {columns.map((column, index) => {
          uniqueKey += 1;
          if (column.popoverContent) {
            return (
              <Popover
                key={uniqueKey}
                popoverContent={column.popoverContent}
                position={"bottom center"}
              >
                <div className={css(this.styles.popoverColumn)}>
                  <Text
                    weight="medium"
                    className={css(this.styles.textStatsTitle)}
                  >
                    {column.columnTitle}
                  </Text>
                  <Text
                    weight="bold"
                    className={css(this.styles.textStatsBody)}
                  >
                    {column.columnStats}
                  </Text>
                </div>
              </Popover>
            );
          }
          return (
            <div className={css(this.styles.column)} key={uniqueKey}>
              <Text weight="medium" className={css(this.styles.textStatsTitle)}>
                {column.columnTitle}
              </Text>
              <Text weight="bold" className={css(this.styles.textStatsBody)}>
                {column.columnStats}
              </Text>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { statsColumns, statsNode, ...headerProps } = this.props;
    return (
      <WelcomeHeader {...headerProps}>
        {statsNode}
        {statsColumns && this.renderStatsColumns}
      </WelcomeHeader>
    );
  }
}
export default ProductBoostHeader;
