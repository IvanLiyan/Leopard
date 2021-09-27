import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useStringEnumArrayQueryParam } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

import { ProductPromotionStatus } from "@schema/types";

type Props = BaseProps & {};

const BoostedProductsFilter: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const [statuses, setStatuses] =
    useStringEnumArrayQueryParam<ProductPromotionStatus>("statuses");

  const addStatus = (status: ProductPromotionStatus) => {
    if (statuses.includes(status)) {
      return;
    }
    setStatuses([...statuses, status]);
  };

  const removeStatus = (status: ProductPromotionStatus) => {
    if (!statuses.includes(status)) {
      return;
    }
    setStatuses(statuses.filter((_status) => _status != status));
  };

  const setStatus = (status: ProductPromotionStatus, enabled: boolean) => {
    if (enabled) {
      addStatus(status);
    } else {
      removeStatus(status);
    }
  };

  return (
    <div className={css(styles.root, className, style)}>
      <section className={css(styles.title)}>Filter by</section>
      <CheckboxField
        title={i`Ongoing`}
        onChange={(checked) => setStatus("ACTIVE", checked)}
        checked={statuses.includes("ACTIVE")}
        className={css(styles.filter)}
      />
      <CheckboxField
        title={i`Inactive`}
        onChange={(checked) => setStatus("INACTIVE", checked)}
        checked={statuses.includes("INACTIVE")}
        className={css(styles.filter)}
      />
      <CheckboxField
        title={i`Pending`}
        onChange={(checked) => setStatus("OUT_OF_BALANCE", checked)}
        checked={statuses.includes("OUT_OF_BALANCE")}
        className={css(styles.filter)}
      />
    </div>
  );
};

export default observer(BoostedProductsFilter);

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
        filter: {
          margin: "5px 0px",
        },
      }),
    [textBlack],
  );
};
