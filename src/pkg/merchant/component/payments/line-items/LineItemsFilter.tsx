import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { CheckboxGroupField } from "@ContextLogic/lego";
import { DayPickerInput } from "@ContextLogic/lego";
import { FormField } from "@ContextLogic/lego";
import { RadioGroup } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { RadioOption } from "@ContextLogic/lego";

/* Merchant Store */
import LocalizationStore from "@merchant/stores/LocalizationStore";

type BaseProps = any;

type LineItemsFilterProps = BaseProps & {
  readonly showItemTypes: boolean;
  readonly lineItemTypes: ReadonlyArray<unknown>;
  readonly selectedLineItemTypes: ReadonlyArray<unknown>;
  readonly onLineItemTypeToggled: (type: number) => unknown;

  readonly pageSizes: ReadonlyArray<RadioOption>;
  readonly selectedSize: number;
  readonly onPageSizeChange: (size: number) => unknown;

  readonly selectedStartDate: string | null | undefined;
  readonly selectedEndDate: string | null | undefined;
  readonly onStartDateFilterChanged: (date: string) => unknown;
  readonly onEndDateFilterChanged: (date: string) => unknown;

  readonly hasActiveFilters: boolean;
  readonly onFiltersDeselected: () => unknown;
};

@observer
class LineItemsFilter extends Component<LineItemsFilterProps> {
  @observable
  creditCollapsed = true;

  @observable
  debitCollapsed = true;

  bodyRef: HTMLDivElement | null | undefined;
  startDatePicker: HTMLDivElement | null | undefined;
  endDatePicker: HTMLDivElement | null | undefined;

  @computed
  get styles() {
    const { showItemTypes } = this.props;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "20px 20px 0px 20px",
      },
      body: {
        maxHeight: 388,
        overflowY: showItemTypes ? "scroll" : "visible",
        padding: "0px 20px",
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
        color: palettes.textColors.Ink,
        fontSize: 20,
        height: 28,
        cursor: "default",
        userSelect: "none",
        alignSelf: "center",
        textAlign: "center",
      },
      endDatePicker: {
        marginTop: 16,
      },
      footerButton: {
        margin: 4,
      },
      formSection: {
        marginTop: 16,
        borderBottom: "1px solid #c4cdd5",
        paddingBottom: 16,
      },
      formLastSection: {
        marginTop: 16,
        paddingBottom: 16,
      },
      selectAllButton: {
        minWidth: 80,
        padding: "7px 0px",
        color: palettes.textColors.DarkInk,
      },
    });
  }

  @computed
  get creditLineItems() {
    const { lineItemTypes } = this.props;
    return (
      lineItemTypes
        // if you find this please fix the any types (legacy)
        .filter((lit: any) => lit.value <= 1000)
        .sort((a: any, b: any) => {
          if (a.value < b.value) {
            return -1;
          }

          if (a.value > b.value) {
            return 1;
          }

          return 0;
        })
    );
  }

  @computed
  get debitLineItems() {
    const { lineItemTypes } = this.props;
    return (
      lineItemTypes
        // if you find this please fix the any types (legacy)
        .filter((lit: any) => lit.value > 1000)
        .sort((a: any, b: any) => {
          if (a.value < b.value) {
            return -1;
          }

          if (a.value > b.value) {
            return 1;
          }

          return 0;
        })
    );
  }

  renderHeader() {
    return (
      <div className={css(this.styles.header)}>
        <section className={css(this.styles.title)}>Item Filters</section>
      </div>
    );
  }

  renderPageSizeField() {
    const { onPageSizeChange, pageSizes, selectedSize } = this.props;
    return (
      <FormField className={css(this.styles.formSection)} title={i`Page Size`}>
        <RadioGroup
          onSelected={(value: number) => {
            onPageSizeChange(value);
          }}
          selectedValue={selectedSize}
        >
          {pageSizes.map((option: RadioOption) => (
            <RadioGroup.Item
              key={option.text as string}
              value={option.value}
              text={option.text}
            />
          ))}
        </RadioGroup>
      </FormField>
    );
  }

  renderDateFields() {
    const {
      onEndDateFilterChanged,
      onStartDateFilterChanged,
      selectedEndDate,
      selectedStartDate,
      showItemTypes,
    } = this.props;
    const { locale } = LocalizationStore.instance();
    return (
      <div
        className={
          showItemTypes
            ? css(this.styles.formSection)
            : css(this.styles.formLastSection)
        }
      >
        <FormField title={i`Start Date`}>
          <div
            ref={(ref) => {
              this.startDatePicker = ref;
            }}
            onClick={() => {
              const { bodyRef, startDatePicker } = this;
              if (showItemTypes && bodyRef != null && startDatePicker != null) {
                bodyRef.scrollTo({
                  top: startDatePicker.offsetTop - 60,
                  behavior: "smooth",
                });
              }
            }}
          >
            <DayPickerInput
              alignRight
              noEdit={false}
              height={28}
              onDayChange={(day: Date | null | undefined) => {
                if (day != null) {
                  const formattedDate = moment(day).format("YYYY-MM-DD");
                  onStartDateFilterChanged(formattedDate);
                } else {
                  onStartDateFilterChanged(null);
                }
              }}
              dayPickerProps={{
                showOutsideDays: true,
              }}
              inputProps={{
                height: 28,
              }}
              value={selectedStartDate}
              locale={locale}
            />
          </div>
        </FormField>
        <FormField
          className={css(this.styles.endDatePicker)}
          title={i`End Date`}
        >
          <div
            ref={(ref) => {
              this.endDatePicker = ref;
            }}
            onClick={() => {
              const { bodyRef, endDatePicker } = this;
              if (showItemTypes && bodyRef != null && endDatePicker != null) {
                bodyRef.scrollTo({
                  top: endDatePicker.offsetTop - 60,
                  behavior: "smooth",
                });
              }
            }}
          >
            <DayPickerInput
              alignRight
              noEdit={false}
              height={28}
              onDayChange={(day: Date | null | undefined) => {
                if (day != null) {
                  const formattedDate = moment(day).format("YYYY-MM-DD");
                  onEndDateFilterChanged(formattedDate);
                } else {
                  onEndDateFilterChanged(null);
                }
              }}
              dayPickerProps={{
                showOutsideDays: true,
              }}
              inputProps={{
                height: 28,
              }}
              value={selectedEndDate}
            />
          </div>
        </FormField>
      </div>
    );
  }

  renderSelectAllButton = (selectAllButtonParams: any) => {
    let toSelectAll = false;
    const selectedSet = new Set<number>(selectAllButtonParams.selectLineItems);
    // if at least one item is not in the selected set, set toSelectAll to true
    selectAllButtonParams.allLineItems.forEach((allLineItem: any) => {
      if (!selectedSet.has(allLineItem.value)) {
        toSelectAll = true;
      }
    });

    return (
      <Button
        style={this.styles.selectAllButton}
        onClick={() => {
          if (toSelectAll) {
            // select all
            selectAllButtonParams.allLineItems.forEach((allLineItem: any) => {
              selectedSet.add(allLineItem.value);
            });
          } else {
            // deselect all
            selectAllButtonParams.allLineItems.forEach((allLineItem: any) => {
              selectedSet.delete(allLineItem.value);
            });
          }
          selectAllButtonParams.selectItemsAction(selectedSet);
        }}
        disabled={false}
        hideBorder
      >
        {toSelectAll ? i`Select all` : i`Deselect all`}
      </Button>
    );
  };

  renderCreditField() {
    const {
      onLineItemTypeToggled,
      selectedLineItemTypes,
      setLineItemTypeSelectedItems,
    } = this.props;
    const selectAllButtonParams = {
      allLineItems: this.creditLineItems,
      selectLineItems: selectedLineItemTypes,
      selectItemsAction: setLineItemTypeSelectedItems,
    };
    return (
      <div className={css(this.styles.formSection)}>
        {this.renderSelectAllButton(selectAllButtonParams)}
        <CheckboxGroupField
          title={i`Credit Items`}
          options={this.creditLineItems}
          onChecked={(option: OptionType<number>) =>
            onLineItemTypeToggled(option.value)
          }
          selected={selectedLineItemTypes}
          collapsedAmount={5}
          collapsed={this.creditCollapsed}
          onCollapseToggled={() => {
            this.creditCollapsed = !this.creditCollapsed;
          }}
        />
      </div>
    );
  }

  renderDebitField() {
    const {
      onLineItemTypeToggled,
      selectedLineItemTypes,
      setLineItemTypeSelectedItems,
    } = this.props;
    const selectAllButtonParams = {
      allLineItems: this.debitLineItems,
      selectLineItems: selectedLineItemTypes,
      selectItemsAction: setLineItemTypeSelectedItems,
    };
    return (
      <div className={css(this.styles.formLastSection)}>
        {this.renderSelectAllButton(selectAllButtonParams)}
        <CheckboxGroupField
          title={i`Debit Items`}
          options={this.debitLineItems}
          onChecked={(option: OptionType<number>) =>
            onLineItemTypeToggled(option.value)
          }
          selected={selectedLineItemTypes}
          collapsedAmount={5}
          collapsed={this.debitCollapsed}
          onCollapseToggled={() => {
            this.debitCollapsed = !this.debitCollapsed;
          }}
        />
      </div>
    );
  }

  renderBody() {
    const { showItemTypes } = this.props;
    return (
      <div
        className={css(this.styles.body)}
        ref={(ref) => {
          this.bodyRef = ref;
        }}
      >
        {this.renderPageSizeField()}
        {this.renderDateFields()}
        {showItemTypes && this.renderCreditField()}
        {showItemTypes && this.renderDebitField()}
      </div>
    );
  }

  renderFooter() {
    return (
      <div className={css(this.styles.footer)}>
        <Button
          onClick={() => {
            // eslint-disable-next-line local-rules/unwrapped-i18n
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          disabled={false}
          style={[
            this.styles.footerButton,
            {
              padding: "7px 20px",
              borderRadius: 3,
              textColor: palettes.textColors.DarkInk,
            },
          ]}
        >
          Cancel
        </Button>

        <PrimaryButton
          onClick={() => {
            // eslint-disable-next-line local-rules/unwrapped-i18n
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          className={css(this.styles.footerButton)}
        >
          Apply filters
        </PrimaryButton>
      </div>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    );
  }
}
export default LineItemsFilter;
