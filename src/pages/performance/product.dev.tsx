import { NextPage } from "next";
import { observer } from "mobx-react";
import { useEffect, forwardRef } from "react";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import UnwrappedIcon, { IconProps } from "@core/components/Icon";
import { formatCurrency } from "@core/toolkit/currency";
import { Alert, LoadingIndicator } from "@ContextLogic/lego";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import store, {
  PERFORMANCE_PRODUCT_DATA_QUERY,
  ProductDataQueryResponse,
  ProductDataQueryArguments,
  AugmentedProduct,
} from "@performance/stores/Product";
import { Table } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import { addCommas, round } from "@core/toolkit/stringUtils";
import { useUserStore } from "@core/stores/UserStore";
import {
  CURRENCY_CODE,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import { exportCSV, isBD } from "@performance/toolkit/utils";
import commonStyles from "@performance/styles/common.module.css";
import styles from "@performance/styles/product.module.css";
import PageHeader from "@core/components/PageHeader";
import { merchFeURL } from "@core/toolkit/url";

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => (
  // extra div because Icon does not currently forward refs, changes required at the Zeus level
  <span ref={ref}>
    <UnwrappedIcon {...props} />
  </span>
));
Icon.displayName = "Icon";

const columns: ReadonlyArray<TableColumn> = [
  {
    title: i`Time Period`,
    key: "RangeDate",
    render: ({ row: { startDate, endDate } }) => (
      <div style={{ textAlign: "left" }}>
        {`${startDate.mmddyyyy}-${endDate.mmddyyyy}`}
      </div>
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["activeProducts"];
      if (valueCast == null) {
        return "-";
      }
      return addCommas(String(valueCast));
    },
  },
  {
    key: "activeSkus",
    titleRender: () => (
      <>
        <span>Total SKUs</span>
        <Tooltip
          title={<div style={{ fontSize: "14px" }}>Number of active SKUs</div>}
          className={commonStyles.tableTooltip}
        >
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["activeSkus"];
      if (valueCast == null) {
        return "-";
      }
      return addCommas(String(valueCast));
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["skusPerProduct"];
      if (valueCast == null) {
        return "-";
      }
      return round(String(valueCast), 2);
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["averagePrice"];
      const amount =
        store.currencyCode === CURRENCY_CODE.CNY
          ? valueCast?.CNY_amount
          : valueCast?.USD_amount;
      if (amount == null) {
        return "-";
      }
      return formatCurrency(amount, store.currencyCode);
    },
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["averageShippingPrice"];
      const amount =
        store.currencyCode === CURRENCY_CODE.CNY
          ? valueCast?.CNY_amount
          : valueCast?.USD_amount;
      if (amount == null) {
        return "-";
      }
      return formatCurrency(amount, store.currencyCode);
    },
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["priceToShippingRatio"];
      if (valueCast == null) {
        return "-";
      }
      return round(String(valueCast), 2);
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast =
        value as AugmentedProduct["averageAdditonalImagesPerProduct"];
      if (valueCast == null) {
        return "-";
      }
      return round(String(valueCast), 2);
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
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),
    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["productImpressions"];
      if (valueCast == null) {
        return "-";
      }
      return addCommas(String(valueCast));
    },
  },
  {
    key: "gmv",
    titleRender: () => (
      <>
        <span>GMV</span>
        <Tooltip
          title={
            <div style={{ fontSize: "14px" }}>Gross merchandising value</div>
          }
          className={commonStyles.tableTooltip}
        >
          <Icon name="help" size={20} color={"#000"} />
        </Tooltip>
      </>
    ),

    render: ({ value }) => {
      const valueCast = value as AugmentedProduct["gmv"];
      const amount =
        store.currencyCode === CURRENCY_CODE.CNY
          ? valueCast?.CNY_amount
          : valueCast?.USD_amount;
      if (amount == null) {
        return "-";
      }
      return formatCurrency(amount, store.currencyCode);
    },
  },
];

const PerformanceProductPage: NextPage<Record<string, never>> = () => {
  const { loggedInMerchantUser } = useUserStore();
  const { merchantId, id, roles } = loggedInMerchantUser || {};
  const is_bd = isBD(roles || []);
  const exportId = is_bd ? id : merchantId;
  const { data, loading } = useQuery<
    ProductDataQueryResponse,
    ProductDataQueryArguments
  >(PERFORMANCE_PRODUCT_DATA_QUERY, {
    variables: {
      weeks: 20,
    },
  });

  useEffect(() => {
    data && store.updatePerProductData(data);
  }, [data]);

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          { name: i`Product Performance`, href: window.location.href },
        ]}
        title={i`Product Performance`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <div className={styles.toolkit}>
          {store.productCNYFlag && (
            <div>
              <Button
                secondary
                disabled={store.currencyCode === CURRENCY_CODE.USD}
                onClick={() => store.updateCurrencyCode(CURRENCY_CODE.USD)}
              >
                Display in USD $
              </Button>
              <Button
                secondary
                disabled={store.currencyCode === CURRENCY_CODE.CNY}
                onClick={() => store.updateCurrencyCode(CURRENCY_CODE.CNY)}
              >
                Display in CNY ¥
              </Button>
              <Tooltip
                title={
                  <div style={{ fontSize: "14px" }}>
                    USD values recorded prior to your CNY migration date are
                    being calculated at 1 USD = 7.0 CNY, in order to view full
                    performance data in CNY
                  </div>
                }
              >
                <span className={commonStyles.calculateText}>
                  How are currency values calculated?
                </span>
              </Tooltip>
            </div>
          )}

          <Button
            secondary
            className={styles.downloadBtn}
            onClick={() =>
              exportCSV({
                type: EXPORT_CSV_TYPE.MERCHANT,
                stats_type: EXPORT_CSV_STATS_TYPE.PRODUCT_OVERVIEW,
                id: exportId,
                is_bd,
                currencyCode: store.currencyCode,
                target_date:
                  new Date(
                    store.data[store.data.length - 1].startDate.mmddyyyy,
                  ).getTime() / 1000,
              })
            }
          >
            Export CSV
          </Button>
        </div>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <Table data={store.data} columns={columns} />
        )}
      </PageGuide>
    </PageRoot>
  );
};

export default observer(PerformanceProductPage);
