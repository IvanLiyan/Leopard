import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { Checkbox } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold, proxima } from "@toolkit/fonts";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

type CampaignPerformanceFilterProps = BaseProps;

type FilterSearchBarProps = BaseProps & {
  readonly onSearchFieldChanged: (arg0: OnTextChangeEvent) => unknown;
  readonly searchValue: string;
};

type FilterProductsProps = BaseProps & {
  readonly productIds: ReadonlyArray<string>;
};

type ProductContentProps = BaseProps & {
  readonly productId: string;
};

const ProductPopoverContent = (props: ProductContentProps) => {
  const { productId } = props;
  const styles = useStylesheet();

  const { productStore } = AppStore.instance();
  const product = productStore.getProduct(productId);

  return (
    <div className={css(styles.popover)}>
      {product && (
        <div className={css(styles.infoContainer)}>
          <div className={css(styles.infoHeader)}>Product Name</div>
          <div className={css(styles.infoBody)}>{product.name}</div>
        </div>
      )}
      <div className={css(styles.infoContainer)}>
        <div className={css(styles.infoHeader)}>Product ID</div>
        <CopyButton
          className={css({ maxWidth: 180 })}
          text={productId}
          prompt={i`Copy ID`}
          copyOnBodyClick={false}
        >
          <div className={css(styles.infoIdBody)}>{productId}</div>
        </CopyButton>
      </div>
    </div>
  );
};

const FilterProduct = observer((props: ProductContentProps) => {
  const { productId } = props;
  const styles = useStylesheet();

  const { campaignsPerformanceFilters } = AppStore.instance().productBoostStore;
  const isSelected = campaignsPerformanceFilters.productIds.includes(productId);

  return (
    <div
      key={`performance_filter_option_${productId}`}
      className={css(styles.option)}
      onClick={() => {
        const filterSet = new Set(campaignsPerformanceFilters.productIds);
        if (filterSet.has(productId)) {
          filterSet.delete(productId);
        } else {
          filterSet.add(productId);
        }
        campaignsPerformanceFilters.productIds = Array.from(filterSet);
      }}
    >
      <Popover
        position="left"
        popoverMaxWidth={270}
        popoverContent={() => <ProductPopoverContent productId={productId} />}
      >
        <ProductImage className={css(styles.image)} productId={productId} />
      </Popover>
      <Checkbox
        className={css(styles.checkbox)}
        checked={isSelected}
        size={12}
      />
    </div>
  );
});

const FilterProducts = (props: FilterProductsProps) => {
  const { productIds } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.options)}>
      {productIds.map((id) => (
        <FilterProduct productId={id} />
      ))}
    </div>
  );
};

const FilterSearchBar = (props: FilterSearchBarProps) => {
  const styles = useStylesheet();
  const { onSearchFieldChanged, searchValue } = props;

  return (
    <div className={css(styles.searchContainer)}>
      <TextInput
        className={css({ width: 390 })}
        icon="search"
        placeholder={i`Search by ID`}
        height={48}
        onChange={onSearchFieldChanged}
        value={searchValue}
      />
    </div>
  );
};

const FilterHeader = () => {
  const styles = useStylesheet();
  const { campaignsPerformanceFilters } = AppStore.instance().productBoostStore;
  const { deselectAllFilters, hasActiveFilters } = campaignsPerformanceFilters;

  return (
    <div className={css(styles.header)}>
      <section className={css(styles.title)}>Filter by product</section>
      {hasActiveFilters && (
        <Button
          onClick={deselectAllFilters}
          disabled={false}
          hideBorder
          style={{
            color: palettes.textColors.DarkInk,
            backgroundColor: palettes.textColors.White,
            padding: "7px 5px",
          }}
        >
          Deselect all
        </Button>
      )}
    </div>
  );
};

const FilterBody = () => {
  const [searchValue, setSearchValue] = useState("");

  const styles = useStylesheet();

  const { productBoostStore } = AppStore.instance();
  const { currentCampaign } = productBoostStore;
  const campaignProductsIds =
    !currentCampaign || !currentCampaign.products
      ? []
      : currentCampaign.products.map((p) => p.id);

  const filteredProductsIds = campaignProductsIds.filter((id) =>
    id.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={css(styles.body)}>
      <FilterSearchBar
        onSearchFieldChanged={({ text }: OnTextChangeEvent) => {
          setSearchValue(text);
        }}
        searchValue={searchValue}
      />
      <FilterProducts productIds={filteredProductsIds} />
    </div>
  );
};

const CampaignPerformanceFilter = (props: CampaignPerformanceFilterProps) => {
  const styles = useStylesheet();
  const { className } = props;

  return (
    <div className={css(styles.root, className)}>
      <FilterHeader />
      <FilterBody />
    </div>
  );
};

export default CampaignPerformanceFilter;

const useStylesheet = () => {
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
          padding: "20px 24px 10px 24px",
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          height: 20,
          cursor: "default",
          userSelect: "none",
          alignSelf: "center",
          textAlign: "center",
        },
        body: {
          flexWrap: "wrap",
          overflow: "hidden",
          maxHeight: 689,
          padding: "0px 19px 0px 18px",
        },
        searchContainer: {
          display: "flex",
          flexDirection: "row",
          padding: "0px 4px 20px 4px",
        },
        options: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          overflowY: "scroll",
          overflowX: "hidden",
          cursor: "pointer",
          maxHeight: 570,
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 450,
          userSelect: "none",
        },
        option: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px 4px 30px 4px",
        },
        image: {
          display: "flex",
          width: 70,
          height: 70,
          alignItems: "center",
        },
        checkbox: {
          display: "flex",
          marginTop: 15,
          alignItems: "center",
        },
        popover: {
          display: "flex",
          flexDirection: "column",
        },
        infoContainer: {
          maxWidth: 200,
          margin: "20px",
          display: "flex",
          flexDirection: "column",
        },
        infoHeader: {
          color: palettes.textColors.Ink,
          fontSize: 12,
          fontWeight: weightBold,
        },
        infoBody: {
          fontSize: 12,
        },
        infoIdBody: {
          fontSize: 12,
          color: palettes.coreColors.DarkWishBlue,
          fontFamily: proxima,
        },
      }),
    []
  );
};
