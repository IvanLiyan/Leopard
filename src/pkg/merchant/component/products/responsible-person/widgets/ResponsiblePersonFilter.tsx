import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
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
  ReviewStatusLabel,
  ThemeColor,
} from "@toolkit/products/responsible-person";
import { ResponsiblePersonStatus } from "@schema/types";

type Props = BaseProps & {
  readonly onSubmit: () => void;
  readonly states: Set<ResponsiblePersonStatus>;
  readonly onSetStates: Dispatch<SetStateAction<Set<ResponsiblePersonStatus>>>;
};

const ResponsiblePersonFilter = (props: Props) => {
  const { className, style, onSubmit, states, onSetStates } = props;
  const styles = useStylesheet();

  const [selectedStatus, setSelectedStatus] = useState<
    Set<ResponsiblePersonStatus>
  >(new Set(states));

  const onCancel = async () => {
    setSelectedStatus(new Set([]));
    onSetStates(new Set([]));
    await onSubmit();
  };

  const onClick = async () => {
    onSetStates(selectedStatus);
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
                  theme={ThemeColor.COMPLETE}
                  className={css(styles.label)}
                >
                  {ReviewStatusLabel.COMPLETE}
                </ThemedLabel>
              ),
              value: "COMPLETE",
            },
            {
              title: () => (
                <ThemedLabel
                  theme={ThemeColor.INREVIEW}
                  className={css(styles.label)}
                >
                  {ReviewStatusLabel.INREVIEW}
                </ThemedLabel>
              ),
              value: "INREVIEW",
            },
            {
              title: () => (
                <ThemedLabel
                  theme={ThemeColor.REJECTED}
                  className={css(styles.label)}
                >
                  {ReviewStatusLabel.REJECTED}
                </ThemedLabel>
              ),
              value: "REJECTED",
            },
          ]}
          onChecked={({ value }: CheckboxGroupFieldOptionType<string>) => {
            if (selectedStatus.has(value as ResponsiblePersonStatus)) {
              selectedStatus.delete(value as ResponsiblePersonStatus);
            } else {
              selectedStatus.add(value as ResponsiblePersonStatus);
            }
            setSelectedStatus(new Set(selectedStatus));
          }}
          selected={Array.from(selectedStatus)}
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
    [borderPrimary, textBlack],
  );
};

export default observer(ResponsiblePersonFilter);
