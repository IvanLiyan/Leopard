import React, { useEffect, useMemo, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  Table,
  CellInfo,
  Text,
  Layout,
  CurrencyInput,
  NumericInput,
  Link,
  Checkbox,
  ObjectId,
  Spinner,
  Popover,
  LoadingIndicator,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  PickedProduct,
  getProductState,
  getProductBadges,
  AllProductsTableEntry,
  AllProductsTableData,
  productHasVariations,
  getVariationInventory,
  GetProductVariationsResponseType,
  GetProductVariationsRequestType,
  GET_PRODUCT_VARIATIONS_QUERY,
  COLLAPSED_VARIATIONS_SHOWN,
  PickedVariation,
  LEGACY_COLOR_DISPLAY_TEXT,
  LEGACY_SIZE_DISPLAY_TEXT,
} from "@all-products/toolkit";
import ProductStateLabel from "./ProductStateLabel";
import ProductTableColumnHeader from "./ProductTableColumnHeader";
import ProductDataCell from "./ProductDataCell";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import { PaymentCurrencyCode } from "@schema";
import { zendeskURL } from "@core/toolkit/url";
import { merchFeURL } from "@core/toolkit/router";
import ClickableProductImage from "./ClickableProductImage";
import AllProductsState from "@all-products/AllProductsState";
import Icon from "@core/components/Icon";
import ProductTableActions from "./ProductTableActions";
import Image from "@core/components/Image";
import { useSortBy, useSortOrder } from "@all-products/stateHooks";
import { useQuery } from "@apollo/client";
import { useDeciderKey } from "@core/stores/ExperimentStore";

type Props = BaseProps & {
  readonly state: AllProductsState;
  readonly isSubmitting: boolean;
  readonly products: ReadonlyArray<PickedProduct>;
  readonly onRefetchProducts: () => unknown;
};

const NO_DATA_MESSAGE = "--";

const ProductTable: React.FC<Props> = ({
  className,
  style,
  isSubmitting,
  state,
  products: initialProducts,
  onRefetchProducts,
}) => {
  const styles = useStylesheet();
  const { surfaceLighter, textLight, primary, negative } = useTheme();
  const [products, setProducts] =
    useState<ReadonlyArray<PickedProduct>>(initialProducts);
  const [expandedProducts, setExpandedProducts] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [sortBy, setSortBy] = useSortBy();
  const [sortOrder, setSortOrder] = useSortOrder();

  const [productIdQuery, setProductIdQuery] = useState<string | undefined>();
  const [variationCountQuery, setVariationCountQuery] = useState<
    number | undefined
  >();

  const {
    decision: showVariationGroupingUI,
    isLoading: isLoadingVariationGroupingDecision,
  } = useDeciderKey("variation_grouping_ui");
  const {
    decision: showCategoryUpdates,
    isLoading: isLoadingCategoryUpdatesDecision,
  } = useDeciderKey("taxonomy_category_updates_04_2023");

  const {
    warehouse,
    isPrimaryWarehouse,
    initialData: { currentMerchant: merchant },
  } = state;

  const { data: allProductVariationsData, loading: loadingProductVariations } =
    useQuery<GetProductVariationsResponseType, GetProductVariationsRequestType>(
      GET_PRODUCT_VARIATIONS_QUERY,
      {
        variables: {
          query: productIdQuery,
          limit: variationCountQuery,
        },
        skip: productIdQuery == null || variationCountQuery == null,
        fetchPolicy: "no-cache",
      },
    );

  const allProductVariations = useMemo(
    () =>
      allProductVariationsData?.productCatalog?.productsV2
        ? allProductVariationsData?.productCatalog?.productsV2[0].variations
        : [],
    [allProductVariationsData],
  );

  const inventoryColumnName = useMemo(() => {
    if (isPrimaryWarehouse) {
      return ci18n(
        "Column name in product table. This column shows each product or variation's inventory. The user can also edit this inventory inline in the table. Primary means this is the inventory in the merchants primary warehouse",
        "Primary Inventory",
      );
    }

    const countryCode = warehouse.address?.country.code;
    if (countryCode == null) {
      return ci18n(
        "Column name in product table. This column shows each product or variation's inventory. The user can also edit this inventory inline in the table. Secondary means this is the inventory in one of the merchant's secondary warehouses",
        "Secondary Inventory",
      );
    }

    return ci18n(
      "Column name in product table. This column shows each product or variation's inventory. The user can also edit this inventory inline in the table. Secondary means this is the inventory in one of the merchant's secondary warehouses",
      "{%1=2 character country code} Secondary Inventory",
      countryCode,
    );
  }, [isPrimaryWarehouse, warehouse]);

  useEffect(() => {
    const newProducts = products.reduce<Array<PickedProduct>>(
      (acc, product) => {
        const allVariations =
          productIdQuery === product.id && !loadingProductVariations
            ? allProductVariations
            : product.variations;

        const newProduct = {
          ...product,
          variations: allVariations,
        };
        acc.push(newProduct);
        return acc;
      },
      [],
    );

    setProducts(newProducts);

    // products is required by the linter here but it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdQuery, allProductVariations, loadingProductVariations]);

  const tableData: AllProductsTableData = useMemo(() => {
    return products.reduce<Array<AllProductsTableEntry>>((acc, product) => {
      if (product.variations.length == 0) {
        return acc;
      }

      if (!productHasVariations(product)) {
        acc.push({
          id: product.id,
          type: "PRODUCT",
          product,
        });

        return acc;
      }

      const newEntries: Array<AllProductsTableEntry> = [];
      newEntries.push({
        id: product.id,
        type: "PRODUCT",
        product,
      });

      const isExpanded = expandedProducts.has(product.id);

      (isExpanded
        ? product.variations
        : product.variations.slice(0, COLLAPSED_VARIATIONS_SHOWN)
      ).forEach((variation) => {
        newEntries.push({
          id: variation.id,
          type: "VARIATION",
          product,
          variation,
        });
      });

      if (product.variationCount > COLLAPSED_VARIATIONS_SHOWN) {
        newEntries.push({
          type: "VARIATION_EXPAND_ROW",
          id: product.id,
          variationCount: product.variationCount,
          open: isExpanded,
        });
      }

      acc.push(...newEntries);
      return acc;
    }, []);
  }, [products, expandedProducts]);

  useEffect(() => {
    // collapse all variations
    state.resetProducts = () => {
      setProductIdQuery(undefined);
      setVariationCountQuery(undefined);
      setExpandedProducts(new Set());
      setProducts(initialProducts);
    };

    return () => {
      state.resetProducts = () => {
        return;
      };
    };
  }, [state, initialProducts]);

  const fetchAllVariations = (productId: string, variationsCount: number) => {
    setProductIdQuery(productId);
    setVariationCountQuery(variationsCount);
  };

  const getVariationOptions = (
    variation: PickedVariation,
  ): ReadonlyArray<{ name: string; value: string }> => {
    const options = [];

    if (variation.color != null) {
      options.push({
        name: LEGACY_COLOR_DISPLAY_TEXT,
        value: variation.color,
      });
    }

    if (variation.size != null) {
      options.push({
        name: LEGACY_SIZE_DISPLAY_TEXT,
        value: variation.size,
      });
    }

    if (variation.options && variation.options.length > 0) {
      variation.options.forEach((option) => {
        options.push({
          name: option.name,
          value:
            option.value.length > 0 ? option.value.join(",") : NO_DATA_MESSAGE,
        });
      });
    }

    return options;
  };

  if (isLoadingCategoryUpdatesDecision || isLoadingVariationGroupingDecision) {
    return <LoadingIndicator />;
  }

  return (
    <Table
      style={[className, style]}
      data={tableData}
      hideBorder
      cellPadding="16px 24px"
      maxVisibleColumns={15}
      rowDataCy={(row: AllProductsTableEntry) => {
        if (row.type === "VARIATION") {
          return `variation_${row.variation.sku}`;
        }
        if (row.type === "PRODUCT") {
          return `product_${row.product.id}`;
        }

        return `variation_expand_row`;
      }}
      rowStyle={({ row }: { readonly row: AllProductsTableEntry }) => {
        if (row.type == "VARIATION_EXPAND_ROW") {
          return {
            backgroundColor: surfaceLighter,
            transition: "opacity 0.3s linear",
            cursor: "pointer",
            opacity: 1,
            ":hover": {
              opacity: 0.6,
            },
          };
        }
        if (row.type == "VARIATION") {
          return { backgroundColor: surfaceLighter };
        }

        return undefined;
      }}
      onClickRow={({ row }: { readonly row: AllProductsTableEntry }) => {
        if (row.type != "VARIATION_EXPAND_ROW" || loadingProductVariations) {
          return;
        }

        const newSet = new Set(expandedProducts);

        if (expandedProducts.has(row.id)) {
          newSet.delete(row.id);
        } else {
          newSet.add(row.id);
          fetchAllVariations(row.id, row.variationCount);
        }

        setExpandedProducts(newSet);
      }}
      // Row style is also applied on cells, causing a double-opacity decrease on
      // hover if this override is excluded
      cellStyle={() => ({
        ":hover": {
          opacity: 1,
        },
      })}
    >
      <Table.Column
        _key="img"
        columnDataCy="column_image"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product's image",
              "Image",
            )}
            titleDescription={i`Main image of the product`}
          />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (
            loadingProductVariations &&
            row.type !== "VARIATION" &&
            row.type !== "PRODUCT"
          ) {
            return <Spinner style={styles.variationExpandTextWrapper} />;
          }
          if (row.type == "VARIATION_EXPAND_ROW") {
            return (
              <Layout.FlexRow
                alignItems="center"
                justifyContent="flex-start"
                style={styles.variationExpandTextWrapper}
              >
                <Text weight="semibold" style={styles.variationExpandText}>
                  {row.open
                    ? ci18n(
                        "Text on a button that collapses a long list of variations in a table",
                        "Collapse variations",
                      )
                    : i`View all ${row.variationCount} variations`}
                </Text>
              </Layout.FlexRow>
            );
          }
          if (row.type == "VARIATION") {
            const url = row.variation.image?.wishUrl;
            if (url == null) {
              return null;
            }
            return (
              <Image
                className={css(styles.variationImage)}
                src={url}
                draggable={false}
                alt={row.variation.id}
                width={60}
                height={60}
              />
            );
          }
          return (
            <ClickableProductImage
              style={styles.productImage}
              productId={row.product.id}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        _key="name"
        columnDataCy="column_id"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product's name",
              "Product Name",
            )}
            titleDescription={i`Name of product as displayed to users`}
            subtitle={ci18n(
              "Column name in product table. This column shows each product's ID",
              "Product ID",
            )}
            subtitleDescription={i`Unique identifier of the product`}
          />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }
          if (row.type == "VARIATION") {
            return (
              <Layout.FlexColumn
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text style={styles.tableTextLight}>
                  {ci18n("Meaning a product variation", "Variation")}
                </Text>
                <Text style={[styles.variationText, styles.variationName]}>
                  {row.product.name}
                </Text>
              </Layout.FlexColumn>
            );
          }
          const badges = getProductBadges(row.product);
          return (
            <ProductDataCell
              style={styles.productCell}
              id={row.product.id}
              name={row.product.name}
              badges={badges}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        _key="category"
        columnDataCy="column_category"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product's category",
              "Category",
            )}
            titleDescription={i`The top level categorization of your product`}
          />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }

          if (row.type == "VARIATION" && showVariationGroupingUI) {
            const options = getVariationOptions(row.variation);
            return options.length > 0 ? (
              <Layout.FlexColumn
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text style={[styles.tableText, styles.options]}>
                  {options[0].name}
                </Text>
                <Text style={[styles.tableTextLight, styles.options]}>
                  {options[0].value}
                </Text>
              </Layout.FlexColumn>
            ) : (
              <Text style={styles.tableText}>{NO_DATA_MESSAGE}</Text>
            );
          }

          if (row.type == "VARIATION") {
            return (
              <Layout.FlexColumn
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text style={styles.tableText}>
                  {ci18n("As in the color of a product variation", "Color")}
                </Text>
                <Text style={styles.tableTextLight}>
                  {row.variation.color ?? NO_DATA_MESSAGE}
                </Text>
              </Layout.FlexColumn>
            );
          }

          if (showCategoryUpdates && row.product.subcategory != null) {
            const subcategory = row.product.subcategory;
            const categoryNamesAlongPath = subcategory.categoriesAlongPath.map(
              (category) => category.name,
            );
            return (
              <Popover
                popoverMaxWidth={320}
                popoverContent={
                  categoryNamesAlongPath.length > 0
                    ? categoryNamesAlongPath.join(" > ")
                    : undefined
                }
              >
                <Text style={[styles.tableText, styles.categories]}>
                  {subcategory.name}
                </Text>
              </Popover>
            );
          }

          return (
            <Text style={[styles.tableText, styles.categories]}>
              {row.product.categories == null ||
              row.product.categories.length == 0
                ? NO_DATA_MESSAGE
                : row.product.categories.map(({ name }) => name).join(", ")}
            </Text>
          );
        }}
      </Table.Column>
      <Table.Column
        _key="sales"
        columnDataCy="column_sales_wishes"
        columnKey="id"
        minWidth={110}
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product's number of sales",
              "Sales",
            )}
            titleDescription={i`The number of times this product has been sold`}
            subtitle={ci18n(
              "Column name in product table. This column shows each product's number of wishes",
              "Add to wishlist",
            )}
            subtitleDescription={i`The number of users who have added this product to a wishlist`}
          />
        )}
        sortOrder={sortBy == "SALES" ? sortOrder : "not-applied"}
        onSortToggled={async (order) => {
          await setSortBy(order == "not-applied" ? undefined : "SALES");
          await setSortOrder(order);
        }}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }

          if (row.type == "VARIATION" && showVariationGroupingUI) {
            const options = getVariationOptions(row.variation);
            return options.length > 1 ? (
              <Layout.FlexColumn
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text style={[styles.tableText, styles.options]}>
                  {options[1].name}
                </Text>
                <Text style={[styles.tableTextLight, styles.options]}>
                  {options[1].value}
                </Text>
              </Layout.FlexColumn>
            ) : (
              <Text style={styles.tableText}>{NO_DATA_MESSAGE}</Text>
            );
          }

          if (row.type == "VARIATION") {
            return (
              <Layout.FlexColumn
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text style={styles.tableText}>
                  {ci18n("As in the size of a product variation", "Size")}
                </Text>
                <Text style={styles.tableTextLight}>
                  {row.variation.size ?? NO_DATA_MESSAGE}
                </Text>
              </Layout.FlexColumn>
            );
          }
          return (
            <Layout.FlexColumn
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Text style={styles.tableText}>{row.product.sales}</Text>
              <Text style={styles.tableTextLight}>{row.product.wishes}</Text>
            </Layout.FlexColumn>
          );
        }}
      </Table.Column>
      <Table.Column
        _key="enabled"
        columnDataCy="column_enabled"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows if the product listing is enabled, and the user can toggle if the product is enabled on or off",
              "Listing Enabled",
            )}
          />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }

          const productState = getProductState(row.product).state;
          const productRemoved =
            productState == "REMOVED_BY_MERCHANT" ||
            productState == "REMOVED_BY_WISH";

          if (row.type == "VARIATION") {
            const { variation } = row;
            const localChange = state.isVariationEnabledLocally(variation.id);
            const value = (() => {
              if (localChange === undefined) {
                return variation.enabled || false;
              }

              return localChange;
            })();

            return (
              <Layout.FlexRow
                style={styles.checkboxWrapper}
                alignItems="center"
                justifyContent="center"
              >
                <Checkbox
                  checked={value}
                  onChange={(newState) => {
                    if (newState) {
                      state.enableVariation({
                        variation,
                        product: row.product,
                      });
                    } else {
                      state.disableVariation({
                        variation,
                        product: row.product,
                      });
                    }
                  }}
                  disabled={isSubmitting || productRemoved}
                />
                {localChange != null && (
                  <Icon
                    style={styles.enabledSaveIndicator}
                    name="save"
                    size={16}
                    color={textLight}
                  />
                )}
              </Layout.FlexRow>
            );
          }

          const { product } = row;
          const localChange = state.isProductEnabledLocally(product.id);
          const value = (() => {
            if (localChange === undefined) {
              return product.enabled || false;
            }

            return localChange;
          })();

          return (
            <Layout.FlexRow
              style={styles.checkboxWrapper}
              alignItems="center"
              justifyContent="center"
            >
              <Checkbox
                checked={value}
                onChange={(newState) => {
                  // 'Select all' functionality only enables the visible variations
                  const variations = expandedProducts.has(product.id)
                    ? product.variations
                    : product.variations.slice(0, COLLAPSED_VARIATIONS_SHOWN);

                  const newProduct = {
                    ...product,
                    variations,
                  };

                  if (newState) {
                    state.enableProduct({
                      product: newProduct,
                    });
                  } else {
                    state.disableProduct({
                      product: newProduct,
                    });
                  }
                }}
                disabled={isSubmitting || productRemoved}
              />
              {localChange != null && (
                <Icon
                  style={styles.enabledSaveIndicator}
                  name="save"
                  size={16}
                  color={textLight}
                />
              )}
            </Layout.FlexRow>
          );
        }}
      </Table.Column>
      <Table.Column
        _key="sku"
        columnDataCy="column_sku"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product or variation's parent SKU",
              "Parent SKU",
            )}
            subtitle={ci18n(
              "Column name in product table. This column shows each product or variation's SKU",
              "SKU",
            )}
          />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }
          if (row.type == "VARIATION") {
            const sku = row.variation.sku;

            return (
              <ObjectId
                style={[styles.tableTextLight, styles.sku]}
                id={sku}
                showFull
              />
            );
          }

          const parentSku = row.product.sku;

          if (parentSku == null) {
            return null;
          }
          return (
            <ObjectId
              style={[styles.tableText, styles.sku]}
              id={parentSku}
              showFull
            />
          );
        }}
      </Table.Column>
      <Table.Column
        _key="price"
        columnDataCy="column_price"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product or variation's price. The user can also edit this price inline in the table",
              "Price",
            )}
            titleDescription={i`The localized currency price of your product`}
          />
        )}
      >
        {({ row }: CellInfo<AllProductsTableEntry, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }

          const productState = getProductState(row.product).state;
          const productRemoved =
            productState == "REMOVED_BY_MERCHANT" ||
            productState == "REMOVED_BY_WISH";

          if (row.type == "PRODUCT" && productHasVariations(row.product)) {
            const minPriceVariation = minBy(
              row.product.variations,
              ({ price: { amount } }) => amount,
            );
            const maxPriceVariation = maxBy(
              row.product.variations,
              ({ price: { amount } }) => amount,
            );
            const priceDisplay = (() => {
              if (minPriceVariation == null && maxPriceVariation != null) {
                return maxPriceVariation.price.display;
              }
              if (minPriceVariation != null && maxPriceVariation == null) {
                return minPriceVariation.price.display;
              }
              if (minPriceVariation == null || maxPriceVariation == null) {
                return null;
              }
              if (
                minPriceVariation.price.display ==
                maxPriceVariation.price.display
              ) {
                return minPriceVariation.price.display;
              }
              return `${minPriceVariation.price.display} - ${maxPriceVariation.price.display}`;
            })();
            if (priceDisplay == null) {
              return null;
            }
            return <Text style={styles.tableText}>{priceDisplay}</Text>;
          }

          const variation =
            row.type == "VARIATION" ? row.variation : row.product.variations[0];

          const hasLocalChange = state.newVariationPrices.has(variation.id);

          const localChange = state.newVariationPrices.get(
            variation.id,
          )?.newPrice;

          const value = (() => {
            if (localChange === undefined) {
              return variation.price.amount;
            }

            return localChange === null ? null : localChange.amount;
          })();

          const hasError =
            hasLocalChange &&
            (localChange?.amount == null || localChange.amount < 0.01);

          const borderColor = (() => {
            if (localChange != null) {
              return hasError ? negative : primary;
            }
            return undefined;
          })();

          return (
            <CurrencyInput
              value={value}
              currencyCode={
                localChange == null
                  ? variation.price.currencyCode
                  : localChange.currencyCode
              }
              style={styles.priceInput}
              placeholder="0.00"
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) => {
                if (textAsNumber == variation.price.amount) {
                  state.newVariationPrices.delete(variation.id);
                  return;
                }
                state.newVariationPrices.set(variation.id, {
                  productId: variation.productId,
                  newPrice:
                    textAsNumber == null
                      ? null
                      : {
                          amount: textAsNumber,
                          currencyCode: (localChange == null
                            ? variation.price.currencyCode
                            : localChange.currencyCode) as PaymentCurrencyCode,
                        },
                });
              }}
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              disabled={isSubmitting || productRemoved}
              validationResponse={
                hasError ? i`Price must be greater than 0` : undefined
              }
              borderColor={borderColor}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        _key="inventory"
        columnDataCy="column_inventory"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={inventoryColumnName}
            titleDescription={i`Number of items the merchant can fulfill from this warehouse`}
          />
        )}
      >
        {({ row }: CellInfo<AllProductsTableEntry, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW") {
            return null;
          }

          const productState = getProductState(row.product).state;
          const productRemoved =
            productState == "REMOVED_BY_MERCHANT" ||
            productState == "REMOVED_BY_WISH";

          if (row.type == "PRODUCT" && productHasVariations(row.product)) {
            const minInventoryVariation = minBy(
              row.product.variations,
              (variation) => getVariationInventory({ variation, warehouse }),
            );
            const maxInventoryVariation = maxBy(
              row.product.variations,
              (variation) => getVariationInventory({ variation, warehouse }),
            );
            const inventoryDisplay = (() => {
              const minInventory =
                minInventoryVariation == null
                  ? null
                  : getVariationInventory({
                      variation: minInventoryVariation,
                      warehouse,
                    });
              const maxInventory =
                maxInventoryVariation == null
                  ? null
                  : getVariationInventory({
                      variation: maxInventoryVariation,
                      warehouse,
                    });
              if (minInventory == null && maxInventory != null) {
                return `${maxInventory}`;
              }
              if (minInventory != null && maxInventory == null) {
                return `${minInventory}`;
              }
              if (minInventory == null || maxInventory == null) {
                return null;
              }
              if (minInventory == maxInventory) {
                return `${minInventory}`;
              }
              return `${minInventory} - ${maxInventory}`;
            })();
            if (inventoryDisplay == null) {
              return null;
            }
            return (
              <Text style={[styles.tableText, styles.primaryInventoryText]}>
                {inventoryDisplay}
              </Text>
            );
          }

          const variation =
            row.type == "VARIATION" ? row.variation : row.product.variations[0];

          const variationInventory = getVariationInventory({
            variation,
            warehouse,
          });

          const localChange = state.newVariationInventories.get(
            variation.id,
          )?.newInventory;
          const value = (() => {
            if (localChange === undefined) {
              return variationInventory;
            }

            return localChange;
          })();

          return (
            <NumericInput
              value={value}
              style={styles.inventoryInput}
              placeholder="0"
              onChange={({ valueAsNumber }) => {
                if (valueAsNumber == variationInventory) {
                  state.newVariationInventories.delete(variation.id);
                  return;
                }
                state.newVariationInventories.set(variation.id, {
                  productId: variation.productId,
                  newInventory: valueAsNumber == null ? null : valueAsNumber,
                });
              }}
              disabled={isSubmitting || productRemoved}
              borderColor={localChange != null ? primary : undefined}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        _key="countryShippingPrice"
        columnDataCy="column_country_shipping_price"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader title={i`Country Shipping Price`} />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW" || row.type == "VARIATION") {
            return null;
          }
          const countryShippingEnabled = (
            row.product.shipping?.warehouseCountryShipping || []
          ).some(({ countryShipping }) => (countryShipping || []).length > 0);
          return (
            <Link
              href={merchFeURL(
                `/product-shipping/${row.product.id}/${warehouse.id}`,
              )}
              openInNewTab
            >
              {countryShippingEnabled
                ? ci18n(
                    "Call to action button in the product table, takes them to a view where they can view country shipping",
                    "View",
                  )
                : ci18n(
                    "Call to action button in the product table, takes them to a view where they can enable country shipping",
                    "Enable",
                  )}
            </Link>
          );
        }}
      </Table.Column>
      <Table.Column
        _key="lastUpdated"
        columnDataCy="column_last_updated"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. This column shows each product's date when it was last updated",
              "Last Updated",
            )}
            titleDescription={i`Timestamp of last update`}
            subtitle={ci18n(
              "Column name in product table. This column shows each product's date of creation",
              "Date Added",
            )}
            subtitleDescription={i`Listing upload date`}
          />
        )}
        sortOrder={sortBy == "LAST_UPDATE" ? sortOrder : "not-applied"}
        onSortToggled={async (order) => {
          await setSortBy(order == "not-applied" ? undefined : "LAST_UPDATE");
          await setSortOrder(order);
        }}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW" || row.type == "VARIATION") {
            return null;
          }
          return (
            <Layout.FlexColumn
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Text style={styles.tableText}>
                {row.product.lastUpdateTime.formatted}
              </Text>
              <Text style={styles.tableTextLight}>
                {row.product.createTime.formatted}
              </Text>
            </Layout.FlexColumn>
          );
        }}
      </Table.Column>
      <Table.Column
        _key="state"
        columnDataCy="column_state"
        columnKey="id"
        title={() => (
          <ProductTableColumnHeader
            title={ci18n(
              "Column name in product table. Means the status of the product, which could be active, removed, etc.",
              "State",
            )}
            titleDescription={i`The condition of a product listing at any point in time. [Learn more](${zendeskURL(
              "6987354064155",
            )})`}
          />
        )}
      >
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW" || row.type == "VARIATION") {
            return null;
          }
          const state = getProductState(row.product);
          return (
            <ProductStateLabel
              style={styles.stateLabel}
              product={row.product}
              state={state.state}
              reason={state.reason}
            />
          );
        }}
      </Table.Column>
      <Table.Column _key="actions" columnKey="id" columnDataCy="column_actions">
        {({ row }: CellInfo<React.ReactNode, AllProductsTableEntry>) => {
          if (row.type == "VARIATION_EXPAND_ROW" || row.type == "VARIATION") {
            return null;
          }
          return (
            <ProductTableActions
              product={row.product}
              merchant={merchant}
              onRefetchProducts={onRefetchProducts}
              showCategoryUpdates={showCategoryUpdates}
            />
          );
        }}
      </Table.Column>
    </Table>
  );
};

const useStylesheet = () => {
  const { textBlack, textLight, textDark, secondaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        stateLabel: {
          minWidth: 136,
        },
        variationExpandTextWrapper: {
          maxWidth: 60,
          position: "relative",
          gap: 8,
        },
        variationExpandText: {
          fontSize: 16,
          lineHeight: "24px",
          top: "calc(50% - 12px)",
          color: secondaryDark,
        },
        productImage: {
          height: 60,
          minWidth: 60,
          margin: "16px 0px",
          borderRadius: 4,
          cursor: "pointer",
        },
        variationImage: {
          height: 60,
          minWidth: 60,
          margin: "16px 0px",
          borderRadius: 4,
        },
        variationName: {
          maxWidth: 320,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        productCell: {
          margin: "16px 0px",
        },
        categories: {
          maxWidth: 150,
          whiteSpace: "pre-wrap",
        },
        variationText: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        variationTextLight: {
          color: textLight,
          fontSize: 14,
          lineHeight: "20px",
        },
        tableText: {
          color: textBlack,
          fontSize: 14,
          lineHeight: "20px",
        },
        tableTextLight: {
          color: textLight,
          fontSize: 14,
          lineHeight: "20px",
        },
        sku: {
          marginTop: 8,
          marginBottom: 8,
          maxWidth: 300,
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: 0,
        },
        priceInput: {
          minWidth: 90,
        },
        inventoryInput: {
          maxWidth: 136,
          minWidth: 70,
        },
        checkboxWrapper: {
          overflow: "hidden",
        },
        enabledSaveIndicator: {
          marginLeft: 4,
        },
        primaryInventoryText: {
          marginRight: 9,
          alignSelf: "stretch",
          textAlign: "right",
        },
        options: {
          maxWidth: 150,
          whiteSpace: "pre-wrap",
        },
      }),
    [textBlack, textLight, textDark, secondaryDark],
  );
};

export default observer(ProductTable);
