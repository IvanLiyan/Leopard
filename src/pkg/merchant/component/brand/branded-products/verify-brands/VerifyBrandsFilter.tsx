import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useIntQueryParam, useStringArrayQueryParam } from "@toolkit/url";
import * as fonts from "@toolkit/fonts";

import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";

/* Relative Imports */
import VerifyBrandsDaysLeft, {
  daysLeftValueToText,
} from "./VerifyBrandsDaysLeft";

type VerifyBrandsFilterProps = BaseProps;

const VerifyBrandsFilter = (props: VerifyBrandsFilterProps) => {
  const { className } = props;
  const styles = useStylesheet();

  const [, setOffset] = useIntQueryParam("offset");
  const [daysLeft, setDaysLeft] = useStringArrayQueryParam(
    "days_left_to_verify"
  );

  const onDaysLeftToggled = ({ value }: OptionType<string>) => {
    const daysLeftSet = new Set(daysLeft || []);
    if (daysLeftSet.has(value)) {
      daysLeftSet.delete(value);
    } else {
      daysLeftSet.add(value);
    }
    setOffset(0);
    setDaysLeft(Array.from(daysLeftSet));
  };

  const options = Object.entries(daysLeftValueToText).map(([value]) => {
    return {
      key: value,
      value,
      title: () => (
        <VerifyBrandsDaysLeft
          daysLeftValue={value}
          style={{ fontWeight: fonts.weightNormal, width: "100%" }}
        />
      ),
    };
  });

  return (
    <div className={css(styles.root, className)}>
      <section className={css(styles.titleControl)}>
        <div className={css(styles.title)}>Filter by</div>
      </section>
      <section className={css(styles.filters)}>
        <div className={css(styles.singleFilter)}>
          <label>Days left to verify</label>
          <CheckboxGroupField
            className={css(styles.checkGroupField)}
            options={options}
            onChecked={onDaysLeftToggled}
            selected={daysLeft || []}
          />
        </div>
      </section>
    </div>
  );
};

export default observer(VerifyBrandsFilter);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        titleControl: {
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
        },
        title: {
          color: textDark,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        checkGroupField: {
          marginLeft: 20,
        },
        filters: {
          display: "flex",
          flexDirection: "row",
          paddingBottom: 10,
          paddingRight: 10,
        },
        singleFilter: {
          display: "flex",
          flexDirection: "row",
        },
      }),
    [textDark]
  );
};
