import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Lego Components */
import {
  Layout,
  Table,
  CellInfo,
  ThemedLabel,
  Alert,
  Markdown,
  LoadingIndicator,
  Button,
  Text,
  SearchBox,
  FormSelect,
  PageIndicator,
  RowSelectionArgs,
  Theme,
  PrimaryButton,
} from "@ContextLogic/lego";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import UinUpdateModal from "@merchant/component/products/compliance/widgets/UinUpdateModal";
import FranceEprAgreementModalContent from "@merchant/component/products/compliance/widgets/FranceEprAgreementModal";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useIntQueryParam, useStringQueryParam } from "@toolkit/url";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";

/* Model */
import {
  PRODUCT_COMPLIANCE_LINKS_QUERY,
  ProductComplianceLinksResponseData,
  ProductComplianceLinksRequestData,
  PickedFranceUinSchema,
  ProductCategoryLabel,
  FranceEprContainerInitialData,
  APPROVED_STATUSES,
} from "@toolkit/products/france-epr";
import {
  FranceProductUniqueIdentificationNumberCategory,
  LinkProductComplianceState,
} from "@schema/types";
import FranceEprState from "@merchant/model/products/FranceEprState";

type Props = BaseProps & {
  readonly category: FranceProductUniqueIdentificationNumberCategory;
  readonly categoryData?: PickedFranceUinSchema | null;
  readonly state: FranceEprState;
  readonly initialData: FranceEprContainerInitialData;
};

type TableData = {
  readonly id: string;
  readonly productId?: string | null;
  readonly productIdText?: string | null;
  readonly status: LinkProductComplianceState;
  readonly hasUinLink: boolean;
};

type LabelType = {
  readonly text: string;
  readonly theme: Theme;
};

const ProductEprTable = (props: Props) => {
  const { className, style, category, categoryData, state, initialData } =
    props;
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const noDataMessage = "-";

  const needsToAcceptTerms =
    !initialData.currentMerchant.merchantTermsAgreed?.agreedToFrComplianceTos;

  const noUinAdded = categoryData == null;
  const uinApproved =
    categoryData != null &&
    categoryData.status &&
    APPROVED_STATUSES.includes(categoryData.status);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([]));
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set([])
  );
  const [offsetQuery, setOffsetQuery] = useIntQueryParam("offset");
  const [limitQuery, setLimitQuery] = useIntQueryParam("limit");
  const [query, setQuery] = useStringQueryParam("query");

  const numRowsSelected = Array.from(selectedRows).length;
  const offset = offsetQuery || 0;
  const limit = limitQuery || 10;

  const { data, loading, refetch } = useQuery<
    ProductComplianceLinksResponseData,
    ProductComplianceLinksRequestData
  >(PRODUCT_COMPLIANCE_LINKS_QUERY, {
    variables: {
      offset,
      limit,
      franceUinCategories: [category],
      searchType: "PRODUCT_ID",
      ...(query && query.length > 0 ? { query } : {}),
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  const uinComplete = data?.policy?.productCompliance?.unlinkedCount === 0;

  const tableData = (data?.policy?.productCompliance?.links || []).map(
    (link) => ({
      id: link.id,
      productId: link.product?.id,
      productIdText: link.product?.id,
      status: link.reviewState,
      hasUinLink: link.isLinkedWithFranceUin,
    })
  );

  const totalProducts = data?.policy?.productCompliance?.linkCount || 0;

  const getUinStatus = (row: TableData): LabelType => {
    if (noUinAdded) {
      return {
        text: i`Missing EPR registration number`,
        theme: `Red`,
      };
    } else if (row.hasUinLink) {
      return {
        text: i`EPR registration number linked`,
        theme: `LighterCyan`,
      };
    }
    return {
      text: i`EPR registration number not linked`,
      theme: `Yellow`,
    };
  };

  const onAddUin = () => {
    const state = new FranceEprState({ category } as PickedFranceUinSchema);
    if (needsToAcceptTerms) {
      new FranceEprAgreementModalContent({
        state,
      }).render();
    } else {
      new UinUpdateModal({ isEdit: false, state }).render();
    }
  };

  const renderAlert = () => {
    if (uinComplete) {
      return (
        <Alert
          sentiment="info"
          title={
            i`Congratulations! All your ${ProductCategoryLabel[category]} products are linked ` +
            i`to that category’s EPR registration number. `
          }
          text={() => (
            <Markdown
              text={
                i`Check to make sure that if your product(s) fit in multiple categories, they're ` +
                i`linked to that EPR registration number, too.`
              }
            />
          )}
        />
      );
    } else if (uinApproved) {
      return (
        <Alert
          sentiment="info"
          title={
            i`Good news! Your EPR registration number for ${ProductCategoryLabel[category]} ` +
            i`is approved. Start linking it to your products.`
          }
          text={() => (
            <Markdown
              text={i`You can link products individually or as a group.`}
            />
          )}
        />
      );
    }

    return (
      <Alert
        sentiment="warning"
        title={
          totalProducts > 0
            ? i`You don’t have an approved EPR registration number for your ${totalProducts} ` +
              i`product(s) in the ${ProductCategoryLabel[category]} category`
            : i`You don’t have an approved EPR registration number for your product(s) in the ` +
              i`${ProductCategoryLabel[category]} category`
        }
        text={() => (
          <Layout.FlexRow justifyContent="space-between">
            <Markdown
              text={
                i`Get your EPR registration number from your PRO and add it to your dashboard ` +
                i`above. Once approved, you can apply it to any product in this category. Please ` +
                i`note, one product may appear in multiple categories, and must have an EPR ` +
                i`registration number for each category that applies.`
              }
              style={styles.alertPadding}
            />
            <PrimaryButton onClick={onAddUin}>Add</PrimaryButton>
          </Layout.FlexRow>
        )}
      />
    );
  };

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    setOffsetQuery(nextPage * limit);
    setSelectedRows(new Set([]));
    await refetch();
  };

  const onSearch = async (text: string) => {
    setQuery(text.trim());
    await refetch();
  };

  const onRowSelectionToggled = ({
    index,
    row,
    selected,
  }: RowSelectionArgs<TableData>) => {
    if (row.productId == null) {
      return;
    }
    if (selected) {
      selectedRows.add(index);
      selectedRowIds.add(row.productId);
    } else {
      selectedRows.delete(index);
      selectedRowIds.delete(row.productId);
    }
    setSelectedRows(new Set(selectedRows));
    setSelectedRowIds(new Set(selectedRowIds));
  };

  const onBulkLink = async () => {
    if (categoryData && categoryData.id) {
      state.productIds = Array.from(selectedRowIds);
      state.uinIds = [categoryData.id];

      await state.linkProduct();
    } else {
      toastStore.error(
        i`Could not link products. Missing EPR registration number.`
      );
    }
  };

  const tableActions = [
    {
      key: "link",
      name: i`Link`,
      apply: async ([row]: ReadonlyArray<TableData>) => {
        if (row.productId && categoryData && categoryData.id) {
          state.productIds = [row.productId];
          state.uinIds = [categoryData.id];

          await state.linkProduct();
        } else {
          toastStore.error(
            i`Could not link products. Missing EPR registration number.`
          );
        }
      },
      canApplyToRow: (row: TableData) => !!uinApproved && !row.hasUinLink,
    },
    {
      key: "dispute",
      name: i`Category Dispute`,
      href: ([row]: ReadonlyArray<TableData>) =>
        `/product/create-category-dispute/${row.productId}`,
      canApplyToRow: () => true,
    },
  ];

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Layout.FlexColumn style={styles.body}>{renderAlert()}</Layout.FlexColumn>
      <Layout.FlexRow
        justifyContent="space-between"
        style={styles.tableControls}
      >
        <Layout.FlexRow>
          <SearchBox
            placeholder={i`Search by Product ID`}
            value={query}
            onChange={({ text }) => onSearch(text)}
            style={styles.tableControlItem}
          />
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
            style={styles.tableControlItem}
          />
          <FormSelect
            options={[10, 50, 100].map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(value: string) => setLimitQuery(parseInt(value))}
            style={[styles.selectSmall, styles.tableControlItem]}
            selectedValue={limit.toString()}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>

      {numRowsSelected > 0 && (
        <Layout.FlexRow
          justifyContent="space-between"
          style={styles.tableControls}
        >
          <Layout.FlexRow>
            <Text style={styles.tableControlItem}>
              Link selected products to a UIN
            </Text>
            <Button style={styles.tableControlItem} onClick={onBulkLink}>
              Link
            </Button>
          </Layout.FlexRow>
          <Text>{`${numRowsSelected} items selected`}</Text>
        </Layout.FlexRow>
      )}
      <Table
        data={tableData}
        actions={tableActions}
        noDataMessage={i`You don’t have products under this category`}
        selectedRows={Array.from(selectedRows)}
        canSelectRow={() => true}
        onRowSelectionToggled={onRowSelectionToggled}
      >
        <ProductColumn
          _key={undefined}
          title={ni18n(1, "Product", "Products")}
          columnKey="productId"
          align="left"
          showFullName={false}
        />
        <Table.ObjectIdColumn
          _key={undefined}
          columnKey="productIdText"
          title={i`Product ID`}
          noDataMessage={noDataMessage}
          showFull
        />
        <Table.Column
          _key={undefined}
          columnKey="hasUinLink"
          title={i`Status`}
          width={100}
          align="center"
          noDataMessage={noDataMessage}
        >
          {({ row }: CellInfo<string, TableData>) => {
            const { text, theme } = getUinStatus(row);
            return <ThemedLabel theme={theme}>{text}</ThemedLabel>;
          }}
        </Table.Column>
      </Table>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        rowButton: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        body: {
          padding: "16px 24px",
        },
        alertPadding: {
          paddingRight: 32,
        },
        card: {
          marginTop: 16,
        },
        icon: {
          marginLeft: 4,
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
      }),
    [borderPrimary]
  );
};

export default observer(ProductEprTable);
