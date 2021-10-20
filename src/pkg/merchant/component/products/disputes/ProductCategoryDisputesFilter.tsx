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
import { useTheme } from "@stores/ThemeStore";

/* Model */
import {
  DisputeStatusLabel,
  DisputeStatusTheme,
} from "@toolkit/products/product-category-dispute";
import { ProductCategoryDisputeStatus } from "@schema/types";

type Props = BaseProps & {
  readonly onSubmit: () => void;
  readonly statesQuery: ReadonlySet<ProductCategoryDisputeStatus>;
  readonly onSetStatesQuery: (
    value: ReadonlySet<ProductCategoryDisputeStatus>,
  ) => void;
};

const ProductCategoryDisputesFilter = (props: Props) => {
  const { className, style, onSubmit, statesQuery, onSetStatesQuery } = props;
  const styles = useStylesheet();

  const [selectedStates, setSelectedStates] = useState<
    Set<ProductCategoryDisputeStatus>
  >(new Set(statesQuery));

  const onCancel = async () => {
    setSelectedStates(new Set([]));
    onSetStatesQuery(new Set([]));
    await onSubmit();
  };

  const onClick = async () => {
    onSetStatesQuery(selectedStates);
    await onSubmit();
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
                <ThemedLabel
                  theme={DisputeStatusTheme.RESOLVED_UPDATE}
                  className={css(styles.label)}
                >
                  {DisputeStatusLabel.RESOLVED_UPDATE}
                </ThemedLabel>
              ),
              value: "RESOLVED_UPDATE",
            },
            {
              title: () => (
                <ThemedLabel
                  theme={DisputeStatusTheme.PENDING_REVIEW}
                  className={css(styles.label)}
                >
                  {DisputeStatusLabel.PENDING_REVIEW}
                </ThemedLabel>
              ),
              value: "PENDING_REVIEW",
            },
            {
              title: () => (
                <ThemedLabel
                  theme={DisputeStatusTheme.RESOLVED_UNCHANGED}
                  className={css(styles.label)}
                >
                  {DisputeStatusLabel.RESOLVED_UNCHANGED}
                </ThemedLabel>
              ),
              value: "RESOLVED_UNCHANGED",
            },
          ]}
          onChecked={({
            value,
          }: CheckboxGroupFieldOptionType<ProductCategoryDisputeStatus>) => {
            if (selectedStates.has(value)) {
              selectedStates.delete(value);
            } else {
              selectedStates.add(value);
            }
            setSelectedStates(new Set(selectedStates));
          }}
          selected={Array.from(selectedStates)}
        />
      </Layout.GridRow>
      <Layout.FlexRow justifyContent="flex-end" className={css(styles.section)}>
        <Link onClick={onCancel} className={css(styles.button)}>
          Clear
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
          ":not(:first-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        label: {
          flex: 1,
        },
      }),
    [borderPrimary, textBlack],
  );
};

export default observer(ProductCategoryDisputesFilter);
