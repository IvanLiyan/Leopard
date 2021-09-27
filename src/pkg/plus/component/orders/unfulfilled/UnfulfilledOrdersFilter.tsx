import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useStringArrayQueryParam } from "@toolkit/url";
import { wishExpressTruck } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
export type UnfulfilledOrdersFilterType = "wish_express" | "none";

type Props = BaseProps & {};

const UnfulfilledOrdersFilter: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const [filters, setFilters] = useStringArrayQueryParam("filters");

  return (
    <div className={css(styles.root, className, style)}>
      <section className={css(styles.title)}>Filter by</section>
      <CheckboxField
        title={i`Wish Express`}
        icon={wishExpressTruck}
        onChange={(checked) => {
          setFilters(checked ? ["wish_express"] : []);
        }}
        checked={filters.includes("wish_express")}
      />
    </div>
  );
};

export default observer(UnfulfilledOrdersFilter);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        title: {
          color: textBlack,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
      }),
    [textBlack]
  );
};
