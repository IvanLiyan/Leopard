import {
  CellInfo,
  H4,
  Layout,
  LoadingIndicator,
  SearchBox,
  SortOrder,
  Spinner,
  Table,
  TableAction,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Flag from "@core/components/Flag";
import PopoverFilterButton from "./PopoverFilterButton";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { SortOrderFulfillmentSpeed, SortByOrder, CountryCode } from "@schema";
import {
  GQLSortOrder,
  LegoSortOrder,
  WSSConfirmedFulfillmentSpeedQuery,
  WSSConfirmedFulfillmentSpeedRequest,
  WSSConfirmedFulfillmentSpeedResponse,
  WSSDestinationOptionsResponse,
  WSSDestinationOptionsRequest,
  WSSDestinationOptionsQuery,
  WSSCarrierOptionsResponse,
  WSSCarrierOptionsRequest,
  WSSCarrierOptionsQuery,
} from "@performance/migrated/toolkit/order-metrics";
import { css } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import CarrierFilter from "./CarrierFilter";
import DestinationFilter from "./DestinationFilter";
import TableControl from "@core/components/TableControl";

type TableData = {
  readonly orderId?: string | null;
  readonly transactionDate: string;
  readonly trackingId?: string | null;
  readonly program?: string | null;
  readonly fulfillmentSpeed?: string | null;
  readonly destination?: string | null;
};

type Props = BaseProps & {
  readonly formatter: (score: number) => string;
};

const ConfirmedFulfillmentSpeedTable: React.FC<Props> = ({
  style,
  className,
  formatter,
}) => {
  const styles = useStylesheet();
  const { locale } = useLocalizationStore();

  const [sortField, setSortField] = useState<SortOrderFulfillmentSpeed | null>(
    "TransactionDate",
  );
  const [sortOrder, setSortOrder] = useState<SortByOrder | null>("DESC");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");

  // null to select all
  const [destinations, setDestinations] =
    useState<ReadonlyArray<CountryCode> | null>(null);
  const [carriers, setCarriers] = useState<ReadonlyArray<string> | null>(null);

  const { data, loading } = useQuery<
    WSSConfirmedFulfillmentSpeedResponse,
    WSSConfirmedFulfillmentSpeedRequest
  >(WSSConfirmedFulfillmentSpeedQuery, {
    variables: {
      limit,
      offset,
      orderIds: searchInput ? [searchInput] : undefined,
      sortField: sortOrder && sortField ? sortField : undefined,
      sortOrder: sortOrder && sortField ? sortOrder : undefined,
      destinations,
      carriers,
    },
  });

  const {
    data: destinationOptionsData,
    loading: loadingDestinationOptionsData,
  } = useQuery<WSSDestinationOptionsResponse, WSSDestinationOptionsRequest>(
    WSSDestinationOptionsQuery,
    {
      variables: {
        pageType: "FULFILLMENT_SPEED",
      },
      fetchPolicy: "no-cache",
    },
  );

  const destinationOptions = (destinationOptionsData?.currentMerchant
    ?.wishSellerStandard.deepDive?.destinations ??
    []) as ReadonlyArray<CountryCode>;

  const { data: carrierOptionsData, loading: loadingCarrierOptionsData } =
    useQuery<WSSCarrierOptionsResponse, WSSCarrierOptionsRequest>(
      WSSCarrierOptionsQuery,
      {
        variables: {
          pageType: "FULFILLMENT_SPEED",
        },
        fetchPolicy: "no-cache",
      },
    );

  const carrierOptions = (carrierOptionsData?.currentMerchant
    ?.wishSellerStandard.deepDive?.carriers ??
    []) as ReadonlyArray<CountryCode>;

  const total =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderFulfillmentSpeed
      .totalCount;

  const tableData =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderFulfillmentSpeed.dataSlice.map<TableData>(
      (row) => {
        return {
          orderId: row.orderId,
          transactionDate: new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(new Date(row.transactionDate.unix * 1000)),
          trackingId: row.trackingId,
          program: row.carrier,
          fulfillmentSpeed:
            row.fulfillmentSpeed?.days != null
              ? formatter(row.fulfillmentSpeed.days)
              : undefined,
          destination: row.destination,
        };
      },
    );

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "order_details_view",
      name: i`View Order Details`,
      canBatch: false,
      canApplyToRow: () => true,
      href: ([row]: ReadonlyArray<TableData>) => {
        return `/order/${row.orderId}`;
      },
      openInNewTab: true,
    },
  ];

  const onFieldSortToggled = (field: SortOrderFulfillmentSpeed) => {
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

  const getSortOrderForField = (field: SortOrderFulfillmentSpeed) => {
    return sortOrder && sortField === field
      ? LegoSortOrder[sortOrder]
      : "not-applied";
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H4>All matured orders</H4>
      <Layout.FlexRow style={styles.tableSearch}>
        <SearchBox
          icon="search"
          placeholder={i`Search by Order ID`}
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
          rowDataCy={(row: TableData) => `matured-order-row-${row.orderId}`}
        >
          <Table.ObjectIdColumn
            _key="orderId"
            columnKey="orderId"
            title={ci18n("Column name, shows order ID", "Order ID")}
            showFull={false}
            columnDataCy={"order-id-column"}
          />
          <Table.Column
            _key="transactionDate"
            columnKey="transactionDate"
            title={ci18n(
              "Column name, transaction date of the order",
              "Transaction date",
            )}
            sortOrder={getSortOrderForField("TransactionDate")}
            onSortToggled={onFieldSortToggled("TransactionDate")}
            columnDataCy={"transaction-date-column"}
          />
          <Table.ObjectIdColumn
            _key="trackingId"
            columnKey="trackingId"
            title={ci18n(
              "Column name, shows order's tracking ID",
              "Tracking ID",
            )}
            showFull={false}
            columnDataCy={"tracking-id-column"}
          />
          <Table.Column
            _key="program"
            columnKey="program"
            title={() => (
              <Layout.FlexRow>
                {ci18n(
                  "Means the carrier used for an order, e.g. USPS, UPS",
                  "Carrier",
                )}
                <PopoverFilterButton
                  isActive={
                    !!carriers &&
                    !!carrierOptions &&
                    carriers.length < carrierOptions.length
                  }
                  count={carriers?.length}
                  popoverContent={() =>
                    loadingCarrierOptionsData ? (
                      <Spinner />
                    ) : (
                      <CarrierFilter
                        options={carrierOptions ? carrierOptions : null}
                        selected={carriers}
                        onConfirm={(data) => setCarriers(data)}
                      />
                    )
                  }
                />
              </Layout.FlexRow>
            )}
            columnDataCy={"carrier-column"}
          />
          <Table.Column
            _key="fulfillmentSpeed"
            columnKey="fulfillmentSpeed"
            title={i`Confirmed Fulfillment Speed`}
            sortOrder={getSortOrderForField("FulfillmentSpeed")}
            onSortToggled={onFieldSortToggled("FulfillmentSpeed")}
            columnDataCy={"fulfillment-speed-column"}
          />
          <Table.Column
            _key="destination"
            columnKey="destination"
            title={() => (
              <Layout.FlexRow>
                {ci18n("Means the shipping country of an order", "Destination")}
                <PopoverFilterButton
                  isActive={
                    !!destinations &&
                    !!destinationOptions &&
                    destinations.length < destinationOptions.length
                  }
                  count={destinations?.length}
                  popoverContent={() =>
                    loadingDestinationOptionsData ? (
                      <Spinner />
                    ) : (
                      <DestinationFilter
                        options={
                          destinationOptions
                            ? (destinationOptions as CountryCode[])
                            : null
                        }
                        selected={destinations}
                        onConfirm={(data) => setDestinations(data)}
                      />
                    )
                  }
                />
              </Layout.FlexRow>
            )}
            columnDataCy={"destination-column"}
          >
            {({ row }: CellInfo<React.ReactNode, TableData>) => {
              return (
                row.destination && (
                  <Flag
                    className={css(styles.flag)}
                    aspectRatio="4x3"
                    countryCode={row.destination as CountryCode}
                    displayCountryName
                  />
                )
              );
            }}
          </Table.Column>
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
        flag: {
          width: 24,
        },
      }),
    [],
  );
};

export default observer(ConfirmedFulfillmentSpeedTable);
