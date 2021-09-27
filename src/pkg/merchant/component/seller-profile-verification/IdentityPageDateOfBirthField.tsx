import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import _ from "lodash";

import { Select, DayPickerInput, Field } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import LocalizationStore from "@merchant/stores/LocalizationStore";

type IdentityPageDateOfBirthFieldProps = BaseProps & {
  readonly birthDay: Date | null;
  readonly onBirthDayChange: (day: Date) => void;
  readonly birthYear: number | null;
  readonly onBirthYearChange: (year: number) => void;
};

const IdentityPageDateOfBirthField = (
  props: IdentityPageDateOfBirthFieldProps
) => {
  const { birthDay, onBirthDayChange, birthYear, onBirthYearChange } = props;

  const styles = useStylesheet();

  const currYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () =>
      _.range(currYear - 10, currYear - 100, -1).map((v) => {
        return {
          value: v,
          text: String(v),
        };
      }),
    [currYear]
  );

  const { locale } = LocalizationStore.instance();

  return (
    <div className={css(styles.root)}>
      <Field title={i`Birthday`}>
        <DayPickerInput
          alignRight
          noEdit
          cannotSelectFuture={false}
          displayFormat={"DD/MM"}
          onDayChange={onBirthDayChange}
          dayPickerProps={{
            fromMonth: new Date(currYear, 0),
            toMonth: new Date(currYear, 11),
            selectedDays: [birthDay],
            hideYear: true,
          }}
          locale={locale}
        />
      </Field>
      <Field title={i`Birth Year`}>
        <Select
          minWidth={150}
          placeholder={i`YYYY`}
          selectedValue={birthYear}
          options={yearOptions}
          buttonHeight={40}
          onSelected={onBirthYearChange}
          position="bottom center"
        />
      </Field>
    </div>
  );
};

export default IdentityPageDateOfBirthField;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 16,
        },
      }),
    []
  );
};
