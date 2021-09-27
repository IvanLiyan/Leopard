/* eslint-disable local-rules/unwrapped-i18n */

import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { DayRangePickerInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type BaseProps = any;

type DateRangeProps = BaseProps & {
  readonly maxEndDate: Date | null | undefined;
  readonly selectedStartDate: Date | null | undefined;
  readonly selectedEndDate: Date | null | undefined;
  readonly onDateRangeChange?: (from: Date, to: Date) => unknown;
};

@observer
class DateRange extends Component<DateRangeProps> {
  bodyRef: HTMLDivElement | null | undefined;
  startDatePicker: HTMLDivElement | null | undefined;

  @computed
  get styles() {
    const { dimenStore } = AppStore.instance();
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0px 0px 0px 20px",
      },
      title: {
        color: palettes.textColors.Ink,
        fontSize: 15,
        cursor: "default",
        userSelect: "none",
        textAlign: "center",
        padding: "0px 10px 0px 0px",
      },
      datePicker: {
        display: "inline-flex",
        flexDirection: "row",
        width: !dimenStore.isSmallScreen ? "35%" : "90%",
      },
    });
  }

  render() {
    const {
      maxEndDate,
      onDateRangeChange,
      selectedEndDate,
      selectedStartDate,
    } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.title)}>View stats from </div>
        <div className={css(this.styles.datePicker)}>
          <DayRangePickerInput
            dayPickerProps={{
              showOutsideDays: true,
              disabledDays: (date: Date) => {
                const maxDate = new Date(maxEndDate);
                return date > maxDate;
              },
            }}
            inputProps={{
              height: 28,
            }}
            fromDate={selectedStartDate}
            toDate={selectedEndDate}
            onDayRangeChange={onDateRangeChange}
            disableBeforeStartDays
            noEdit
          />
        </div>
      </div>
    );
  }
}

export default DateRange;
