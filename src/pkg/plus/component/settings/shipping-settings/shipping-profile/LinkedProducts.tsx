/*
 *
 * LinkedProducts.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 10/9/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import {
  LoadingIndicator,
  TextInputWithSelect,
  PageIndicator,
  SimpleSelect,
} from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import searchImg from "@assets/img/search.svg";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { ProductSearchType } from "@schema/types";
import { Option } from "@ContextLogic/lego";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { PickedProductType } from "@toolkit/shipping-settings-v2";
import { CellInfo } from "@ContextLogic/lego";
import ProductImage from "@merchant/component/products/ProductImage";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const InputHeight = 30;
const PageLimitOptions = [10, 50, 100, 250];

const SearchOptions: ReadonlyArray<Option<ProductSearchType>> = [
  {
    value: "NAME",
    text: i`Product name`,
  },
  {
    value: "ID",
    text: i`Product ID`,
  },
  {
    value: "SKU",
    text: i`Product SKU`,
  },
];

const Placeholders: { [searchType in ProductSearchType]: string } = {
  ID: i`Enter a product id`,
  NAME: i`Enter a product name`,
  SKU: i`Enter a product sku`,
};

type Props = BaseProps & {
  readonly profileId: string;
  readonly onClose: () => void;
};

const LinkedProducts = ({ profileId, onClose }: Props) => {
  const [searchType, setSearchType] = useState<ProductSearchType>("NAME");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PageLimitOptions[0]);
  const [offset, setOffset] = useState(0);

  const debouncedQuery = useDebouncer(query, 800);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  // ----------------------------------------------
  // GQL goes here
  const products: ReadonlyArray<PickedProductType> = [];
  const productCount: number = products.length;
  const isLoadingProducts: boolean = false;
  // To here
  // ----------------------------------------------

  const styles = useStylesheet({ isLoadingProducts });

  const searchProductIdDebugValue: string | undefined =
    products != null && products.length > 0 ? products[0].id : undefined;

  const searchProductNameDebugValue: string | undefined =
    products != null && products.length > 0 ? products[0].name : undefined;

  const searchDebugValues: {
    [searchType in ProductSearchType]: string | undefined;
  } = {
    ID: searchProductIdDebugValue,
    NAME: searchProductNameDebugValue,
    SKU: undefined, // Requires variations, so don't load more data for a debug
  };
  return (
    <>
      <div className={css(styles.content)}>
        <div className={css(styles.controlsRow)}>
          <TextInputWithSelect
            className={css(styles.search)}
            selectProps={{
              selectedValue: searchType,
              options: SearchOptions,
              onSelected(item: ProductSearchType) {
                setSearchType(item);
              },
            }}
            textInputProps={{
              style: {
                flexGrow: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
              icon: searchImg,
              placeholder: Placeholders[searchType],
              noDuplicateTokens: true,
              maxTokens: 1,
              value: query,
              height: InputHeight,
              onChange({ text }) {
                setQuery(text);
                setOffset(0);
              },
              debugValue: searchDebugValues[searchType],
            }}
          />
          <div className={css(styles.rightControls)}>
            <PageIndicator
              style={css(styles.pageIndicator)}
              isLoading={isLoadingProducts}
              totalItems={productCount}
              rangeStart={offset + 1}
              rangeEnd={
                productCount ? Math.min(productCount, offset + limit) : 0
              }
              hasNext={productCount ? offset + limit < productCount : false}
              hasPrev={offset >= limit}
              currentPage={Math.ceil(offset / limit)}
              onPageChange={onPageChange}
            />
            <SimpleSelect
              className={css(styles.limitSelect)}
              options={PageLimitOptions.map((v) => ({
                value: v.toString(),
                text: v.toString(),
              }))}
              onSelected={(item: string) => {
                setLimit(parseInt(item));
                setOffset(0);
              }}
              selectedValue={limit.toString()}
            />
          </div>
        </div>
        {isLoadingProducts ? (
          <LoadingIndicator />
        ) : (
          <Table
            data={products || []}
            className={css(styles.table)}
            cellPadding="20px"
          >
            <Table.Column title={i`Product`} columnKey="id" width={450}>
              {({
                row,
              }: CellInfo<
                PickedProductType["id" | "name"],
                PickedProductType
              >) => (
                <div className={css(styles.productCell)}>
                  <Link
                    className={css(styles.productCellContent)}
                    href={`/plus/products/edit/${row.id}`}
                    openInNewTab
                  >
                    <ProductImage
                      productId={row.id}
                      className={css(styles.productCellImage)}
                    />
                    <div className={css(styles.productCellName)}>
                      {row.name}
                    </div>
                  </Link>
                </div>
              )}
            </Table.Column>
            <Table.NumeralColumn
              title={i`Variations`}
              columnKey="variationCount"
              align="right"
            />
            <Table.Column
              title={i`Available for sale`}
              columnKey="enabled"
              align="center"
              width={130}
            >
              {({
                row: product,
              }: CellInfo<PickedProductType["enabled"], PickedProductType>) =>
                product.enabled ? (
                  <Icon name="checkFilledGreen2" />
                ) : (
                  <Icon name="redX" />
                )
              }
            </Table.Column>
          </Table>
        )}
      </div>
      <div className={css(styles.footer)}>
        <PrimaryButton
          popoverStyle={css(styles.footerButton)}
          className={css(styles.footerButtonInside)}
          onClick={onClose}
        >
          Done
        </PrimaryButton>
      </div>
    </>
  );
};

const useStylesheet = ({
  isLoadingProducts,
}: {
  readonly isLoadingProducts: boolean;
}) => {
  const { borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          maxHeight: 535,
        },
        controlsRow: {
          display: "flex",
          alignItems: "stretch",
          padding: 24,
          height: 40,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        },
        pageIndicator: {
          marginRight: 8,
        },
        rightControls: {
          display: "flex",
        },
        search: {
          flex: 1,
          "@media (min-width: 900px)": {
            maxWidth: 385,
          },
        },
        table: {
          opacity: isLoadingProducts ? 0.7 : 1,
        },
        limitSelect: {
          height: "100%",
          width: 50,
          minWidth: 40, // required since some browsers treat flex-basis: 0% as width (included in flex 0)
          textAlignLast: "center", // `last` required for <select>, see https://stackoverflow.com/questions/45215504/text-align-not-working-on-select-control-on-chrome/45215594
          flex: 0,
        },
        productCell: {
          display: "flex",
          alignItems: "center",
          margin: "12px 0px",
          maxWidth: "100%",
        },
        productCellImage: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        productCellContent: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
        },
        productCellName: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        footer: {
          display: "flex",
          alignSelf: "stretch",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${borderPrimary}`,
          backgroundColor: surfaceLightest,
          left: 0,
          right: 0,
          bottom: 0,
          height: 88,
        },
        footerButton: {
          height: 40,
          flexGrow: 1,
          maxWidth: 200,
        },
        footerButtonInside: {
          height: "100%",
          boxSizing: "border-box",
        },
      }),
    [isLoadingProducts, borderPrimary, surfaceLightest]
  );
};
export default LinkedProducts;
