import { Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";
import { PickedCategoryWithDetails } from "@core/taxonomy/toolkit";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly hideLabel?: boolean | null;
  readonly currentCategory?: PickedCategoryWithDetails | null;
};

const TaxonomyCategoryPathView: React.FC<Props> = ({
  className,
  style,
  hideLabel,
  currentCategory,
}: Props) => {
  const styles = useStylesheet();

  const path = currentCategory?.categoriesAlongPath;

  return (
    <Layout.FlexRow style={[styles.root, className, style]}>
      {!hideLabel && (
        <Text>
          {ci18n(
            "Label that shows the hierarchy for the currently selected category",
            "Current Path:",
          )}
        </Text>
      )}
      {!path?.length ? (
        <Text>Please make your selection</Text>
      ) : (
        path.map((cat, i) => {
          return (
            <React.Fragment key={cat.id}>
              {cat.id == currentCategory?.id &&
              !currentCategory.categoryChildren?.length ? (
                <Text>{`${cat.name} (Subcategory ID: ${cat.id})`}</Text>
              ) : (
                <Text style={styles.selectedNodeText}>{cat.name}</Text>
              )}
              {i != path.length - 1 && <Text>{`>`}</Text>}
            </React.Fragment>
          );
        })
      )}
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { primary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 4,
        },
        selectedNodeText: {
          color: primary,
        },
      }),
    [primary],
  );
};

export default observer(TaxonomyCategoryPathView);
