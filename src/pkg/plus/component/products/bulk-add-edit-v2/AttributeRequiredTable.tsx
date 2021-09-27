/*
 *
 * BulkAddEdit.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/14/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import { Layout, Markdown, Table, Text } from "@ContextLogic/lego";
import { zendeskURL } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";
import { Illustration } from "@merchant/component/core";
import {
  PlusActionType,
  ActionType,
  PlusActionTypeOrder,
  ActionTypeOrder,
  ActionTypeDisplayNames,
  PlusActionTypeDisplayNames,
  ActionTypeDescriptions,
  PlusActionTypeDescriptions,
  PickedProductCsvImportColumnSchema,
  AttributeIconMap,
  AttributeDisplayNameMap,
} from "@toolkit/products/bulk-add-edit-v2";
import { IsRequiredEnum } from "@schema/types";

export type Category = "REQUIRED" | "OPTIONAL";
export type FullSelectionUpdate = {
  readonly category: Category;
  readonly index: number;
  readonly selectionId?: string;
};

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
};

type GroupedColumnCategory = {
  readonly displayName: string;
  readonly upsertProductsRequired?: IsRequiredEnum;
  readonly addProductRequired?: IsRequiredEnum;
  readonly editShippingRequired?: IsRequiredEnum;
  readonly updateProductsRequired?: IsRequiredEnum;
  readonly addSizeColorRequired?: IsRequiredEnum;
  readonly shopifyCreateProductsRequired?: IsRequiredEnum;
};

type TableData = {
  readonly attribute: string | readonly [string, ReadonlyArray<string>];
  readonly upsertProductsRequired?: IsRequiredEnum;
  readonly addProductRequired?: IsRequiredEnum;
  readonly editShippingRequired?: IsRequiredEnum;
  readonly updateProductsRequired?: IsRequiredEnum;
  readonly addSizeColorRequired?: IsRequiredEnum;
  readonly shopifyCreateProductsRequired?: IsRequiredEnum;
};

const ActionTypeToRequiredField: {
  [actionType in ActionType | PlusActionType]: Exclude<
    keyof TableData,
    "attribute" | "allOptional"
  >;
} = {
  ADD_PRODUCTS: "addProductRequired",
  UPDATE_PRODUCTS: "updateProductsRequired",
  EDIT_SHIPPING: "editShippingRequired",
  ADD_SIZE_COLOR: "addSizeColorRequired",
  UPSERT_PRODUCTS: "upsertProductsRequired",
  SHOPIFY_CREATE_PRODUCTS: "shopifyCreateProductsRequired",
};

const BulkAddEdit: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const { surfaceLightest } = useTheme();

  const {
    initialData: {
      currentMerchant: { isStoreMerchant, isMerchantPlus },
      currentUser: {
        gating: { showShopifyProductCsvUpload },
      },
      platformConstants: {
        productCsvImportColumns: { columns },
      },
    },
  } = state;

  const [isViewingOptional, setIsViewingOptional] = useState(false);

  const styles = useStylesheet({ isViewingOptional });

  const viewExamplesLink = useMemo(() => {
    if (isStoreMerchant) {
      return "https://localfaq.wish.com/hc/en-us/articles/205211817-What-Attributes-Do-I-Need-To-Include-When-Adding-Products-";
    }
    if (isMerchantPlus) {
      return zendeskURL("1260806181769");
    }
    return zendeskURL("1260805100070");
  }, [isStoreMerchant, isMerchantPlus]);

  const tableData: ReadonlyArray<TableData> = useTableData({
    columns,
    isViewingOptional,
    isStoreMerchant,
    isMerchantPlus,
  });

  const showNotApplicable = useMemo(
    () =>
      tableData.some((tableColumn) => {
        const actions: ReadonlyArray<
          ActionType | PlusActionType
        > = isMerchantPlus ? PlusActionTypeOrder : ActionTypeOrder;
        return actions.some((actionType) => {
          const tableDataKey = ActionTypeToRequiredField[actionType];
          return tableColumn[tableDataKey] === "NOT_INCLUDED";
        });
      }),
    [tableData, isMerchantPlus]
  );

  const renderCheckColumns = () => {
    const actions: ReadonlyArray<ActionType | PlusActionType> = isMerchantPlus
      ? PlusActionTypeOrder
      : ActionTypeOrder;
    const filterOutAction = showShopifyProductCsvUpload
      ? null
      : "SHOPIFY_CREATE_PRODUCTS";
    return actions
      .filter((action) => action != filterOutAction)
      .map((actionType) => {
        const tableDataKey = ActionTypeToRequiredField[actionType];
        const title = {
          ...ActionTypeDisplayNames,
          ...PlusActionTypeDisplayNames,
        }[actionType];
        const description = {
          ...ActionTypeDescriptions,
          ...PlusActionTypeDescriptions,
        }[actionType];
        return (
          <Table.Column
            columnKey={tableDataKey}
            title={title}
            align="center"
            description={() => (
              <Layout.FlexColumn className={css(styles.columnPopover)}>
                <Text
                  className={css(styles.columnPopoverText)}
                  weight="semibold"
                >
                  {title}
                </Text>
                <Text className={css(styles.columnPopoverText)}>
                  {description}
                </Text>
              </Layout.FlexColumn>
            )}
          >
            {({ row }: { row: TableData }) => {
              const isRequired = row[tableDataKey] || "OPTIONAL";
              return (
                <Illustration
                  className={css(styles.legendIcon)}
                  name={AttributeIconMap[isRequired]}
                  alt={AttributeDisplayNameMap[isRequired]}
                />
              );
            }}
          </Table.Column>
        );
      });
  };

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Markdown
        className={css(styles.desc)}
        text={
          i`Refer to this chart to see which product attributes are required ` +
          i`or optional for each type of product-related action you take. ` +
          i`Format each attribute as a column header and each variation SKU ` +
          i`or Parent SKU as a row in your CSV. ` +
          i`[View descriptions and examples](${viewExamplesLink})`
        }
      />
      <Layout.FlexRow className={css(styles.legend)}>
        <Layout.FlexRow className={css(styles.legendEntry)}>
          <Illustration
            className={css(styles.legendIcon)}
            name={AttributeIconMap.REQUIRED}
            alt={AttributeDisplayNameMap.REQUIRED}
          />
          <Text className={css(styles.legendName)}>
            {AttributeDisplayNameMap.REQUIRED}
          </Text>
        </Layout.FlexRow>
        <Layout.FlexRow className={css(styles.legendEntry)}>
          <Illustration
            className={css(styles.legendIcon)}
            name={AttributeIconMap.OPTIONAL}
            alt={AttributeDisplayNameMap.OPTIONAL}
          />
          <Text className={css(styles.legendName)}>
            {AttributeDisplayNameMap.OPTIONAL}
          </Text>
        </Layout.FlexRow>
        {showNotApplicable && (
          <Layout.FlexRow className={css(styles.legendEntry)}>
            <Illustration
              className={css(styles.legendIcon)}
              name={AttributeIconMap.NOT_INCLUDED}
              alt={AttributeDisplayNameMap.NOT_INCLUDED}
            />
            <Text className={css(styles.legendName)}>
              {AttributeDisplayNameMap.NOT_INCLUDED}
            </Text>
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>
      <Table data={tableData}>
        <Table.Column
          columnKey="attribute"
          title={ci18n(
            "'Attribute' means the header of a column in a CSV",
            "Attribute"
          )}
        >
          {({ row: { attribute } }: { row: TableData }) => {
            if (typeof attribute === "string") {
              return <Text className={css(styles.attribute)}>{attribute}</Text>;
            }

            const [header, list] = attribute;

            return (
              <Layout.FlexColumn className={css(styles.attributeList)}>
                <Text
                  className={css(styles.attributeListHeader)}
                  weight="semibold"
                >
                  {header}
                </Text>
                {list.map((name) => (
                  <Text className={css(styles.attribute)} key={name}>
                    • {name}
                  </Text>
                ))}
              </Layout.FlexColumn>
            );
          }}
        </Table.Column>
        {renderCheckColumns()}
        <Table.FixtureRow style={{ backgroundColor: surfaceLightest }}>
          <Table.FixtureCell
            spanEntireRow
            className={css(styles.expandRow)}
            onClick={() => setIsViewingOptional(!isViewingOptional)}
          >
            <Layout.FlexRow className={css(styles.expandRowContent)}>
              <Illustration
                className={css(styles.expandIcon)}
                name="chevronRightBlue"
                alt={isViewingOptional ? "collapse" : "expand"}
              />
              <Text className={css(styles.expandText)} weight="semibold">
                {isViewingOptional
                  ? i`View less optional attributes`
                  : i`View more optional attributes`}
              </Text>
            </Layout.FlexRow>
          </Table.FixtureCell>
        </Table.FixtureRow>
      </Table>
    </Layout.FlexColumn>
  );
};

const useStylesheet = ({
  isViewingOptional,
}: {
  isViewingOptional: boolean;
}) => {
  const { textBlack, textDark, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        desc: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          marginBottom: 28,
        },
        legend: {
          marginBottom: 8,
        },
        legendEntry: {
          ":not(:last-child)": {
            marginRight: 42,
          },
        },
        legendIcon: {
          marginRight: 5,
        },
        legendName: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        attribute: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        attributeList: {
          padding: "15px 0px",
        },
        attributeListHeader: {
          fontSize: 12,
          lineHeight: "16px",
          color: textDark,
          marginBottom: 8,
        },
        expandRow: {
          opacity: 1,
          transition: "opacity 0.3s linear",
          cursor: "pointer",
          userSelect: "none",
          ":hover": {
            opacity: 0.3,
          },
        },
        expandRowContent: {
          margin: "0px 28px",
        },
        expandIcon: {
          marginRight: 12,
          maxHeight: 14,
          transform: isViewingOptional ? "rotate(-90deg)" : undefined,
        },
        expandText: {
          fontSize: 14,
          lineHeight: "20px",
          color: primary,
        },
        columnPopover: {
          padding: 16,
        },
        columnPopoverText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
      }),
    [textBlack, textDark, primary, isViewingOptional]
  );
};

export const useTableData = ({
  columns,
  isViewingOptional,
  isStoreMerchant,
  isMerchantPlus,
}: {
  readonly columns: ReadonlyArray<PickedProductCsvImportColumnSchema>;
  readonly isViewingOptional: boolean;
  readonly isStoreMerchant: boolean;
  readonly isMerchantPlus: boolean;
}) =>
  useMemo(() => {
    const [ungroupedColumns, groupedColumns] = _.partition(
      columns,
      ({
        category,
        upsertProductsRequired,
        addProductRequired,
        editShippingRequired,
        updateProductsRequired,
        addSizeColorRequired,
        shopifyCreateProductsRequired,
      }) =>
        upsertProductsRequired === "REQUIRED" ||
        addProductRequired === "REQUIRED" ||
        editShippingRequired === "REQUIRED" ||
        updateProductsRequired === "REQUIRED" ||
        addSizeColorRequired === "REQUIRED" ||
        shopifyCreateProductsRequired === "REQUIRED" ||
        category == null
    );

    const ungroupedTableData: ReadonlyArray<TableData> = _.sortBy(
      ungroupedColumns.map(
        ({
          name,
          upsertProductsRequired,
          addProductRequired,
          editShippingRequired,
          updateProductsRequired,
          addSizeColorRequired,
          shopifyCreateProductsRequired,
        }) => ({
          attribute: name,
          upsertProductsRequired,
          addProductRequired,
          editShippingRequired,
          updateProductsRequired,
          addSizeColorRequired,
          shopifyCreateProductsRequired,
        })
      ),
      isMerchantPlus
        ? [
            ({ upsertProductsRequired }) =>
              !(upsertProductsRequired === "REQUIRED"),
          ]
        : [
            ({ addProductRequired }) => !(addProductRequired === "REQUIRED"),
            ({ editShippingRequired }) =>
              !(editShippingRequired === "REQUIRED"),
            ({ updateProductsRequired }) =>
              !(updateProductsRequired === "REQUIRED"),
            ({ addSizeColorRequired }) =>
              !(addSizeColorRequired === "REQUIRED"),
            ({ shopifyCreateProductsRequired }) =>
              !(shopifyCreateProductsRequired === "REQUIRED"),
          ]
    );

    if (!isViewingOptional) {
      return ungroupedTableData;
    }

    const moreRelevantRequired = (
      a: IsRequiredEnum,
      b: IsRequiredEnum
    ): IsRequiredEnum => {
      if (a === "REQUIRED") {
        return a;
      }
      if (b === "REQUIRED") {
        return b;
      }
      if (a === "OPTIONAL") {
        return a;
      }
      if (b === "OPTIONAL") {
        return b;
      }
      return a;
    };

    const groupedColumnCategories: {
      [id: string]: GroupedColumnCategory;
    } = groupedColumns.reduce(
      (
        acc,
        {
          category,
          upsertProductsRequired,
          addProductRequired,
          editShippingRequired,
          updateProductsRequired,
          addSizeColorRequired,
          shopifyCreateProductsRequired,
        }
      ) => {
        if (category == null) {
          return acc;
        }

        const currentCategory = acc[category.id];

        if (currentCategory == null) {
          return {
            ...acc,
            ...{
              [category.id]: {
                upsertProductsRequired,
                addProductRequired,
                editShippingRequired,
                updateProductsRequired,
                addSizeColorRequired,
                shopifyCreateProductsRequired,
                displayName: category.name,
              },
            },
          };
        }

        return {
          ...acc,
          ...{
            [category.id]: {
              upsertProductsRequired: moreRelevantRequired(
                upsertProductsRequired,
                currentCategory.upsertProductsRequired || "NOT_INCLUDED"
              ),
              addProductRequired: moreRelevantRequired(
                addProductRequired,
                currentCategory.addProductRequired || "NOT_INCLUDED"
              ),
              editShippingRequired: moreRelevantRequired(
                editShippingRequired,
                currentCategory.editShippingRequired || "NOT_INCLUDED"
              ),
              updateProductsRequired: moreRelevantRequired(
                updateProductsRequired,
                currentCategory.updateProductsRequired || "NOT_INCLUDED"
              ),
              addSizeColorRequired: moreRelevantRequired(
                addSizeColorRequired,
                currentCategory.addSizeColorRequired || "NOT_INCLUDED"
              ),
              shopifyCreateProductsRequired: moreRelevantRequired(
                shopifyCreateProductsRequired,
                currentCategory.shopifyCreateProductsRequired || "NOT_INCLUDED"
              ),
              displayName: category.name,
            },
          },
        };
      },
      {} as {
        [id: string]: GroupedColumnCategory;
      }
    );

    const groupedColumnsByCategory = _.groupBy(
      groupedColumns,
      ({ category }) => category?.id
    );

    if (isStoreMerchant) {
      delete groupedColumnsByCategory.COUNTRY_SHIPPING;
    }

    const groupedTableData: ReadonlyArray<TableData> = Object.entries(
      groupedColumnsByCategory
    ).map(([categoryId, columns]) => {
      const {
        displayName,
        upsertProductsRequired,
        addProductRequired,
        editShippingRequired,
        updateProductsRequired,
        addSizeColorRequired,
        shopifyCreateProductsRequired,
      } = groupedColumnCategories[categoryId];
      const sortedColumnNamesInCategory: ReadonlyArray<string> = columns.map(
        ({ name }) => name
      );
      return {
        attribute: [displayName, sortedColumnNamesInCategory],
        upsertProductsRequired,
        addProductRequired,
        editShippingRequired,
        updateProductsRequired,
        addSizeColorRequired,
        shopifyCreateProductsRequired,
      };
    });

    return [...ungroupedTableData, ...groupedTableData];
  }, [columns, isViewingOptional, isStoreMerchant, isMerchantPlus]);

export default observer(BulkAddEdit);
