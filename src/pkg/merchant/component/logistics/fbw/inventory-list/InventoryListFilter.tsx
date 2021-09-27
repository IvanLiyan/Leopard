import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { FilterButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

import { CheckboxGroupField } from "@ContextLogic/lego";
import { useStringArrayQueryParam } from "@toolkit/url";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";

export type FilterType =
  | "not-removed"
  | "removed"
  | "in-stock"
  | "product-shipping-price-not-set";

export type FilterCredential = {
  readonly title: string;
  readonly queryParamKey: string;
  readonly options: ReadonlyArray<OptionType<FilterType>>;
};

export type InventoryListFilterProp = BaseProps & {
  readonly onDeselectAllClicked: () => unknown;
  readonly filterCredentials: ReadonlyArray<FilterCredential>;
};

type InventoryListFilterItemProp = BaseProps & {
  readonly options: ReadonlyArray<OptionType<FilterType>>;
  readonly title: string;
  readonly queryParamKey: string;
};

const InventoryListFilterItem = observer(
  (props: InventoryListFilterItemProp) => {
    const styles = useStyleSheet();
    const { title, queryParamKey, options } = props;

    const [selected, setSelected] = useStringArrayQueryParam(queryParamKey);
    return (
      <CheckboxGroupField
        className={css(styles.filter)}
        title={title}
        options={options}
        selected={selected}
        onChecked={({ value }) => {
          const selectedSet = new Set(selected);
          if (selectedSet.has(value)) {
            selectedSet.delete(value);
          } else {
            selectedSet.add(value);
          }
          setSelected(Array.from(selectedSet));
        }}
      />
    );
  },
);

const InventoryListFilter = (props: InventoryListFilterProp) => {
  const styles = useStyleSheet();
  const { onDeselectAllClicked, filterCredentials } = props;

  return (
    <Popover
      popoverContent={() => (
        <div className={css(styles.root)}>
          <div className={css(styles.header)}>
            <section className={css(styles.title)}>All filters</section>
            <Button
              onClick={onDeselectAllClicked}
              disabled={false}
              style={{
                padding: "7px 0px",
                color: palettes.textColors.DarkInk,
                borderColor: palettes.textColors.White,
              }}
            >
              Deselect all
            </Button>
          </div>
          <div className={css(styles.body)}>
            {filterCredentials.map((credential) => (
              <div key={credential.title}>
                <InventoryListFilterItem
                  title={credential.title}
                  queryParamKey={credential.queryParamKey}
                  options={credential.options}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      position="bottom right"
      contentWidth={300}
    >
      <FilterButton className={css(styles.filterButton)} />
    </Popover>
  );
};

export default observer(InventoryListFilter);

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
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          height: 28,
          cursor: "default",
          userSelect: "none",
          alignSelf: "center",
          textAlign: "center",
        },
        filterButton: {
          alignSelf: "stretch",
        },
      }),
    [],
  );
};
