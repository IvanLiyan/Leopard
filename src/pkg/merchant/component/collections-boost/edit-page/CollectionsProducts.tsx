/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, Text } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { weightMedium, weightSemibold } from "@toolkit/fonts";

/* Merchant Components */
import CollectionsProductsTable from "@merchant/component/collections-boost/edit-page/CollectionsProductsTable";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant API */
import { getMultiLight } from "@merchant/api/product";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TableAction } from "@ContextLogic/lego";
import { LightProductDict } from "@merchant/api/product";
import { CellInfo } from "@ContextLogic/lego";
import {
  CollectionsBoostSource,
  CollectionsProduct,
} from "@merchant/api/collections-boost";

const DefaultProductListCloseThreshold = 10;

type CollectionsProductsProps = BaseProps & {
  readonly products: ReadonlyArray<CollectionsProduct>;
  readonly onProductsSelected: (
    products: ReadonlyArray<CollectionsProduct>
  ) => unknown;
  readonly initLoading: boolean;
  readonly collectionSource: CollectionsBoostSource;
};

const CollectionsProducts = (props: CollectionsProductsProps) => {
  const {
    products,
    onProductsSelected,
    initLoading,
    className,
    collectionSource,
  } = props;
  const styles = useStylesheet();
  const { pageBackground } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [productListOpen, setProductListOpen] = useState(true);

  const [selectedProducts, setSelectedProducts] = useState<
    ReadonlyArray<LightProductDict>
  >([]);

  const productsCount = selectedProducts.length;

  const isAutomated = collectionSource == "AUTOMATED";

  const onInitProductsChange = useCallback(() => {
    const setInitSelectProductTable = async () => {
      if (products.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const resp = await getMultiLight({
          pids: products.map((p) => p.product_id).join(","),
        }).call();
        if (!resp || !resp.data || !resp.data.results) {
          return;
        }
        setSelectedProducts(resp.data.results);
        setIsLoading(false);
        setProductListOpen(
          resp.data.results.length < DefaultProductListCloseThreshold
        );
      } catch (err) {
        return;
      }
    };
    setInitSelectProductTable();
  }, [products]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onInitProductsChange, [initLoading]);

  const onSelectedProductsChange = useCallback(() => {
    const selectedProductIds = selectedProducts.map((p) => p.id);
    const campaignProduct = products.filter((p) =>
      selectedProductIds.includes(p.product_id)
    );
    const campaignProductIds = products.map((p) => p.product_id);
    const newProducts = selectedProductIds
      .filter((pid) => !campaignProductIds.includes(pid))
      .map((pid) => ({ product_id: pid }));
    onProductsSelected([...campaignProduct, ...newProducts]);
  }, [products, selectedProducts, onProductsSelected]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onSelectedProductsChange, [selectedProducts]);

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "remove",
      name: () => i`Remove`,
      canApplyToRow: () => !isAutomated,
      apply: (selectedRemoveItems: ReadonlyArray<LightProductDict>) => {
        const removeProductId = selectedRemoveItems[0].id;
        setSelectedProducts(
          selectedProducts.filter((ps: LightProductDict) => {
            return ps.id != removeProductId;
          })
        );
      },
    },
  ];

  const renderEligibleProductsTable = () => {
    return (
      <CollectionsProductsTable
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    );
  };

  const descriptionText =
    i`Select the products you would like to promote in this collection. ` +
    i`To maximize the potential exposure of this collection, please select ` +
    i`at least ${10} products within the same category (e.g., Halloween-related ` +
    i`products, apparel, fitness products).`;

  const selectedProductsHeader = i`Products Selected (${productsCount})`;

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.text, styles.topMargin)}>
        The following products will be included in this collection.
      </div>
      <div className={css(styles.topMargin)}>
        {isLoading ? (
          <div className={css(styles.center)}>
            <LoadingIndicator type="spinner" size={80} />
          </div>
        ) : (
          <Accordion
            header={() => (
              <div className={css(styles.sectionHeader)}>
                {selectedProductsHeader}
              </div>
            )}
            isOpen={productListOpen}
            onOpenToggled={(isOpen) => {
              setProductListOpen(isOpen);
            }}
            backgroundColor={pageBackground}
          >
            <Table
              data={selectedProducts}
              actions={tableActions}
              fixLayout
              noDataMessage={i`You have not selected any products yet.`}
            >
              <ProductColumn
                showProductId
                title={i`Product ID`}
                columnKey="id"
                align="left"
                width={300}
              />
              <Table.Column
                columnKey="name"
                title={i`Product name`}
                noDataMessage={"\u2014"}
              >
                {({ value }: CellInfo<string, string>) => (
                  <Text style={styles.productName}>{value}</Text>
                )}
              </Table.Column>
              <Table.Column
                columnKey="parent_sku"
                title={i`Parent SKU`}
                noDataMessage={"\u2014"}
              />
            </Table>
          </Accordion>
        )}
      </div>
      {!isAutomated && (
        <div className={css(styles.text, styles.topMargin)}>
          {descriptionText}
        </div>
      )}
      {!isAutomated && renderEligibleProductsTable()}
    </div>
  );
};

export default observer(CollectionsProducts);

const useStylesheet = () => {
  const { textWhite, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        text: {
          color: textBlack,
          fontSize: 16,
          fontWeight: weightMedium,
        },
        leftMargin: {
          marginLeft: 10,
        },
        topMargin: {
          marginTop: 20,
        },
        center: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        allProductsCard: {
          marginTop: 20,
          border: "none",
        },
        accordion: {
          backgroundColor: textWhite,
        },
        accordionHeader: {
          fontSize: 16,
          fontWeight: weightSemibold,
          color: textBlack,
        },
        sectionHeader: {
          fontSize: 14,
          fontWeight: weightSemibold,
          color: textBlack,
        },
        productName: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          width: "100%",
        },
      }),
    [textWhite, textBlack]
  );
};
