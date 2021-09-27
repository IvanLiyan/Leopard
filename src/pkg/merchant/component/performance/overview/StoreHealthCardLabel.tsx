import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { H4, H6, Info, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Type Imports */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

type Props = BaseProps & {
  readonly label: string;
  readonly value?: number | string | null;
  readonly aboveThreshold?: boolean;
  readonly tooltipText?: string;
};

const StoreHealthCardLabel = (props: Props) => {
  const {
    className,
    style,
    label,
    value,
    aboveThreshold = false,
    tooltipText,
  } = props;
  const styles = useStylesheet();

  return (
    <div
      className={css(
        styles.stat,
        aboveThreshold && styles.hasIcon,
        className,
        style
      )}
    >
      <div className={css(styles.title)}>
        {aboveThreshold && (
          <Icon name="errorFilledRed" className={css(styles.statIcon)} />
        )}
        <Layout.FlexRow>
          <H6 className={css(styles.label)}>{label}</H6>
          {tooltipText != null && <Info text={tooltipText} sentiment="info" />}
        </Layout.FlexRow>
      </div>
      <H4>{value != null ? value : "--"}</H4>
    </div>
  );
};

export default StoreHealthCardLabel;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          display: "flex",
          flexFlow: "row",
          alignItems: "center",
        },
        icon: {
          marginRight: 10,
        },
        hasIcon: {
          paddingLeft: 8,
        },
        statIcon: {
          width: 16,
          paddingRight: 8,
        },
        stat: {
          display: "flex",
          justifyContent: "space-between",
          ":not(:last-child)": {
            marginBottom: 26,
          },
          paddingLeft: 32,
        },
        label: {
          marginRight: 6,
        },
      }),
    []
  );
};
