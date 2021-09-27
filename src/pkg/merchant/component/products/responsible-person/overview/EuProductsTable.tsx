/*
 * PerformanceStoreHealthSection.tsx
 *
 * Created by Betty Chen on Apr 21 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import {
  FormSelect,
  Table,
  Layout,
  PageIndicator,
  CellInfo,
  IconButton,
  RowSelectionArgs,
  H6,
  Card,
  ThemedLabel,
  Text,
  LoadingIndicator,
  Popover,
  MultiSecondaryButton,
  SearchBox,
  DownloadButton,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import {
  useIntQueryParam,
  useStringArrayQueryParam,
  useStringQueryParam,
} from "@toolkit/url";
import ToastStore from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";

/* Merchant Stores */
import { useDeciderKey } from "@merchant/stores/ExperimentStore";

/* Merchant Components */
import { Illustration } from "@merchant/component/core";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import EuComplianceProductsFilter from "@merchant/component/products/responsible-person/widgets/EuComplianceProductsFilter";

/* Model */
import {
  ProductComplianceLinksResponseData,
  ProductComplianceLinksRequestData,
  PickedProductComplianceLinks,
  CategoryLabel,
  ResponsiblePersonInitialData,
} from "@toolkit/products/responsible-person";
import {
  MsrCategory,
  LinkProductComplianceState,
  DownloadEuComplianceProductLinks,
} from "@schema/types";
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";

type DownloadEuComplianceProductLinksResponse = {
  readonly policy?: {
    readonly euCompliance?: {
      readonly downloadProductLinks: Pick<
        DownloadEuComplianceProductLinks,
        "ok" | "errorMessage"
      >;
    };
  };
};

const DOWNLOAD_EU_COMPLIANCE_PRODUCT_LINKS_MUTATION = gql`
  mutation EuCompliance_DownloadEuComplianceProductLinksMutation {
    policy {
      euCompliance {
        downloadProductLinks {
          ok
          errorMessage
        }
      }
    }
  }
`;

const PRODUCT_COMPLIANCE_LINKS_QUERY = gql`
  query ProductComplianceLinks_EuProductsTable(
    $offset: Int!
    $limit: Int!
    $categories: [MSRCategory!]
    $states: [LinkProductComplianceState!]
    $query: String
    $searchType: ProductComplianceSearchType
  ) {
    policy {
      productCompliance {
        linkCount(
          categories: $categories
          states: $states
          complianceTypes: [EU_REGULATION_20191020_MSR]
          query: $query
          searchType: $searchType
        )
        links(
          limit: $limit
          offset: $offset
          categories: $categories
          states: $states
          complianceTypes: [EU_REGULATION_20191020_MSR]
          query: $query
          searchType: $searchType
        ) {
          reviewState
          productCategories
          trueTags {
            topLevel {
              name
            }
          }
          euResponsiblePerson {
            status
            id
            email
            address {
              name
            }
          }
          product {
            name
            id
            sku
            eligibleForCategoryDispute
          }
        }
      }
    }
  }
`;

type Props = BaseProps & {
  readonly initialData: ResponsiblePersonInitialData;
  readonly state: ResponsiblePersonState;
};

export const DefaultCategories: ReadonlyArray<MsrCategory> = [
  "ELECTRONICS",
  "PPE",
  "ELECTRICAL_PRODUCTS",
  "TOYS",
];

const EuProductsTable = (props: Props) => {
  const { className, style, initialData, state } = props;
  const styles = useStylesheet();

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([]));
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set([])
  );
  const [offsetQuery, setOffsetQuery] = useIntQueryParam("offset");
  const [limitQuery, setLimitQuery] = useIntQueryParam("limit");
  const [statesQuery, setStatesQuery] = useStringArrayQueryParam("states");
  const [categoriesQuery, setCategoriesQuery] = useStringArrayQueryParam(
    "categories",
    DefaultCategories
  );
  const [query, setQuery] = useStringQueryParam("query");

  const { decision: showProductDispute } = useDeciderKey(
    "product_dispute_rev_share"
  );

  const numRowsSelected = Array.from(selectedRows).length;
  const offset = offsetQuery || 0;
  const limit = limitQuery || 10;
  const states = statesQuery as LinkProductComplianceState[];
  const categories = !categoriesQuery.includes("NO_CATEGORY")
    ? (categoriesQuery as MsrCategory[])
    : [];

  const { data, loading, refetch } = useQuery<
    ProductComplianceLinksResponseData,
    ProductComplianceLinksRequestData
  >(PRODUCT_COMPLIANCE_LINKS_QUERY, {
    variables: {
      offset,
      limit,
      categories,
      states,
      searchType: "PRODUCT_ID",
      ...(query && query.length > 0 ? { query } : {}),
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  const { policy } = initialData;

  if (
    data?.policy?.productCompliance?.links == null ||
    policy?.productCompliance == null
  ) {
    return null;
  }

  const totalProducts = data.policy.productCompliance.linkCount;
  const productsList = data.policy.productCompliance.links;
  const productCategories = policy.productCompliance.allMsrCategories;
  const responsiblePeople = policy.productCompliance.responsiblePersons || [];

  const renderEmptyTable = () => {
    return (
      <Card>
        <Layout.FlexColumn
          alignItems="center"
          justifyContent="center"
          className={css(styles.emptyCard)}
        >
          <Illustration
            name="document"
            alt="document"
            className={css(styles.smallIcon)}
          />
          <H6>No Products Available</H6>
        </Layout.FlexColumn>
      </Card>
    );
  };

  const onRowSelectionToggled = ({
    index,
    row,
    selected,
  }: RowSelectionArgs<PickedProductComplianceLinks>) => {
    if (row.product == null) {
      return;
    }
    if (selected) {
      selectedRows.add(index);
      selectedRowIds.add(row.product.id);
    } else {
      selectedRows.delete(index);
      selectedRowIds.delete(row.product.id);
    }
    setSelectedRows(new Set(selectedRows));
    setSelectedRowIds(new Set(selectedRowIds));
  };

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    setOffsetQuery(nextPage * limit);
    setSelectedRows(new Set([]));
    await refetch();
  };

  const onLinkResponsiblePerson = async (
    rpId: string,
    row?: PickedProductComplianceLinks
  ) => {
    const productIds =
      row != null && row.product != null
        ? [row.product.id]
        : Array.from(selectedRowIds);
    await state.linkProduct(productIds, rpId);
  };

  const onSearch = async (text: string) => {
    setQuery(text.trim());
    await refetch();
  };

  const downloadCSV = async () => {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    const { data } = await client.mutate<
      DownloadEuComplianceProductLinksResponse,
      void
    >({
      mutation: DOWNLOAD_EU_COMPLIANCE_PRODUCT_LINKS_MUTATION,
    });

    const ok = data?.policy?.euCompliance?.downloadProductLinks.ok;
    const message =
      data?.policy?.euCompliance?.downloadProductLinks.errorMessage;

    if (!ok) {
      toastStore.negative(message || i`Could not download products.`);
      return;
    }

    toastStore.positive(
      i`Your products are being processed into CSV files. ` +
        i`You will receive an email with links to download the files.`
    );
  };

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Layout.FlexRow
        justifyContent="space-between"
        className={css(styles.tableControls)}
      >
        <Layout.FlexRow>
          {productCategories != null && (
            <Popover
              popoverContent={() => (
                <EuComplianceProductsFilter
                  style={{ minWidth: 375 }}
                  categories={productCategories}
                  onSubmit={refetch}
                  statesQuery={statesQuery as LinkProductComplianceState[]}
                  categoriesQuery={categoriesQuery as MsrCategory[]}
                  onSetStatesQuery={setStatesQuery}
                  onSetCategoriesQuery={setCategoriesQuery}
                />
              )}
              position="top center"
              on="click"
              className={css(styles.tableControlItem)}
            >
              <IconButton icon="filter">Filter</IconButton>
            </Popover>
          )}
          <SearchBox
            placeholder={i`Search by Product ID`}
            value={query}
            onChange={({ text }) => onSearch(text)}
            className={css(styles.tableControlItem)}
          />
          <DownloadButton
            onClick={downloadCSV}
            disabled={productsList.length === 0}
          >
            Export CSV
          </DownloadButton>
        </Layout.FlexRow>
        <Layout.FlexRow>
          <PageIndicator
            onPageChange={onPageChange}
            hasPrev={offset != 0}
            hasNext={totalProducts ? offset + limit < totalProducts : false}
            rangeStart={offset + 1}
            rangeEnd={
              totalProducts ? Math.min(totalProducts, offset + limit) : 0
            }
            totalItems={totalProducts}
            currentPage={Math.ceil(offset / limit)}
            className={css(styles.tableControlItem)}
          />
          <FormSelect
            options={[10, 50, 100].map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(value: string) => setLimitQuery(parseInt(value))}
            className={css(styles.selectSmall, styles.tableControlItem)}
            selectedValue={limit.toString()}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>

      {numRowsSelected > 0 && (
        <Layout.FlexRow
          justifyContent="space-between"
          className={css(styles.tableControls)}
        >
          <Layout.FlexRow>
            <Text className={css(styles.tableControlItem)}>
              Bulk link EU Responsible Person
            </Text>
            <FormSelect
              options={responsiblePeople.map((rp) => ({
                text: rp.address.name,
                value: rp.id,
              }))}
              placeholder={i`Select one`}
              selectedValue={null}
              onSelected={async (value: string) =>
                await onLinkResponsiblePerson(value)
              }
              disabled={responsiblePeople.length === 0}
              className={css(styles.tableControlItem)}
              style={{ minWidth: 100 }}
            />
          </Layout.FlexRow>
          <Text>{`${numRowsSelected} items selected`}</Text>
        </Layout.FlexRow>
      )}

      {productsList.length === 0 ? (
        renderEmptyTable()
      ) : (
        <Table
          data={productsList}
          rowHeight={60}
          noDataMessage={i`No Responsible Persons`}
          selectedRows={Array.from(selectedRows)}
          canSelectRow={() => true}
          onRowSelectionToggled={onRowSelectionToggled}
          className={css(styles.wrapper)}
        >
          <ProductColumn
            title={i`Product`}
            columnKey="product.id"
            align="left"
            showFullName={false}
          />
          <Table.ObjectIdColumn columnKey="product.id" title={i`Product ID`} />
          <Table.Column
            columnKey="productCategories"
            title={i`Category`}
            width={100}
          >
            {({ row }: CellInfo<string, PickedProductComplianceLinks>) =>
              row.productCategories != null &&
              row.productCategories.length > 0 ? (
                <Text>
                  {row.productCategories
                    .map((category) => CategoryLabel[category])
                    .join(", ")
                    .trim()}
                </Text>
              ) : (
                <Text>
                  {[
                    ...new Set(
                      (row.trueTags || [])
                        .filter((tag) => tag.topLevel != null)
                        .map((tag) => tag.topLevel.name)
                    ),
                  ]
                    .join(", ")
                    .trim()}
                </Text>
              )
            }
          </Table.Column>
          <Table.Column
            columnKey="reviewState"
            title={i`Status`}
            align="center"
          >
            {/* eslint-disable local-rules/unwrapped-i18n */}
            {({ row }: CellInfo<string, PickedProductComplianceLinks>) => (
              <ThemedLabel
                theme={row.reviewState === "HAS_RP" ? "CashGreen" : "Yellow"}
              >
                {row.reviewState === "NO_RP"
                  ? i`No Responsible Person`
                  : i`Responsible Person Linked`}
              </ThemedLabel>
            )}
          </Table.Column>
          <Table.Column
            columnKey="product.name"
            title={i`Responsible Person`}
            width={150}
          >
            {({ row }: CellInfo<string, PickedProductComplianceLinks>) => (
              <Layout.FlexRow>
                <FormSelect
                  options={responsiblePeople.map((rp) => ({
                    text: rp.address.name,
                    value: rp.id,
                  }))}
                  placeholder={i`Select one`}
                  onSelected={async (value: string) => {
                    if (value != null) {
                      await onLinkResponsiblePerson(value, row);
                    }
                  }}
                  selectedValue={row.euResponsiblePerson?.id || null}
                  disabled={responsiblePeople.length === 0}
                  className={css(styles.selectRp)}
                />
                {showProductDispute &&
                  row.product != null &&
                  row.product.eligibleForCategoryDispute === "ELIGIBLE" && (
                    <MultiSecondaryButton
                      actions={[
                        {
                          text: i`Dispute Product Category`,
                          href: `/product/create-category-dispute/${row.product.id}?source=EU_COMPLIANCE`,
                        },
                      ]}
                      dropDownContentWidth={225}
                      visibleButtonCount={0}
                      className={css(styles.multilineButton)}
                    />
                  )}
              </Layout.FlexRow>
            )}
            {/* eslint-enable local-rules/unwrapped-i18n */}
          </Table.Column>
        </Table>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          color: textBlack,
        },
        wrapper: {
          flex: 1,
        },
        emptyCard: {
          height: 500,
          color: textBlack,
        },
        smallIcon: {
          width: 21,
          marginBottom: 15,
        },
        tableControls: {
          padding: "16px 24px",
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        tableControlItem: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        selectSmall: {
          maxWidth: 50,
          maxHeight: 30,
        },
        selectRp: {
          flex: 1,
        },
        multilineButton: {
          marginLeft: 8,
        },
      }),
    [borderPrimary, textBlack]
  );
};

export default observer(EuProductsTable);
