/* eslint-disable local-rules/no-empty-link */
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Switch } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { TableAction, RowSelectionArgs } from "@ContextLogic/lego";
import { CellInfo } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium, weightSemibold } from "@toolkit/fonts";

/* Merchant Components */
import EligibleProducts from "@merchant/component/product-boost/edit-campaign/EligibleProducts";
import ValidatedProductColumn from "@merchant/component/products/columns/ValidatedProductColumn";

/* Merchant Store */
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useProductBoostMerchantInfo } from "@merchant/stores/product-boost/ProductBoostContextStore";

/* Merchant API */
import { getMultiLight } from "@merchant/api/product";

/* Merchant Model */
import Product from "@merchant/model/product-boost/Product";

/* Toolkit */
import ProductIdValidator from "@toolkit/product-boost/validators/ProductIdValidator";

/* Type Imports*/
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ProductsProps = BaseProps;

type TableData = {
  id: string;
  name: string | null | undefined;
  parentSku: string | null | undefined;
  maxboost: boolean | null | undefined;
  uniqId: number | null | undefined;
  brandboost: boolean | null | undefined;
};

const Products = (props: ProductsProps) => {
  const styles = useStyleSheet();
  const { className } = props;
  const productBoostStore = useProductBoostStore();
  const { currentCampaign: campaign } = productBoostStore;
  const merchantInfo = useProductBoostMerchantInfo();

  const [loading, setLoading] = useState(false);
  const [tableExpanded, setTableExpanded] = useState(true);
  const [selectedRowMap, setSelectedRowMap] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!campaign || !campaign.products || campaign.products.length == 0) {
        return;
      }
      setLoading(true);
      const productsResponse = await getMultiLight({
        pids: campaign.products.map((p) => p.id).join(","),
      }).call();
      const data = productsResponse?.data?.results;
      if (data && campaign && campaign.products) {
        const searchResults = new Map<
          string,
          { parentSku: string; name: string }
        >();
        data.forEach((product) => {
          const { id, name } = product;
          const parentSku = product.parent_sku;
          searchResults.set(id, { parentSku, name });
        });
        campaign.products.forEach((product) => {
          const productData = searchResults.get(product.id);
          if (productData) {
            const { parentSku, name } = productData;
            product.parentSku = parentSku;
            product.name = name;
          }
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [campaign]);

  const productIdValidator = useMemo(() => {
    if (!campaign || !campaign.products) {
      return [];
    }
    const { startDate, endDate } = campaign;
    return [
      new ProductIdValidator({
        productIds: campaign.products.map((p) => p.id),
        campaignId: campaign.id,
        startDate: startDate && startDate.toISOString(),
        endDate: endDate && endDate.toISOString(),
      }),
    ];
  }, [campaign]);

  const tableActions = useMemo((): ReadonlyArray<TableAction> => {
    if (!campaign || !campaign.products) {
      return [];
    }
    return [
      {
        key: "remove",
        canBatch: true,
        name: (rows: ReadonlyArray<Product>) => {
          if (rows.length === 1) {
            return i`Remove`;
          }
          return i`Remove All Selected Products`;
        },
        canApplyToRow: () => true,
        apply: (selectedRemoveItems: ReadonlyArray<Product>) => {
          if (!campaign.products) {
            campaign.products = [];
          } else {
            for (const selectedItem of selectedRemoveItems) {
              campaign.products = campaign.products.filter(
                (p) => p.uniqId !== selectedItem.uniqId
              );
            }
          }
          setSelectedRowMap((selectedRowMap) => new Set());
        },
      },
    ];
  }, [campaign]);

  // shouldn't happen
  if (!campaign || !campaign.products) {
    return null;
  }

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    if (selected) {
      setSelectedRowMap((selectedRowMap) => {
        selectedRowMap.add(index);
        return new Set<number>(selectedRowMap);
      });
    } else {
      setSelectedRowMap((selectedRowMap) => {
        selectedRowMap.delete(index);
        return new Set<number>(selectedRowMap);
      });
    }
  };

  const tableData: ReadonlyArray<TableData> = campaign.products.map(
    (product) => {
      const id = product.id;
      const maxboost = product.isMaxboost;
      const uniqId = product.uniqId;
      const name = product.name;
      const parentSku = product.parentSku;
      const brandboost = !!product.brandId;
      return {
        id,
        name,
        parentSku,
        maxboost,
        uniqId,
        brandboost,
      };
    }
  );

  const renderProductName = (value: TableData["name"]): ReactNode => {
    if (value == null) {
      return null;
    }
    if (value.length > 30) {
      return value.substring(0, 30) + "...";
    }
    return value;
  };

  const renderMaxBoost = (
    value: TableData["maxboost"],
    index: number
  ): ReactNode => {
    return (
      <Switch
        isOn={!!value}
        onToggle={(isOn: boolean) => {
          if (campaign.products) {
            campaign.products[index].isMaxboost = isOn;
          }
        }}
        disabled={!campaign.isNewState}
      />
    );
  };

  const renderBrandBoost = (value: TableData["brandboost"]): ReactNode => {
    return value && <Switch isOn={value} onToggle={() => {}} disabled />;
  };

  const hasBrandBoost: boolean = tableData.some(
    (product) => product.brandboost
  );

  if (merchantInfo == null) {
    return <LoadingIndicator />;
  }

  const allowMaxboost =
    merchantInfo.marketing.currentMerchant.allowMaxboost || false;

  return (
    <div className={css(className)}>
      <div className={css(styles.text, styles.topMargin)}>
        <span>The following products are promoted in this campaign.</span>
      </div>
      <div className={css(styles.topMargin)}>
        {loading ? (
          <div className={css(styles.center)}>
            <LoadingIndicator type="spinner" size={80} />
          </div>
        ) : (
          <Table
            key={`${allowMaxboost}_${hasBrandBoost}`}
            data={tableData}
            actions={!campaign.isNewState ? [] : tableActions}
            onRowSelectionToggled={onRowSelectionToggled}
            selectedRows={[...selectedRowMap]}
            noDataMessage={i`You haven't selected any products yet.`}
          >
            <ValidatedProductColumn
              columnKey="id"
              title={i`Product ID`}
              fontSize={14}
              showProductId
              multiline
              productIds={campaign.products.map((p) => p.id)}
              validators={productIdValidator}
              width={300}
            />
            <Table.Column
              columnKey="name"
              title={i`Product name`}
              noDataMessage={"\u2014"}
            >
              {({ value }: CellInfo<TableData["name"], TableData>) =>
                renderProductName(value)
              }
            </Table.Column>
            <Table.Column
              columnKey="parentSku"
              title={i`Parent SKU`}
              noDataMessage={"\u2014"}
            />
            {allowMaxboost && (
              <Table.Column
                columnKey="maxboost"
                title={i`MaxBoost`}
                description={
                  i`Products enrolled in MaxBoost will be promoted ` +
                  i`on third-party platforms like Facebook or Google.`
                }
              >
                {({
                  value,
                  index,
                }: CellInfo<TableData["maxboost"], TableData>) =>
                  renderMaxBoost(value, index)
                }
              </Table.Column>
            )}
            {hasBrandBoost && (
              <Table.Column
                columnKey="brandboost"
                title={i`BrandBoost`}
                description={
                  i`Products that are associated with a true brand are enrolled ` +
                  i`in BrandBoost.`
                }
              >
                {({ value }: CellInfo<TableData["brandboost"], TableData>) =>
                  renderBrandBoost(value)
                }
              </Table.Column>
            )}
          </Table>
        )}
      </div>
      {campaign.isNewState && (
        <div className={css(styles.text, styles.topMargin)}>
          <span>Select products you'd like to promote in this campaign.</span>
        </div>
      )}
      {campaign.isNewState && (
        <Card showOverflow style={css(styles.topMargin)}>
          <Accordion
            className={css(styles.accordion)}
            header={() => (
              <div className={css(styles.accordionHeader)}>
                View All Products
              </div>
            )}
            onOpenToggled={() => {
              setTableExpanded((tableExpanded) => !tableExpanded);
            }}
            isOpen={tableExpanded}
          >
            <EligibleProducts allowMaxboost={allowMaxboost} />
          </Accordion>
        </Card>
      )}
    </div>
  );
};

const useStyleSheet = () => {
  const { textWhite, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [textWhite, textBlack]
  );
};

export default observer(Products);
