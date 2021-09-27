import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import {
  Layout,
  H6,
  H7,
  Link,
  ThemedLabel,
  CheckboxGroupField,
  CheckboxGroupFieldOptionType,
  PrimaryButton,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import { MsrCategory, LinkProductComplianceState } from "@schema/types";
import { CategoryLabel } from "@toolkit/products/responsible-person";

type Props = BaseProps & {
  readonly categories: ReadonlyArray<MsrCategory>;
  readonly onSubmit: () => void;
  readonly statesQuery: LinkProductComplianceState[];
  readonly onSetStatesQuery: (
    value: readonly LinkProductComplianceState[]
  ) => void;
  readonly categoriesQuery: MsrCategory[];
  readonly onSetCategoriesQuery: (
    value: ReadonlyArray<MsrCategory | "NO_CATEGORY">
  ) => void;
};

const EuComplianceProductsFilter = (props: Props) => {
  const {
    className,
    style,
    categories,
    onSubmit,
    onSetStatesQuery,
    onSetCategoriesQuery,
    statesQuery,
    categoriesQuery,
  } = props;
  const styles = useStylesheet();

  const [selectedStatus, setSelectedStatus] = useState<
    Set<LinkProductComplianceState>
  >(new Set(statesQuery));
  const [selectedCategories, setSelectedCategories] = useState<
    Set<MsrCategory | "NO_CATEGORY">
  >(new Set(categoriesQuery));

  const onCancel = async () => {
    setSelectedStatus(new Set([]));
    setSelectedCategories(new Set([]));
    onSetStatesQuery([]);
    onSetCategoriesQuery([]);
    await onSubmit();
  };

  const onClick = async () => {
    onSetStatesQuery(Array.from(selectedStatus));
    onSetCategoriesQuery(Array.from(selectedCategories));
    await onSubmit();
  };

  const categoryOptions = [
    ...categories.map((category: MsrCategory) => ({
      title: CategoryLabel[category],
      value: category,
    })),
    {
      title: i`Show all other categories`,
      value: "NO_CATEGORY",
    },
  ];

  const onCategoriesChecked = ({
    value,
  }: CheckboxGroupFieldOptionType<string>) => {
    if (selectedCategories.has(value as MsrCategory)) {
      selectedCategories.delete(value as MsrCategory);
    } else if (value === "NO_CATEGORY") {
      setSelectedCategories(new Set(["NO_CATEGORY"]));
      return;
    } else {
      selectedCategories.add(value as MsrCategory);
    }
    setSelectedCategories(new Set(selectedCategories));
  };

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Layout.FlexRow
        justifyContent="space-between"
        className={css(styles.section)}
      >
        <H6>Filter by</H6>
      </Layout.FlexRow>
      <Layout.GridRow
        templateColumns="calc(30% - 8px) calc(70% - 8px)"
        gap={16}
        className={css(styles.section)}
      >
        <H7>Status</H7>
        <CheckboxGroupField
          options={[
            {
              title: () => (
                <ThemedLabel theme={`Yellow`} className={css(styles.label)}>
                  No Responsible Person
                </ThemedLabel>
              ),
              value: "NO_RP",
            },
            {
              title: () => (
                <ThemedLabel
                  theme={`LighterCyan`}
                  className={css(styles.label)}
                >
                  Responsible Person Linked
                </ThemedLabel>
              ),
              value: "HAS_RP",
            },
          ]}
          onChecked={({ value }: CheckboxGroupFieldOptionType<string>) => {
            if (selectedStatus.has(value as LinkProductComplianceState)) {
              selectedStatus.delete(value as LinkProductComplianceState);
            } else {
              selectedStatus.add(value as LinkProductComplianceState);
            }
            setSelectedStatus(new Set(selectedStatus));
          }}
          selected={Array.from(selectedStatus)}
        />
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="calc(30% - 8px) calc(70% - 8px)"
        gap={16}
        className={css(styles.section)}
      >
        <H7>Category</H7>
        <CheckboxGroupField
          options={categoryOptions}
          onChecked={onCategoriesChecked}
          selected={Array.from(selectedCategories)}
        />
      </Layout.GridRow>
      <Layout.FlexRow justifyContent="flex-end" className={css(styles.section)}>
        <Link onClick={onCancel} className={css(styles.button)}>
          Cancel
        </Link>
        <PrimaryButton onClick={onClick} className={css(styles.button)}>
          {ci18n("Apply/submit table filter options", "Apply")}
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        button: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        section: {
          color: textBlack,
          padding: 16,
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        label: {
          flex: 1,
        },
      }),
    [borderPrimary, textBlack]
  );
};

export default observer(EuComplianceProductsFilter);
