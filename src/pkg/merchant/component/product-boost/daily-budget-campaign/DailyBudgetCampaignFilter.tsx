import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { CheckboxGroupField } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ProductPromotionStatus } from "@schema/types";

type DailyBudgetCampaignFilterProps = BaseProps & {
  readonly productStateFilter: ReadonlyArray<ProductPromotionStatus>;
  readonly setProductStateFilter: (
    states: ReadonlyArray<ProductPromotionStatus>
  ) => void;
};

const DailyBudgetCampaignFilter = (props: DailyBudgetCampaignFilterProps) => {
  const styles = useStyleSheet();
  const { productStateFilter, setProductStateFilter, className } = props;
  const [localProductStateFilter, setLocalProductStateFilter] = useState(
    productStateFilter
  );
  const hasActiveFilters = localProductStateFilter.length > 0;

  const productState = [
    {
      value: "ACTIVE",
      title: i`Active`,
    },
    {
      value: "INACTIVE",
      title: i`Inactive`,
    },
    {
      value: "OUT_OF_BALANCE",
      title: i`Insufficient Balance`,
    },
  ];

  const productStateFilterBody = (
    <CheckboxGroupField
      className={css(styles.filter, styles.body)}
      title={i`Product State`}
      options={productState}
      onChecked={(option: OptionType<ProductPromotionStatus>) => {
        const state = option.value;
        if (localProductStateFilter.includes(state)) {
          setLocalProductStateFilter(
            localProductStateFilter.filter((s) => s !== state)
          );
        } else {
          setLocalProductStateFilter([...localProductStateFilter, state]);
        }
      }}
      selected={localProductStateFilter}
    />
  );

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.header)}>
        <section className={css(styles.title)}>Product Filters</section>
      </div>

      {productStateFilterBody}

      <div className={css(styles.footer)}>
        <Button
          onClick={() => {
            setLocalProductStateFilter([]);
            setProductStateFilter([]);
          }}
          disabled={!hasActiveFilters}
          style={styles.cancelButton}
        >
          Deselect all
        </Button>
        <PrimaryButton
          onClick={() => setProductStateFilter([...localProductStateFilter])}
          className={css(styles.applyButton)}
        >
          Apply filters
        </PrimaryButton>
      </div>
    </div>
  );
};

const useStyleSheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
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
          color: textBlack,
          fontSize: 20,
          height: 28,
          cursor: "default",
          userSelect: "none",
          alignSelf: "center",
          textAlign: "center",
        },
        filter: {
          margin: 16,
        },
        cancelButton: {
          textColor: textDark,
          margin: 4,
          borderRadius: 3,
        },
        applyButton: {
          margin: 4,
        },
      }),
    [textDark, textBlack]
  );
};

export default observer(DailyBudgetCampaignFilter);
