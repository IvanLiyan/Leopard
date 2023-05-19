import { NextPage } from "next";
import { observer } from "mobx-react";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { formatCurrency } from "@core/toolkit/currency";
import { Alert, LoadingIndicator } from "@ContextLogic/lego";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import {
  PERFORMANCE_PRODUCT_DATA_QUERY,
  ProductDataQueryResponse,
  ProductDataQueryArguments,
  PickedProduct,
} from "@performance/toolkit/product";
import { Table, Icon } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import { addCommas, round } from "@core/toolkit/stringUtils";

import {
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import { useExportCSV } from "@performance/toolkit/utils";
import commonStyles from "@performance/styles/common.module.css";
import PageHeader from "@core/components/PageHeader";
import { merchFeUrl } from "@core/toolkit/router";
import { useTheme } from "@core/stores/ThemeStore";

const PerformanceProductPage: NextPage<Record<string, never>> = () => {
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const { data, loading } = useQuery<
    ProductDataQueryResponse,
    ProductDataQueryArguments
  >(PERFORMANCE_PRODUCT_DATA_QUERY, {
    variables: {
      weeks: 20,
    },
  });

  const currencyCodeForExportCSV = data?.currentMerchant?.primaryCurrency;

  const tableData: ReadonlyArray<PickedProduct> | undefined = useMemo(() => {
    return data?.currentMerchant?.storeStats?.weekly?.map(
      (week) => week.product,
    );
  }, [data?.currentMerchant?.storeStats?.weekly]);

  const columns = useMemo(() => {
    const columns: ReadonlyArray<TableColumn<PickedProduct>> = [
      {
        title: i`Time Period`,
        key: "RangeDate",
        align: "left",
        render: ({ row: { startDate, endDate } }) => (
          <div>{`${startDate.mmddyyyy}-${endDate.mmddyyyy}`}</div>
        ),
      },
      {
        key: "activeProducts",
        titleRender: () => (
          <>
            <span>Enabled Products With Inventory</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  The number of products your store has enabled, with nonzero
                  inventory
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { activeProducts } }) => {
          if (activeProducts == null) {
            return "-";
          }
          return addCommas(String(activeProducts));
        },
      },
      {
        key: "activeSkus",
        titleRender: () => (
          <>
            <span>Total SKUs</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>Number of active SKUs</div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { activeSkus } }) => {
          if (activeSkus == null) {
            return "-";
          }
          return addCommas(String(activeSkus));
        },
      },
      {
        key: "skusPerProduct",
        titleRender: () => (
          <>
            <span>SKUs Per Product</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Active SKUs divided by active products
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { skusPerProduct } }) => {
          if (skusPerProduct == null) {
            return "-";
          }
          return round(String(skusPerProduct), 2);
        },
      },

      {
        key: "averagePrice",
        titleRender: () => (
          <>
            <span>Average Price</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>Average price of orders</div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averagePrice } }) =>
          averagePrice
            ? formatCurrency(averagePrice.amount, averagePrice.currencyCode)
            : "-",
      },
      {
        key: "averageShippingPrice",
        titleRender: () => (
          <>
            <span>Average Shipping</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Average shipping price of orders
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageShippingPrice } }) =>
          averageShippingPrice
            ? formatCurrency(
                averageShippingPrice.amount,
                averageShippingPrice.currencyCode,
              )
            : "-",
      },
      {
        key: "priceToShippingRatio",
        titleRender: () => (
          <>
            <span>Price to Shipping Ratio</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Average price divided by average shipping
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { priceToShippingRatio } }) => {
          if (priceToShippingRatio == null) {
            return "-";
          }
          return round(String(priceToShippingRatio), 2);
        },
      },
      {
        key: "averageAdditonalImagesPerProduct",
        titleRender: () => (
          <>
            <span>Average Additional Images Per Product</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Total number of additional images divide by number of active
                  products
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageAdditonalImagesPerProduct } }) => {
          if (averageAdditonalImagesPerProduct == null) {
            return "-";
          }
          return round(String(averageAdditonalImagesPerProduct), 2);
        },
      },
      {
        key: "productImpressions",
        titleRender: () => (
          <>
            <span>Impressions</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of times your products were viewed
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { productImpressions } }) => {
          if (productImpressions == null) {
            return "-";
          }
          return addCommas(String(productImpressions));
        },
      },
      {
        key: "gmv",
        titleRender: () => (
          <>
            <span>GMV</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Gross merchandising value
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),

        render: ({ row: { gmv } }) =>
          gmv ? formatCurrency(gmv.amount, gmv.currencyCode) : "-",
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeUrl("/home") },
          { name: i`Performance`, href: merchFeUrl("/performance-overview") },
          { name: i`Product Performance`, href: window.location.href },
        ]}
        title={i`Product Performance`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <div className={commonStyles.toolkit}>
          <div />
          {tableData && tableData.length > 0 && (
            <Button
              secondary
              onClick={() =>
                exportCSV({
                  type: EXPORT_CSV_TYPE.MERCHANT,
                  stats_type: EXPORT_CSV_STATS_TYPE.PRODUCT_OVERVIEW,
                  currencyCode: currencyCodeForExportCSV,
                  target_date:
                    new Date(
                      tableData[tableData.length - 1].startDate.mmddyyyy,
                    ).getTime() / 1000,
                })
              }
            >
              Export CSV
            </Button>
          )}
        </div>
        {loading ? (
          <LoadingIndicator className={commonStyles.loading} />
        ) : tableData ? (
          <Table data={tableData} columns={columns} />
        ) : (
          <div>No data available</div>
        )}
      </PageGuide>
    </PageRoot>
  );
};

export default observer(PerformanceProductPage);
