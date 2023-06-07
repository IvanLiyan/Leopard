import React, { useEffect, useReducer } from "react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CategoryId, CategoryTreeNode } from "@core/taxonomy/toolkit";
import { observer } from "mobx-react";
import { Heading } from "@ContextLogic/atlas-ui";
import TaxonomyCategorySearchBarV2 from "./TaxonomyCategorySearchBarV2";
import TaxonomyCategoryColumnViewV2 from "./TaxonomyCategoryColumnViewV2";
import { css } from "@core/toolkit/styling";
import taxonomyReducer from "@core/taxonomy/v2/reducer";
import { Constants } from "@core/taxonomy/constants";

type Props = BaseProps & {
  readonly onSelectionsChange?: (categories: ReadonlyArray<CategoryId>) => void;
  readonly maxSelection?: number;
  readonly hideHeader?: boolean;
  readonly initialCategoryTreeMap: ReadonlyMap<CategoryId, CategoryTreeNode>;
  readonly selectLeafOnly?: boolean;
  readonly hideToken?: boolean;
};

const TaxonomyCategorySelectSection: React.FC<Props> = ({
  className,
  style,
  onSelectionsChange,
  maxSelection,
  initialCategoryTreeMap,
  hideHeader = false,
  selectLeafOnly = false,
  hideToken = false,
}: Props) => {
  const [state, dispatch] = useReducer(taxonomyReducer, {
    categoryTreeMap: initialCategoryTreeMap,
    highlightedPath: [Constants.TAXONOMY.rootCategoryId],
    selectedNodes: new Set<CategoryId>(),
  });

  useEffect(() => {
    dispatch({
      type: "INITIAL_STATE_CHANGE",
      categoryMap: initialCategoryTreeMap,
    });
  }, [initialCategoryTreeMap]);

  useEffect(() => {
    onSelectionsChange && onSelectionsChange(Array.from(state.selectedNodes));
    // onSelectionsChange is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedNodes]);

  if (initialCategoryTreeMap.size === 0) {
    return null;
  }

  return (
    <div className={css("category-select-section-root", style, className)}>
      <style jsx>{`
        .category-select-section-root {
          display: flex;
          flex-direction: column;
        }
      `}</style>
      {maxSelection != null && !hideHeader && (
        <Heading variant="h4" sx={{ marginBottom: "8px" }}>
          {maxSelection > 1
            ? i`Select up to ${maxSelection} categories (${state.selectedNodes.size}/${maxSelection})`
            : i`Select a category`}
        </Heading>
      )}
      <TaxonomyCategorySearchBarV2
        style={{ marginBottom: "16px" }}
        state={state}
        dispatch={dispatch}
      />
      <TaxonomyCategoryColumnViewV2
        maxSelection={maxSelection}
        state={state}
        dispatch={dispatch}
        selectLeafOnly={selectLeafOnly}
        hideToken={hideToken}
      />
    </div>
  );
};

export default observer(TaxonomyCategorySelectSection);
