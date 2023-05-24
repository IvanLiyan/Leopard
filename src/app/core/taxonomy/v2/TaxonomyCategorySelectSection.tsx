import React, { useState } from "react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CategoryTreeNode } from "@core/taxonomy/toolkit";
import { observer } from "mobx-react";
import { Heading } from "@ContextLogic/atlas-ui";
import TaxonomyCategorySearchBarV2 from "./TaxonomyCategorySearchBarV2";
import TaxonomyCategoryColumnViewV2 from "./TaxonomyCategoryColumnViewV2";
import { css } from "@core/toolkit/styling";

type Props = BaseProps & {
  readonly onSelectionsChange?: (categories: ReadonlyArray<number>) => void;
  readonly maxSelection?: number;
  readonly showHeader?: boolean;
  readonly categoryTreeMap: Map<number, CategoryTreeNode>; // key: categroy id; value: category data including parent and children
};

const TaxonomyCategorySelectSection: React.FC<Props> = ({
  className,
  style,
  onSelectionsChange,
  maxSelection,
  showHeader,
  categoryTreeMap,
}: Props) => {
  const [selectedNodes, setSelectedNodes] = useState<ReadonlyArray<number>>([]);
  const [clickedNode, setClickedNode] = useState<number | undefined>();

  if (categoryTreeMap.size === 0) {
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
      {maxSelection != null && showHeader && (
        <Heading variant="h4" sx={{ marginBottom: "8px" }}>
          {i`Select up to ${maxSelection} categories (${selectedNodes.length}/${maxSelection})`}
        </Heading>
      )}
      <TaxonomyCategorySearchBarV2
        onSelect={setClickedNode}
        categoryTreeMap={categoryTreeMap}
        style={{ marginBottom: "16px" }}
      />
      <TaxonomyCategoryColumnViewV2
        categoryTreeMap={categoryTreeMap}
        onSelectionsChange={(categories) => {
          setSelectedNodes(categories);
          onSelectionsChange && onSelectionsChange(categories);
        }}
        clickedNode={clickedNode}
        onNodeClick={setClickedNode}
        maxSelection={maxSelection}
      />
    </div>
  );
};

export default observer(TaxonomyCategorySelectSection);
