import {
  CellInfo,
  H4,
  Layout,
  LoadingIndicator,
  SearchBox,
  SortOrder,
  Table,
  TableAction,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import ProductCell from "./ProductCell";
import RefundDetailsModal from "./RefundDetailsModal";
import { SortByOrder, SortProductQualityRefundField } from "@schema";
import {
  GQLSortOrder,
  LegoSortOrder,
  WSSProductQualityRefundQuery,
  WSSProductQualityRefundRequest,
  WSSProductQualityRefundResponse,
} from "@performance/migrated/toolkit/order-metrics";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import TableControl from "@core/components/TableControl";

type TableData = {
  readonly productId: string;
  readonly productName?: string | null;
  readonly productImg?: string | null;
  readonly orderCount: number;
  readonly refundCount: number;
  readonly refundRate?: string | null;
};

type Props = BaseProps & {
  readonly formatter: (metric: number) => string;
};

const ProductQualityRefundTable: React.FC<Props> = ({
  style,
  className,
  formatter,
}) => {
  const styles = useStylesheet();

  const [sortField, setSortField] =
    useState<SortProductQualityRefundField | null>("QualityRefundRate");
  const [sortOrder, setSortOrder] = useState<SortByOrder | null>("DESC");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState<string | null | undefined>("");
  const [productImg, setProductImg] = useState<string | null | undefined>("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading } = useQuery<
    WSSProductQualityRefundResponse,
    WSSProductQualityRefundRequest
  >(WSSProductQualityRefundQuery, {
    variables: {
      limit,
      offset,
      sortField: sortOrder && sortField ? sortField : undefined,
      sortOrder: sortOrder && sortField ? sortOrder : undefined,
      productIds: searchInput ? [searchInput] : undefined,
    },
  });

  const total =
    data?.currentMerchant?.wishSellerStandard.deepDive?.productQualityRefund
      .totalCount;

  const tableData =
    data?.currentMerchant?.wishSellerStandard.deepDive?.productQualityRefund.dataSlice.map<TableData>(
      (row) => {
        return {
          productName: row.productName,
          productId: row.productId,
          productImg: row.productImageUrl,
          orderCount: row.receivedOrders,
          refundCount: row.qualityRefundIssued,
          refundRate:
            row.qualityRefundRate != null
              ? formatter(row.qualityRefundRate)
              : undefined,
        };
      },
    );

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "refund_details_view",
      name: i`View Refund Details`,
      canBatch: false,
      canApplyToRow: () => true,
      apply: ([row]: ReadonlyArray<TableData>) => {
        setProductId(row.productId);
        setProductName(row.productName);
        setProductImg(row.productImg);
        setModalOpen(true);
      },
    },
  ];

  const onFieldSortToggled = (field: SortProductQualityRefundField) => {
    return (legoSo: SortOrder) => {
      if (legoSo == "not-applied") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortField(field);
        setSortOrder(GQLSortOrder[legoSo]);
      }
    };
  };

  const getSortOrderForField = (field: SortProductQualityRefundField) => {
    return sortOrder && sortField === field
      ? LegoSortOrder[sortOrder]
      : "not-applied";
  };

  return (
    <>
      <RefundDetailsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        productId={productId}
        productName={productName}
        productImg={productImg}
      />
      <Layout.FlexColumn style={[className, style]}>
        <H4>All refunded products</H4>
        <Layout.FlexRow style={styles.tableSearch}>
          <SearchBox
            icon="search"
            placeholder={i`Search by Product ID`}
            tokenize
            noDuplicateTokens
            maxTokens={1}
            defaultValue={searchInput}
            onTokensChanged={({ tokens }) => {
              if (tokens.length > 0) {
                setSearchInput(tokens[0].trim());
              } else {
                setSearchInput("");
              }
              setOffset(0);
            }}
          />
        </Layout.FlexRow>
        <LoadingIndicator loadingComplete={!loading}>
          <Table
            data={tableData}
            actions={tableActions}
            actionColumnWidth={250}
            keepColumnHeaderVisible
            rowDataCy={(row: TableData) =>
              `refunded-product-row-${row.productId}`
            }
          >
            <Table.Column
              _key="product"
              columnKey="productId"
              title={ci18n("Column name, shows product name and ID", "Product")}
              columnDataCy={"product-column"}
            >
              {({ row }: CellInfo<React.ReactNode, TableData>) => {
                return (
                  <ProductCell
                    id={row.productId}
                    name={row.productName}
                    imgURL={row.productImg}
                  />
                );
              }}
            </Table.Column>
            <Table.Column
              _key="orderCount"
              columnKey="orderCount"
              title={ci18n(
                "Column name, number of orders for the product",
                "Received Orders",
              )}
              columnDataCy={"order-count-column"}
            />
            <Table.Column
              _key="refundCount"
              columnKey="refundCount"
              title={ci18n(
                "Column name, number of refunds for the product",
                "Refunds Issued",
              )}
              columnDataCy={"refund-count-column"}
            />
            <Table.Column
              _key="refundRate"
              columnKey="refundRate"
              title={ci18n(
                "Column name, refund rate for the product",
                "Refund Rate",
              )}
              sortOrder={getSortOrderForField("QualityRefundRate")}
              onSortToggled={onFieldSortToggled("QualityRefundRate")}
              columnDataCy={"refund-rate-column"}
            />
          </Table>
        </LoadingIndicator>
        <TableControl
          limit={limit}
          offset={offset}
          total={total}
          onLimitChange={(limit) => setLimit(limit)}
          onOffsetChange={(offset) => setOffset(offset)}
          style={{ paddingBottom: "0px" }}
        />
      </Layout.FlexColumn>
    </>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        tableSearch: {
          marginTop: 16,
          marginBottom: 24,
        },
        tableControls: {
          padding: "18px 24px",
        },
        tableControl: {
          gap: 24,
        },
        pageSizeControl: {
          gap: 8,
        },
      }),
    [],
  );
};

export default observer(ProductQualityRefundTable);
