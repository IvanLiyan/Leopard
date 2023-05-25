import React from "react";
import { Checkbox } from "@mui/material";
import { useTheme } from "@core/stores/ThemeStore";
import { observer } from "mobx-react";
import { CategoryTreeNode } from "../toolkit";
import { Text } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";

type Props = {
  readonly index: number;
  readonly categoryTreeMap: Map<number, CategoryTreeNode>; // key: category id; value: category data including parent and children
  readonly columnItems: ReadonlyArray<number>;
  readonly highlightedNodes?: ReadonlyArray<number>;
  readonly selectedNodes?: ReadonlyArray<number>;
  readonly disableAll?: boolean; // when parent is selected or max selection is reached
  readonly selectAll?: boolean; // when parent node is selected
  readonly onSelectionChange?: (id: number, selected: boolean) => void;
  readonly onClick?: (id: number) => void;
};

const TaxonomyCategoryColumnItem: React.FC<Props> = ({
  index,
  categoryTreeMap,
  columnItems,
  highlightedNodes,
  selectedNodes,
  selectAll,
  disableAll,
  onSelectionChange,
  onClick,
}: Props) => {
  const {
    textDark,
    textBlack,
    textLight,
    surfaceLight,
    surfaceLightest,
    borderPrimary,
  } = useTheme();

  return (
    <div className="category-column-root">
      <style jsx>{`
        .category-column-root {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          width: 271px;
          overflow: auto;
          background-color: ${surfaceLightest};
        }
        .category-column-root:not(:last-child) {
          border-right: solid 1px ${borderPrimary};
        }
        .category-column-root:last-child {
          border-radius: 0px 8px 8px 0px;
        }
        .category-column-root:first-child {
          border-radius: 8px 0px 0px 8px;
        }
        .category-column-root:only-child {
          border-radius: 8px;
        }
        .category-column-node {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 18px;
          cursor: pointer;
        }
        .category-column-node-content {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      `}</style>
      {columnItems.map((id) => {
        const treeItem = categoryTreeMap.get(id);
        const highlight = highlightedNodes?.some(
          (highlightId) => highlightId === id,
        );
        const selected =
          selectedNodes?.some((selectedId) => selectedId === id) ?? false;

        return (
          treeItem && (
            <div
              key={id}
              className="category-column-node"
              style={{
                backgroundColor: highlight ? surfaceLight : undefined,
              }}
              data-cy={`column-${index + 1}-item-${id}`}
              onClick={() => {
                onClick && onClick(id);
              }}
            >
              <div className="category-column-node-content">
                <Checkbox
                  checked={selected || selectAll}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onSelectionChange &&
                      onSelectionChange(id, event.target.checked);
                  }}
                  disabled={disableAll}
                  size="medium"
                  style={{ marginRight: "20px" }}
                />
                <Text
                  variant="bodyM"
                  sx={{ color: highlight ? textBlack : textDark }}
                >
                  {`${treeItem.name} (${treeItem.id})`}
                </Text>
              </div>
              {treeItem.childrenIds.length != null &&
                treeItem.childrenIds.length > 0 && (
                  <Icon
                    name="chevronRightLarge"
                    color={textLight}
                    size="large"
                    style={{ flexShrink: 0 }}
                  />
                )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default observer(TaxonomyCategoryColumnItem);
