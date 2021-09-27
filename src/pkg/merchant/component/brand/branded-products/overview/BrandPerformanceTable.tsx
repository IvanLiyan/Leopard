import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { PageIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { SortOrder } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BrandPerformanceOverviewState from "@merchant/model/brand/branded-products/BrandPerformanceOverviewState";
import { BrandDataEntry } from "@merchant/api/brand/branded-product-overview";

type BrandPerformanceTableProps = BaseProps & {
  readonly pageState: BrandPerformanceOverviewState;
};

type Column = "gmv" | "orders" | "impressions" | "products";

const DEFAULT_PAGE_SIZE = 5;
const PAGE_SIZES = [5, 10, 25];
const PAGE_SIZE_OPTIONS = PAGE_SIZES.map((v) => {
  return {
    value: v,
    text: v.toString(),
  };
});

const BrandPerformanceTable = ({
  pageState,
  className,
}: BrandPerformanceTableProps) => {
  const styles = useStylesheet();

  /*
   * Pagination & (Frontend) Search
   */
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [rawPageSize, setPageSize] = useIntQueryParam("page_size");
  const [brandQuery, setBrandQuery] = useStringQueryParam("brand_query");
  const [sortOrder, setSortOrder] = useStringEnumQueryParam<SortOrder>(
    "sort_order",
    "desc",
  );
  const [sortColumn, setSortColumn] = useStringEnumQueryParam<Column>(
    "sort_column",
    "gmv",
  );

  const offset = rawOffset || 0;
  const pageSize = rawPageSize || DEFAULT_PAGE_SIZE;

  const [tableData, setTableData] = useState<
    ReadonlyArray<BrandDataEntry> | undefined
  >();
  const isLoading = tableData == undefined;
  useEffect(() => {
    /*
     * Process the table data for display:
     * 1. Filter by the brand search query text if entered
     * 2. Sort by the selected column & sort order
     * 3. The data is paginate at the table with .slice()
     */
    setOffset(0);
    const newTableData = pageState.brandData
      .filter(
        (brandDataEntry) =>
          !brandQuery ||
          brandDataEntry.brand_name
            .toLowerCase()
            .includes(brandQuery.toLowerCase()),
      )
      .sort((a, b) => {
        const sortDir = sortOrder === "asc" ? 1 : -1;
        return sortDir * (a[sortColumn] - b[sortColumn]);
      });

    setTableData(newTableData);
  }, [pageState.brandData, brandQuery, sortOrder, sortColumn, setOffset]);

  const total = tableData?.length || 0;
  const remaining = total ? total - offset : 0;

  const onSortToggled = (column: Column) => {
    return (sortOrder: SortOrder) => {
      setSortColumn(column);
      setSortOrder(sortOrder);
    };
  };

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.row)}>
        <TextInput
          value={brandQuery}
          onChange={({ text }: { text: string }) => setBrandQuery(text)}
          icon="search"
          placeholder={i`Search by brand`}
          className={css(styles.brandSearch)}
        />
        <div className={css(styles.pagination)}>
          <PageIndicator
            rangeStart={1 + offset}
            rangeEnd={offset + Math.min(pageSize, remaining)}
            totalItems={total}
            hasNext={remaining > pageSize}
            hasPrev={offset > 0}
            currentPage={Math.floor(offset / pageSize)}
            onPageChange={(page) => {
              setOffset(page * pageSize);
            }}
            isLoading={isLoading}
            padding="8px 12px"
            className={css(styles.pageIndicator)}
          />
          <Select
            selectedValue={pageSize}
            options={PAGE_SIZE_OPTIONS}
            onSelected={(v) => setPageSize(v)}
            buttonHeight={40}
            className={css(styles.select)}
          />
        </div>
      </div>
      <Table data={tableData && tableData.slice(offset, offset + pageSize)}>
        <Table.Column
          renderHeader={() => (
            <div className={css(styles.firstColumn)}>Brand</div>
          )}
          columnKey="brand_name"
          width={300}
          className={css(styles.firstColumn)}
        >
          {({ row }) => (
            <div className={css(styles.brandCell)}>
              {row.is_abs && (
                <Icon
                  name="authenticBrandSellerBadge"
                  style={css(styles.badge)}
                />
              )}
              <div>{row.brand_name}</div>
            </div>
          )}
        </Table.Column>
        <Table.CurrencyColumn
          title={i`GMV`}
          columnKey="gmv"
          currencyCode={pageState.currencyCode}
          description={i`This is the total Gross Merchandise Value (GMV) of the selected time period.`}
          sortOrder={sortColumn === "gmv" ? sortOrder : "not-applied"}
          onSortToggled={onSortToggled("gmv")}
          width={100}
        />
        <Table.NumeralColumn
          title={i`Orders`}
          columnKey="orders"
          description={i`This is the total amount of orders of the selected time period.`}
          sortOrder={sortColumn === "orders" ? sortOrder : "not-applied"}
          onSortToggled={onSortToggled("orders")}
          width={100}
        />
        <Table.NumeralColumn
          title={i`Impressions`}
          columnKey="impressions"
          description={i`This is the total amount of impressions of the selected time period.`}
          sortOrder={sortColumn === "impressions" ? sortOrder : "not-applied"}
          onSortToggled={onSortToggled("impressions")}
          width={100}
        />
        <Table.NumeralColumn
          title={i`Products`}
          columnKey="products"
          description={i`This is the total number of products from this brand.`}
          sortOrder={sortColumn === "products" ? sortOrder : "not-applied"}
          onSortToggled={onSortToggled("products")}
          width={100}
        />
      </Table>
    </div>
  );
};

export default observer(BrandPerformanceTable);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {},
        row: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 24,
          marginRight: 24,
        },
        brandSearch: {
          flex: 1,
          maxWidth: 400,
        },
        pagination: {
          display: "flex",
          flexDirection: "row",
        },
        pageIndicator: {
          marginRight: 12,
        },
        select: {
          width: 64,
        },
        firstColumn: {
          paddingLeft: 10,
        },
        brandCell: {
          display: "flex",
          flexDirection: "row",
        },
        badge: {
          marginRight: "10px",
          alignSelf: "center",
        },
      }),
    [],
  );
