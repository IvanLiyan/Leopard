import React, { useEffect, useMemo, useState } from "react";
import { LoadingIndicator, Token } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { Constants } from "@add-edit-product/constants";
import { CategoryTreeNode } from "@core/taxonomy/toolkit";
import { observer } from "mobx-react";
import TaxonomyCategoryColumn from "./TaxonomyCategoryColumn";
type Props = {
  readonly clickedNode?: number;
  readonly onNodeClick?: (category: number) => void;
  readonly onSelectionsChange?: (categories: ReadonlyArray<number>) => void;
  readonly maxSelection?: number;
  readonly hideToken?: boolean;
  readonly categoryTreeMap: Map<number, CategoryTreeNode>; // key: categroy id; value: category data including parent and children
};

const TaxonomyCategoryColumnViewV2: React.FC<Props> = ({
  clickedNode,
  onNodeClick,
  onSelectionsChange,
  maxSelection,
  hideToken,
  categoryTreeMap,
}: Props) => {
  const { borderPrimary } = useTheme();

  const [clickedNodePath, setClickedNodePath] = useState<ReadonlyArray<number>>(
    [Constants.TAXONOMY.rootCategoryId],
  );
  const [selectedNodes, setSelectedNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (clickedNode) {
      const path = [];
      let currentNode: number | undefined = clickedNode;
      while (currentNode) {
        path.unshift(currentNode);
        currentNode = categoryTreeMap.get(currentNode)?.parentId;
      }

      setClickedNodePath(path);
    }
  }, [clickedNode, categoryTreeMap]);

  const maxReached = useMemo(() => {
    return maxSelection != null ? selectedNodes.size >= maxSelection : false;
  }, [maxSelection, selectedNodes.size]);

  const onSelectionChange = (id: number, selected: boolean) => {
    const newSelectedNodes = new Set(selectedNodes);
    if (selectedNodes.has(id) && !selected) {
      newSelectedNodes.delete(id);
      setSelectedNodes(newSelectedNodes);
      onSelectionsChange && onSelectionsChange(Array.from(newSelectedNodes));
    } else if (
      !selectedNodes.has(id) &&
      selected &&
      (maxSelection == null || !maxReached)
    ) {
      // if all children of its parent are selected, we select the parent instead
      const parentId = categoryTreeMap.get(id)?.parentId;
      const children = parentId
        ? categoryTreeMap.get(parentId)?.childrenIds ?? []
        : [];
      const siblings = children.filter((child) => child !== id);
      const shouldSelectParent = siblings.every((id) => selectedNodes.has(id));

      if (
        shouldSelectParent &&
        parentId &&
        parentId !== Constants.TAXONOMY.rootCategoryId
      ) {
        newSelectedNodes.add(parentId);
        siblings.forEach((sibling) => newSelectedNodes.delete(sibling));
        removeChildSelection(parentId, newSelectedNodes);
      } else {
        newSelectedNodes.add(id);
        removeChildSelection(id, newSelectedNodes);
      }

      setSelectedNodes(newSelectedNodes);
      onSelectionsChange && onSelectionsChange(Array.from(newSelectedNodes));
    }
  };

  // when parent is selected, all child selections will be removed
  // this function removes all child selections recursively
  const removeChildSelection = (node: number, selectionSet: Set<number>) => {
    const curNode = categoryTreeMap.get(node);
    if (curNode == null || curNode.childrenIds.length === 0) {
      return;
    }
    curNode.childrenIds.forEach((child) => {
      if (selectedNodes.has(child)) {
        selectionSet.delete(child);
      }
      removeChildSelection(child, selectionSet);
    });
  };

  const isSelfOrParentSelected = (node: number) => {
    let curNode = categoryTreeMap.get(node);
    while (curNode != null) {
      if (selectedNodes.has(curNode.id)) {
        return true;
      }

      curNode = curNode.parentId
        ? categoryTreeMap.get(curNode.parentId)
        : undefined;
    }

    return false;
  };

  if (categoryTreeMap.size === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div className="category-column-view-root">
      <style jsx>{`
        .category-column-view-root {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .category-column-view-columns {
          display: flex;
          flex-direction: row;
          border: solid 1px ${borderPrimary};
          border-radius: 8px;
          height: 430px;
        }
        .category-column-view-tokens {
          display: flex;
          flex-direction: row;
          gap: 16px;
          flex-wrap: wrap;
        }
      `}</style>
      {!hideToken && selectedNodes.size > 0 && (
        <div className="category-column-view-tokens">
          {Array.from(selectedNodes).map((id) => {
            const node = categoryTreeMap.get(id);
            return (
              node && (
                <Token
                  onDelete={() => {
                    onSelectionChange(id, false);
                  }}
                  key={id}
                >
                  {`${node.name} (${node.id})`}
                </Token>
              )
            );
          })}
        </div>
      )}
      <div className="category-column-view-columns">
        {clickedNodePath.map((id, i) => {
          const children = categoryTreeMap.get(id)?.childrenIds ?? [];
          const parentSelected = isSelfOrParentSelected(id);

          return (
            children.length > 0 && (
              <TaxonomyCategoryColumn
                key={id}
                index={i}
                highlightedNodes={clickedNodePath}
                onClick={onNodeClick}
                onSelectionChange={onSelectionChange}
                selectedNodes={Array.from(selectedNodes)}
                categoryTreeMap={categoryTreeMap}
                columnItems={children}
                disableAll={maxReached || parentSelected}
                selectAll={parentSelected}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default observer(TaxonomyCategoryColumnViewV2);
