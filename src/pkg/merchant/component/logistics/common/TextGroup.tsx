import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

export type TextGroupProp = {
  readonly title: string;
  readonly values: ReadonlyArray<ReactNode>;
};

const TextGroup = (props: TextGroupProp) => {
  const styles = useStyleSheet();
  const { title, values } = props;
  return (
    <div className={css(styles.textGroup)}>
      <div className={css(styles.textGroupTitle)}>{title}</div>
      <div>
        {values.map((value, index) => {
          return (
            // There is no better key here, have to use index.
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={css(styles.textGroupValues)}>
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default observer(TextGroup);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        textGroup: {
          display: "flex",
          flexDirection: "row",
          margin: "5px 0px",
        },
        textGroupTitle: {
          maxWidth: 200,
          minWidth: 160,
          fontSize: 14,
          fontWeight: fonts.weightSemibold,
          textAlign: "left",
          paddingLeft: 14,
        },
        textGroupValues: {
          display: "block",
          fontSize: 14,
          fontWeight: fonts.weightMedium,
        },
      }),
    []
  );
};
