import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { FilterButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { CheckboxGroupField } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import CollectionBoostStatusLabel from "@merchant/component/collections-boost/CollectionBoostStatusLabel";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { CollectionsBoostCollectionState } from "@merchant/api/collections-boost";

type CollectionsFilterProps = BaseProps & {
  readonly filterStates: ReadonlyArray<CollectionsBoostCollectionState>;
  readonly onFilterStateSelect: (
    state: OptionType<CollectionsBoostCollectionState>,
  ) => void;
  readonly onDeselectAll: () => void;
  readonly onApplyFilter: () => void;
};

const CollectionsBoostCollectionsFilter = (props: CollectionsFilterProps) => {
  const {
    className,
    filterStates,
    onFilterStateSelect,
    onDeselectAll,
    onApplyFilter,
  } = props;
  const styles = useStyleSheet();
  const { textBlack, primary, borderPrimaryDark } = useTheme();
  const filterOptions = useFilterOptions();

  const hasActiveFilters = filterStates.length > 0;

  const renderFilterHeader = () => (
    <div className={css(styles.header)}>
      <section className={css(styles.title)}>Collection Filter</section>
      {hasActiveFilters && (
        <Button
          onClick={onDeselectAll}
          disabled={false}
          hideBorder
          style={{
            padding: "7px 0px",
            color: textBlack,
          }}
        >
          Deselect All
        </Button>
      )}
    </div>
  );

  const renderFilterBody = () => (
    <div className={css(styles.body)}>
      <CheckboxGroupField
        className={css(styles.filter)}
        title={i`Collection Status`}
        options={filterOptions}
        onChecked={onFilterStateSelect}
        selected={filterStates}
      />
    </div>
  );

  const renderFilterFooter = () => (
    <div className={css(styles.footer)}>
      <PrimaryButton className={css(styles.button)} onClick={onApplyFilter}>
        Apply Filter
      </PrimaryButton>
    </div>
  );

  return (
    <Popover
      className={css(className)}
      popoverContent={() => (
        <div className={css(styles.root)}>
          {renderFilterHeader()}
          {renderFilterBody()}
          {renderFilterFooter()}
        </div>
      )}
      position="bottom right"
      contentWidth={330}
    >
      <FilterButton
        style={[
          styles.filterButton,
          {
            color: hasActiveFilters ? primary : textBlack,
          },
        ]}
        isActive={hasActiveFilters}
        borderColor={hasActiveFilters ? primary : borderPrimaryDark}
      />
    </Popover>
  );
};

export default observer(CollectionsBoostCollectionsFilter);

const useFilterOptions = (): ReadonlyArray<
  OptionType<CollectionsBoostCollectionState>
> => {
  return useMemo(
    () => [
      {
        value: "PENDING",
        title: () => <CollectionBoostStatusLabel status="PENDING" />,
      },
      {
        value: "APPROVED",
        title: () => <CollectionBoostStatusLabel status="APPROVED" />,
      },
      {
        value: "REJECTED",
        title: () => <CollectionBoostStatusLabel status="REJECTED" />,
      },
    ],
    [],
  );
};

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          borderBottom: "1px solid #c4cdd5",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: 10,
        },
        body: {
          maxHeight: 350,
          overflow: "scroll",
          overflowX: "hidden",
          padding: "10px 20px",
        },
        footer: {
          borderTop: "1px solid #c4cdd5",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-end",
          padding: 16,
        },
        title: {
          color: textBlack,
          fontSize: 20,
          alignSelf: "center",
          textAlign: "center",
        },
        filter: {
          paddingBottom: 16,
          marginTop: 16,
          marginRight: 10,
        },
        button: {
          margin: 5,
        },
        filterButton: {
          alignSelf: "stretch",
          padding: "4px 15px",
        },
      }),
    [textBlack],
  );
};
