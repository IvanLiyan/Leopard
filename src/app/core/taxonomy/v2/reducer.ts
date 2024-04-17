import { Constants } from "@core/taxonomy/constants";
import { CategoryId, CategoryTreeNode } from "@core/taxonomy/toolkit";

export type TaxonomyState = {
  readonly categoryTreeMap: ReadonlyMap<CategoryId, CategoryTreeNode>;
  readonly highlightedPath: ReadonlyArray<CategoryId>;
  readonly selectedNodes: ReadonlySet<CategoryId>;
};

export type TaxonomyAction =
  | {
      readonly type: "HIGHLIGHT_NODE" | "CHECK_NODE" | "UNCHECK_NODE";
      readonly id: CategoryId;
    }
  | {
      readonly type: "INITIAL_STATE_CHANGE";
      readonly categoryMap: ReadonlyMap<CategoryId, CategoryTreeNode>;
    };

// when parent is selected, child should be:
// - checked
// - disabled
// - removed from selections set
const childUpdateOnParentSelect = (
  parentId: CategoryId,
  selectionSet: Set<CategoryId>,
  categoryTreeMap: Map<CategoryId, CategoryTreeNode>,
) => {
  const curNode = categoryTreeMap.get(parentId);
  if (curNode == null || curNode.isLeaf) {
    return;
  }

  curNode.childrenIds.forEach((childId) => {
    if (selectionSet.has(childId)) {
      selectionSet.delete(childId);
    }
    const childInfo = categoryTreeMap.get(childId);
    if (childInfo) {
      categoryTreeMap.set(childId, {
        ...childInfo,
        checked: true,
        disabled: true,
      });
    }

    childUpdateOnParentSelect(childId, selectionSet, categoryTreeMap);
  });
};

// when parent is de-selected, child should be:
// - unchecked
// - enabled
const childUpdateOnParentDeselect = (
  parentId: CategoryId,
  selectionSet: Set<CategoryId>,
  categoryTreeMap: Map<CategoryId, CategoryTreeNode>,
) => {
  const curNode = categoryTreeMap.get(parentId);
  if (curNode == null || curNode.isLeaf) {
    return;
  }

  curNode.childrenIds.forEach((childId) => {
    const childInfo = categoryTreeMap.get(childId);
    if (childInfo) {
      categoryTreeMap.set(childId, {
        ...childInfo,
        checked: false,
        disabled: false,
      });
    }

    childUpdateOnParentDeselect(childId, selectionSet, categoryTreeMap);
  });
};

// when a node is highlighted, should:
// - traverse from the highlighted node to root to get the highlighted path
// - update highlighted state for each node along new path
const highlightAndUpdateAlongPath = (
  highlightedId: CategoryId,
  categoryTreeMap: Map<CategoryId, CategoryTreeNode>,
) => {
  const path = [];
  let currentNode: CategoryId | undefined = highlightedId;
  while (currentNode) {
    // add to beginning of path
    path.unshift(currentNode);

    // update highlight state in map
    const nodeInfo = categoryTreeMap.get(currentNode);
    if (nodeInfo) {
      categoryTreeMap.set(currentNode, {
        ...nodeInfo,
        highlighted: true,
      });
    }

    currentNode = categoryTreeMap.get(currentNode)?.parentId;
  }
  return path;
};

const reducer = (
  state: TaxonomyState,
  action: TaxonomyAction,
): TaxonomyState => {
  switch (action.type) {
    case "INITIAL_STATE_CHANGE": {
      const newCategoryMap = new Map(action.categoryMap);
      return {
        ...state,
        categoryTreeMap: newCategoryMap,
      };
    }
    case "CHECK_NODE": {
      const checkedId = action.id;
      if (!state.selectedNodes.has(checkedId)) {
        const newSelectedNodes = new Set(state.selectedNodes);
        const newCategoryMap = new Map(state.categoryTreeMap);

        // if all children of its parent are selected, we select the parent instead
        const parentId = newCategoryMap.get(checkedId)?.parentId;
        const children = parentId
          ? newCategoryMap.get(parentId)?.childrenIds ?? []
          : [];
        const siblings = children.filter((child) => child !== checkedId);
        // There is only one single-select children, choose not to take parentId
        const shouldSelectParent =
          siblings.length > 0
            ? siblings.every((id) => state.selectedNodes.has(id))
            : false;
        const selectId =
          shouldSelectParent &&
          parentId &&
          parentId !== Constants.TAXONOMY.rootCategoryId
            ? parentId
            : checkedId;

        newSelectedNodes.add(selectId);
        const nodeInfo = newCategoryMap.get(selectId);
        if (nodeInfo) {
          newCategoryMap.set(selectId, {
            ...nodeInfo,
            checked: true,
          });
        }
        childUpdateOnParentSelect(selectId, newSelectedNodes, newCategoryMap);

        return {
          ...state,
          selectedNodes: newSelectedNodes,
          categoryTreeMap: newCategoryMap,
        };
      }
      return state;
    }
    case "UNCHECK_NODE": {
      const uncheckedId = action.id;
      if (state.selectedNodes.has(uncheckedId)) {
        const newSelectedNodes = new Set(state.selectedNodes);
        const newCategoryMap = new Map(state.categoryTreeMap);

        newSelectedNodes.delete(uncheckedId);
        const nodeInfo = newCategoryMap.get(uncheckedId);
        if (nodeInfo) {
          newCategoryMap.set(uncheckedId, {
            ...nodeInfo,
            checked: false,
          });
        }
        childUpdateOnParentDeselect(
          uncheckedId,
          newSelectedNodes,
          newCategoryMap,
        );

        return {
          ...state,
          selectedNodes: newSelectedNodes,
          categoryTreeMap: newCategoryMap,
        };
      }

      return state;
    }
    case "HIGHLIGHT_NODE": {
      const highlightedId = action.id;
      const newCategoryMap = new Map(state.categoryTreeMap);

      // remove highlighted state for nodes along old path
      state.highlightedPath.forEach((node) => {
        const nodeInfo = newCategoryMap.get(node);
        if (nodeInfo) {
          newCategoryMap.set(node, {
            ...nodeInfo,
            highlighted: false,
          });
        }
      });

      // get new path
      const newHighlightedPath = highlightAndUpdateAlongPath(
        highlightedId,
        newCategoryMap,
      );

      return {
        ...state,
        categoryTreeMap: newCategoryMap,
        highlightedPath: newHighlightedPath,
      };
    }
  }
};

export default reducer;
