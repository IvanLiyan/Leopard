import React from "react";
import { Checkbox } from "@mui/material";
import { useTheme } from "@core/stores/ThemeStore";
import { observer } from "mobx-react";
import { Text } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";
import { TaxonomyAction, TaxonomyState } from "@core/taxonomy/v2/reducer";
import { CategoryId } from "@core/taxonomy/toolkit";

type Props = {
  readonly level: number;
  readonly columnItems: ReadonlyArray<CategoryId>;
  readonly dispatch: React.Dispatch<TaxonomyAction>;
  readonly state: TaxonomyState;
  readonly disableAll: boolean;
};

const TaxonomyCategoryColumnItem: React.FC<Props> = ({
  level,
  columnItems,
  state,
  dispatch,
  disableAll,
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
        const treeItem = state.categoryTreeMap.get(id);

        return (
          treeItem && (
            <div
              key={id}
              className="category-column-node"
              style={{
                backgroundColor: treeItem.highlighted
                  ? surfaceLight
                  : undefined,
              }}
              data-cy={`column-${level}-item-${id}`}
              onClick={() => {
                dispatch({ type: "HIGHLIGHT_NODE", id });
              }}
            >
              <div className="category-column-node-content">
                <Checkbox
                  checked={treeItem.checked}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: event.target.checked
                        ? "CHECK_NODE"
                        : "UNCHECK_NODE",
                      id,
                    });
                  }}
                  disabled={disableAll || treeItem.disabled}
                  size="medium"
                  style={{ marginRight: "20px" }}
                />
                <Text
                  variant="bodyM"
                  sx={{ color: treeItem.highlighted ? textBlack : textDark }}
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
