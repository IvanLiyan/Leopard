import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Internal Components */
import ShipToWarehouseModal from "@merchant/component/logistics/fbw/shipping-plan/ShipToWarehouseModal";
import ShippingPlanCancelModal from "@merchant/component/logistics/fbw/shipping-plan/ShippingPlanCancelModal";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Merchant Components */
import TrackingNumberModal from "@merchant/component/logistics/shipping-plan/TrackingNumberModal";

/* Internal API */
import { updateShippingPlan } from "@merchant/api/fbw";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TableAction } from "@ContextLogic/lego";

import { ShippingPlanHistory } from "@merchant/api/fbw";
import { Markdown } from "@ContextLogic/lego";
import gql from "graphql-tag";
import {
  LogisticsSchemaShippingProvidersArgs,
  ShippingProviderSchema,
} from "@schema/types";
import { useQuery } from "@apollo/react-hooks";

const GET_SHIPPING_PROVIDERS_QUERY = gql`
  query GetShippingProvidersQuery(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ShippingProviderSearchType
    $states: [ShippingProviderState!]
  ) {
    logistics {
      shippingProviders(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        states: $states
      ) {
        id
        name
      }
    }
  }
`;

type ShippingProviderIDName = Pick<ShippingProviderSchema, "id" | "name">;

type GetShippingProvidersRequestType = LogisticsSchemaShippingProvidersArgs;

type GetShippingProvidersResponseType = {
  readonly logistics: {
    readonly shippingProviders: Array<ShippingProviderIDName>;
  };
};

export type SearchResultTableProp = BaseProps & {
  readonly data: ReadonlyArray<ShippingPlanHistory>;
  readonly stateFilter: "history" | "action-required";
  readonly refreshParent: () => void;
};

const ShippingPlanHistorySearchResultTable = (props: SearchResultTableProp) => {
  const styles = useStylesheet();
  const spTableActions = useTableActions(props);
  const { data, stateFilter } = props;

  const renderIdColumn = (row: ShippingPlanHistory) => (
    <div className={css(styles.verticalCell)}>
      <div className={css(styles.verticalEntry)}>
        <div className={css(styles.verticalEntry)}>
          <Link href={`/fbw/shipping-plan-by-id/${row.id}`}>{row.id}</Link>
        </div>
        <CopyButton
          text={row.id}
          copyOnBodyClick
          hideButtonUntilHover={false}
        />
      </div>
      <div
        className={css(styles.verticalEntry)}
      >{`(${row.fbw_shipping_id})`}</div>
    </div>
  );

  const renderWarehouseColumn = (row: ShippingPlanHistory) => (
    <div className={css(styles.verticalCell)}>
      <div className={css(styles.spaceBottom, styles.spaceTop)}>
        <div className={css(styles.verticalEntry, styles.bold)}>
          {row.warehouse.display_name}
        </div>
        <div className={css(styles.verticalEntry)}>
          {row.delivery_option.address.street_address1}
        </div>
        <div className={css(styles.verticalEntry)}>
          {`${row.delivery_option.address.city}, ` +
            (row.delivery_option.address.state
              ? `${row.delivery_option.address.state} `
              : ``) +
            `${row.delivery_option.address.zipcode}, ${row.delivery_option.address.country}`}
        </div>
      </div>

      <div className={css(styles.spaceBottom)}>
        <div className={css(styles.verticalEntry, styles.bold)}>
          Contact Information
        </div>
        <div className={css(styles.verticalEntry)}>
          {row.warehouse.phone_number}
        </div>
      </div>
    </div>
  );

  const renderSkuColumn = (row: ShippingPlanHistory) => (
    <div
      className={css(styles.skusContainer, styles.spaceTop, styles.spaceBottom)}
    >
      {row.skus.map((sku) => (
        <div className={css(styles.horizontalCell)} key={sku.sku}>
          <div
            className={css(
              styles.preWhiteSpace,
              styles.verticalEntry,
              styles.bold
            )}
          >
            {sku.fbw_sku ? `${sku.sku} (${sku.fbw_sku})` : `${sku.sku}:`}
          </div>
          <div className={css(styles.verticalEntry)}>{sku.quantity}</div>
        </div>
      ))}
    </div>
  );

  const renderActionStatus = (row: ShippingPlanHistory) => {
    const remainingStr = i`${row.time_to_expiry_text} remaining`;
    if (row.action_required && !row.processing) {
      return (
        <>
          {
            <div className={css(styles.verticalCell)}>
              <div className={css(styles.verticalEntry, styles.bold)}>
                {row.state_text}
              </div>
              <div className={css(styles.horizontalCell)}>
                <div className={css(styles.verticalEntry)}>{remainingStr}</div>
                <div className={css(styles.verticalEntry)}>
                  <Info
                    text={() => (
                      <div className={css(styles.paddingAround)}>
                        <Markdown
                          text={
                            i`You have **${row.time_to_expiry_text}** to take the next required ` +
                            i`action before your shipping plan is automatically canceled.`
                          }
                        />
                      </div>
                    )}
                    size={16}
                    position="right center"
                    sentiment="info"
                  />
                </div>
              </div>
            </div>
          }
        </>
      );
    }
    return <div>{row.merchant_next_step_text}</div>;
  };

  const renderHistoryStatus = (row: ShippingPlanHistory) => (
    <div
      className={css(styles.verticalCell, styles.spaceTop, styles.spaceBottom)}
    >
      <div className={css(styles.verticalEntry, styles.bold)}>
        {row.state_text}
      </div>
      <div className={css(styles.verticalEntry)}>
        {row.merchant_next_step_text}
      </div>
    </div>
  );

  return (
    <Table
      className={css(styles.root)}
      actions={spTableActions}
      data={data}
      maxVisibleColumns={9}
      noDataMessage={i`There is no entry matching search input`}
      highlightRowOnHover
      actionColumnWidth={240}
    >
      <Table.Column
        title={i`Date Created`}
        columnKey="date_created"
        width={110}
      />
      <Table.Column title={i`Shipping Plan ID`} multiline columnKey="id">
        {({ row }) => renderIdColumn(row)}
      </Table.Column>

      <Table.Column
        title={i`SKUs in Shipping Plan`}
        columnKey="id"
        description={i`The SKUs in this shipping plan and the quantity of each SKU`}
      >
        {({ row }) => renderSkuColumn(row)}
      </Table.Column>
      <Table.Column
        title={i`Total Quantity`}
        columnKey="total_quantity"
        description={i`The total number of SKUs in this shipping plan`}
        width={125}
      />
      <Table.Column title={i`Warehouse`} columnKey="warehouse_id">
        {({ row }) => renderWarehouseColumn(row)}
      </Table.Column>
      {stateFilter === "history" ? (
        <Table.Column
          title={i`Status`}
          columnKey="state_text"
          multiline
          width={250}
        >
          {({ row }) => renderHistoryStatus(row)}
        </Table.Column>
      ) : (
        <Table.Column
          title={i`Status`}
          columnKey="state_text"
          width={175}
          multiline
        >
          {({ row }) => renderActionStatus(row)}
        </Table.Column>
      )}
    </Table>
  );
};

export default ShippingPlanHistorySearchResultTable;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        verticalCell: {
          display: "flex",
          flexDirection: "column",
        },
        horizontalCell: {
          display: "flex",
        },
        verticalEntry: {
          display: "flex",
          marginRight: 5,
        },
        createButton: {},
        bold: {
          fontWeight: fonts.weightBold,
        },
        spaceBottom: {
          marginBottom: 10,
        },
        spaceTop: {
          marginTop: 10,
        },
        paddingAround: {
          padding: 5,
        },
        preWhiteSpace: {
          whiteSpace: "pre",
        },
        skusContainer: {
          maxHeight: 120,
          paddingRight: 10,
          overflowY: "auto",
        },
      }),
    []
  );
};

const useTableActions = (props: SearchResultTableProp): Array<TableAction> => {
  const {
    userStore: { isSu, loggedInMerchantUser },
  } = AppStore.instance();
  const [loadingRows, setLoadingRows] = useState<Array<string>>([]);
  const isMerchant = loggedInMerchantUser.is_merchant;
  const { stateFilter, refreshParent } = props;

  const { data: shippingProvidersData } = useQuery<
    GetShippingProvidersResponseType,
    GetShippingProvidersRequestType
  >(GET_SHIPPING_PROVIDERS_QUERY, {
    variables: {
      offset: 0,
      limit: 0,
      query: null,
      searchType: null,
      states: [],
    },
    fetchPolicy: "no-cache",
  });

  const shippingProviders = shippingProvidersData?.logistics.shippingProviders;
  const shippingProvidersDict: { [key: string]: string } = {};

  if (shippingProviders) {
    for (const shippingProvider of shippingProviders) {
      shippingProvidersDict[shippingProvider.id] = shippingProvider.name;
    }
  }

  return [
    {
      key: "ship_warehouse",
      name: i`Ship to Warehouse`,
      canBatch: false,
      canApplyToRow: (row: ShippingPlanHistory) => {
        if (stateFilter === "history") {
          return false;
        }
        return (
          row.action_required && isMerchant && row.submitted && !row.processing
        );
      },
      apply: ([row]: ReadonlyArray<ShippingPlanHistory>) => {
        const deliveryMethod = row.delivery_method_name;
        let modalText = "";
        if (deliveryMethod === "DROP_OFF") {
          modalText = i`Have you dropped off the packages at the warehouse?`;
        } else if (deliveryMethod === "PICK_UP") {
          modalText = i`Has the shipment been picked up by the carrier?`;
        } else if (deliveryMethod === "SHIP_BULK") {
          modalText = i`Have you shipped the case to the warehouse?`;
        } else if (deliveryMethod === "SHIP_INDIVIDUAL") {
          modalText = i`Have you shipped the packages to the warehouse?`;
        }

        if (deliveryMethod === "DROP_OFF" || !row.allow_submit_tracking_info) {
          new ShipToWarehouseModal({
            title: modalText,
            trackingNumbers: row.tracking_numbers.join(","),
            id: row.id,
            refreshParent,
          }).render();
        } else {
          new TrackingNumberModal({
            trackings: [],
            providers: shippingProvidersDict,
            shippingPlanId: row.id,
            updateTrackings: () => null,
            refreshParent,
          }).render();
        }
      },
    },
    {
      key: "submit",
      name: i`Submit`,
      canBatch: false,
      isLoading: ([row]: ReadonlyArray<ShippingPlanHistory>) => {
        return loadingRows.includes(row.id);
      },
      canApplyToRow: (row: ShippingPlanHistory) => {
        if (stateFilter === "history") {
          return false;
        }
        return (
          row.action_required && isMerchant && !row.processing && row.can_submit
        );
      },
      apply: async ([row]: ReadonlyArray<ShippingPlanHistory>) => {
        if (!loadingRows.includes(row.id)) {
          setLoadingRows([...loadingRows, row.id]);
        }
        await updateShippingPlan({
          id: row.id,
          state: "SUBMITTED",
        }).call();
        setLoadingRows(
          loadingRows.filter((currentId: string) => {
            return row.id !== currentId;
          })
        );
      },
      href: ([row]: ReadonlyArray<ShippingPlanHistory>) =>
        `/fbw/shipping-plan-by-id/${row.id}`,
    },
    {
      key: "resubmit",
      name: i`Resubmit`,
      canBatch: false,
      isLoading: ([row]: ReadonlyArray<ShippingPlanHistory>) => {
        return loadingRows.includes(row.id);
      },
      canApplyToRow: (row: ShippingPlanHistory) => {
        if (stateFilter === "history") {
          return false;
        }
        return (
          row.action_required &&
          ((isMerchant && !row.processing && row.submit_failed) ||
            (row.processing && isSu))
        );
      },
      apply: async ([row]: ReadonlyArray<ShippingPlanHistory>) => {
        if (!loadingRows.includes(row.id)) {
          setLoadingRows([...loadingRows, row.id]);
        }
        await updateShippingPlan({
          id: row.id,
          state: "SUBMITTED",
        }).call();
        setLoadingRows(
          loadingRows.filter((currentId: string) => {
            return row.id !== currentId;
          })
        );
      },
      href: ([row]: ReadonlyArray<ShippingPlanHistory>) =>
        `/fbw/shipping-plan-by-id/${row.id}`,
    },
    {
      key: "cancel",
      name: i`Cancel`,
      canBatch: false,
      canApplyToRow: (row: ShippingPlanHistory) => {
        if (stateFilter === "history") {
          return false;
        }
        return (
          row.action_required && isMerchant && !row.processing && row.can_submit
        );
      },
      apply: ([row]: ReadonlyArray<ShippingPlanHistory>) => {
        new ShippingPlanCancelModal({
          skus: row.tracking_numbers.join(","),
          id: row.id,
          refreshParent,
        }).render();
      },
    },
    {
      key: "view_details",
      name: i`View Details`,
      canBatch: false,
      canApplyToRow: () => true,
      href: ([row]: ReadonlyArray<ShippingPlanHistory>) =>
        `/fbw/shipping-plan-by-id/${row.id}`,
    },
  ];
};
