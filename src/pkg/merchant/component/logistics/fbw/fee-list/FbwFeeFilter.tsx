import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { FilterButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { CheckboxGroupField } from "@ContextLogic/lego";
import { DayPickerInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes, wishBlue } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";

/* Merchant Store */
import LocalizationStore from "@merchant/stores/LocalizationStore";

export const DateFormat = "MM-DD-YYYY";

// One option corresponds to one checkbox in UI
export type FbwFeeFilterOption = OptionType<Array<number>>;

// Group of checkboxes
export type FilterOptionGroup = {
  readonly title: string;
  readonly options: ReadonlyArray<FbwFeeFilterOption>;
  selected: ReadonlyArray<number>;
};

// All filter values controlled by this component
export type FbwFeeFilterValues = {
  readonly feeTypeFilterOptionGroup: FilterOptionGroup;
  readonly feeStatusFilterOptionGroup: FilterOptionGroup;
  readonly startDate?: Date | null | undefined;
  readonly endDate?: Date | null | undefined;
};

export type FbwFeeFilterProp = BaseProps &
  FbwFeeFilterValues & {
    readonly setFilterValues: (arg0: FbwFeeFilterValues) => unknown;
    readonly isOnFBSTab?: boolean;
  };

const checkFilterOptionIsSelected = (
  target: FbwFeeFilterOption,
  allSelected: ReadonlyArray<number>
) => {
  return allSelected.includes(target.value[0]);
};

const FbwFeeFilter = (props: FbwFeeFilterProp) => {
  const styles = useStyleSheet();
  const {
    feeTypeFilterOptionGroup,
    feeStatusFilterOptionGroup,
    startDate,
    endDate,
    setFilterValues,
    isOnFBSTab,
  } = props;
  const [feeTypeSelections, setFeeTypeSelections] = useState(
    feeTypeFilterOptionGroup.selected
  );
  const [feeStatusSelections, setFeeStatusSelections] = useState(
    feeStatusFilterOptionGroup.selected
  );
  feeTypeFilterOptionGroup.selected = feeTypeSelections;
  feeStatusFilterOptionGroup.selected = feeStatusSelections;
  const [currentStartDate, setStartDate] = useState(startDate);
  const [currentEndDate, setEndDate] = useState(endDate);
  const [isPopoverOpened, setPopoverOpened] = useState(false);
  const hasActiveFilters =
    (!isOnFBSTab && feeTypeSelections.length) ||
    feeStatusSelections.length ||
    currentStartDate ||
    currentEndDate;
  const { locale } = LocalizationStore.instance();

  const onFeeTypeCheckboxClicked = (type: FbwFeeFilterOption) => {
    const selectedFeeTypes = new Set(feeTypeSelections);
    for (const value of type.value) {
      if (selectedFeeTypes.has(value)) {
        selectedFeeTypes.delete(value);
      } else {
        selectedFeeTypes.add(value);
      }
    }
    setFeeTypeSelections(Array.from(selectedFeeTypes).sort());
  };
  const onFeeStatusCheckboxClicked = (status: FbwFeeFilterOption) => {
    const selectedFeeStatuses = new Set(feeStatusSelections);
    for (const value of status.value) {
      if (selectedFeeStatuses.has(value)) {
        selectedFeeStatuses.delete(value);
      } else {
        selectedFeeStatuses.add(value);
      }
    }
    setFeeStatusSelections(Array.from(selectedFeeStatuses).sort());
  };
  const onClearAllClicked = () => {
    feeTypeFilterOptionGroup.selected = [];
    feeStatusFilterOptionGroup.selected = [];
    setStartDate(null);
    setEndDate(null);
    setFeeTypeSelections([]);
    setFeeStatusSelections([]);
    setFilterValues({
      feeTypeFilterOptionGroup,
      feeStatusFilterOptionGroup,
      startDate: null,
      endDate: null,
    });
    setPopoverOpened(false);
  };
  const onApplyClicked = () => {
    setFilterValues({
      feeTypeFilterOptionGroup,
      feeStatusFilterOptionGroup,
      startDate: currentStartDate,
      endDate: currentEndDate,
    });
    setPopoverOpened(false);
  };
  const togglePopoverOpened = () => {
    setPopoverOpened(!isPopoverOpened);
  };

  return (
    <Popover
      position="bottom right"
      contentWidth={400}
      popoverOpen={isPopoverOpened}
      disableMouseOverTrigger
      popoverContent={() => (
        <div className={css(styles.root)}>
          <div className={css(styles.body)}>
            <div className={css(styles.header)}>
              <section className={css(styles.mainTitle)}>
                FBW Fee Filters
              </section>
              {hasActiveFilters && (
                <Button
                  onClick={onClearAllClicked}
                  hideBorder
                  style={{
                    padding: "0px",
                    color: palettes.textColors.DarkInk,
                  }}
                >
                  Deselect all
                </Button>
              )}
            </div>
            {!isOnFBSTab && (
              <CheckboxGroupField
                className={css(styles.filter)}
                title={feeTypeFilterOptionGroup.title}
                options={feeTypeFilterOptionGroup.options}
                selected={feeTypeFilterOptionGroup.selected}
                onChecked={onFeeTypeCheckboxClicked}
                checkSelected={checkFilterOptionIsSelected}
              />
            )}
            <CheckboxGroupField
              className={css(styles.filter)}
              title={feeStatusFilterOptionGroup.title}
              options={feeStatusFilterOptionGroup.options}
              selected={feeStatusFilterOptionGroup.selected}
              onChecked={onFeeStatusCheckboxClicked}
              checkSelected={checkFilterOptionIsSelected}
            />
            <div className={css(styles.dayPicker)}>
              <div className={css(styles.title)}>
                <span>Start Date</span>
              </div>
              <DayPickerInput
                value={startDate ? startDate : ""}
                placeholder={i`YYYY-MM-DD`}
                onDayChange={setStartDate}
                locale={locale}
                cannotSelectFuture
              />
            </div>
            <div className={css(styles.dayPicker)}>
              <div className={css(styles.title)}>
                <span>End Date</span>
              </div>
              <DayPickerInput
                value={endDate ? endDate : ""}
                placeholder={i`YYYY-MM-DD`}
                onDayChange={setEndDate}
                locale={locale}
                cannotSelectFuture
              />
            </div>
          </div>
          <div className={css(styles.bottom)}>
            <Button
              style={styles.bottomButton}
              onClick={() => {
                setPopoverOpened(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={[
                styles.bottomButton,
                {
                  color: palettes.textColors.White,
                  backgroundColor: wishBlue,
                },
              ]}
              onClick={onApplyClicked}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    >
      <FilterButton
        className={css(styles.filterButton)}
        onClick={togglePopoverOpened}
      />
    </Popover>
  );
};

export default observer(FbwFeeFilter);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        filter: {
          paddingBottom: 16,
          marginTop: 16,
        },
        dayPicker: {
          display: "flex",
          flexDirection: "row",
          marginBottom: 16,
        },
        header: {
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "20px 5px 0px 0px",
        },
        mainTitle: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          height: 28,
          cursor: "default",
          userSelect: "none",
          alignSelf: "center",
          textAlign: "center",
        },
        bottom: {
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "flex-end",
          padding: "0px 20px 0px 20px",
          marginBottom: 20,
        },
        bottomButton: {
          marginLeft: 10,
        },
        body: {
          padding: "0px 20px",
        },
        title: {
          padding: "10px 0",
          color: palettes.textColors.Ink,
          fontSize: 14,
          cursor: "default",
          userSelect: "none",
          width: 120,
        },
        filterButton: {
          alignSelf: "stretch",
        },
      }),
    []
  );
};
