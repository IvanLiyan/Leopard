import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy Import */
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly categories: ReadonlyArray<string>;
};

const maxVisible = 7;

const ProductCategories = (props: Props) => {
  const { className, style, categories } = props;
  const styles = useStylesheet();
  const [showAll, setShowAll] = useState(false);

  const remainingAmount = Math.max(0, categories.length - maxVisible);

  return (
    <Layout.FlexRow style={[styles.root, className, style]}>
      <Text style={styles.categories}>
        {categories
          .slice(0, showAll ? categories.length : maxVisible)
          .join(", ")}
      </Text>
      {remainingAmount > 0 && (
        <Layout.FlexColumn
          onClick={() => setShowAll(!showAll)}
          style={styles.toggle}
        >
          <Text>
            {showAll
              ? ci18n("UI command to show hide elements", "Collapse")
              : ci18n(
                  "UI button where clicking it shows X more items (plus X more)",
                  "+ {%1=remaining amount} more",
                  remainingAmount,
                )}
          </Text>
        </Layout.FlexColumn>
      )}
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { textLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 8,
        },
        categories: {
          whiteSpace: "pre-line",
          padding: "8px 0px",
        },
        toggle: {
          color: textLight,
          cursor: "pointer",
        },
      }),
    [textLight],
  );
};

export default observer(ProductCategories);
