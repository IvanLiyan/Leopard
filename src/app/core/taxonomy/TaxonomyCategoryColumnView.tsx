import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { Constants } from "@core/taxonomy/constants";
import {
  PickedCategory,
  PickedCategoryWithDetails,
} from "@core/taxonomy/toolkit";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import TaxonomyCategoryColumnItem from "./TaxonomyCategoryColumnItem";

type Props = BaseProps & {
  readonly l1CategoryIds?: ReadonlyArray<number>;
  readonly currentPath?: ReadonlyArray<PickedCategory>;
  readonly onSelect?: (category: PickedCategoryWithDetails) => void;
};

const TaxonomyCategoryColumnView: React.FC<Props> = ({
  className,
  style,
  l1CategoryIds,
  currentPath,
  onSelect,
}: Props) => {
  const styles = useStylesheet();

  const [parents, setParents] = useState<
    ReadonlyArray<Pick<PickedCategory, "id">>
  >([{ id: `${Constants.TAXONOMY.rootCategoryId}` }]);

  useEffect(() => {
    if (currentPath) {
      setParents((prev) => [prev[0], ...currentPath]);
    }
  }, [currentPath]);

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.GridRow
        templateColumns={`repeat(${parents.length}, 273px)`}
        smallScreenTemplateColumns={`repeat(${parents.length}, 273px)`}
      >
        {parents.map((parentCategory, i) => (
          <TaxonomyCategoryColumnItem
            style={styles.gridItem}
            key={parentCategory.id}
            index={i}
            parentCategory={parseInt(parentCategory.id)}
            allowlist={
              i == 0
                ? l1CategoryIds?.map((categoryId) => {
                    return { id: `${categoryId}` };
                  })
                : undefined
            }
            highlight={currentPath}
            onSelect={(selectedCategory) => {
              setParents((prev) => [
                prev[0],
                ...selectedCategory.categoriesAlongPath,
              ]);
              onSelect && onSelect(selectedCategory);
            }}
          />
        ))}
      </Layout.GridRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          overflow: "auto",
          border: `solid 1px ${borderPrimary}`,
          borderRadius: "4px 4px 4px 4px",
        },
        gridItem: {
          borderRight: `solid 1px ${borderPrimary}`,
        },
      }),
    [borderPrimary],
  );
};

export default observer(TaxonomyCategoryColumnView);
