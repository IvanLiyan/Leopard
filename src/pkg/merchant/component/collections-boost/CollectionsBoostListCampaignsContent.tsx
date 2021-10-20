import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";
import numeral from "numeral";

/* Lego Components */
import {
  LoadingIndicator,
  Alert,
  TableAction,
  PageIndicator,
  CopyButton,
  Switch,
} from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  useDateQueryParam,
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringEnumArrayQueryParam,
} from "@toolkit/url";

/* Merchant Components */
import CollectionBoostStatusLabel from "@merchant/component/collections-boost/CollectionBoostStatusLabel";
import CollectionsBoostCampaignRowExpand from "@merchant/component/collections-boost/CollectionsBoostCampaignRowExpand";
import EditCampaignModal from "@merchant/component/collections-boost/modals/EditCampaignModal";
import CollectionBoostCampaignSearch from "@merchant/component/collections-boost/CollectionBoostCampaignSearch";
import CollectionBoostCampaignsFilter from "@merchant/component/collections-boost/CollectionBoostCampaignsFilter";

/* Type Import */
import Campaign from "@merchant/model/collections-boost/Campaign";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

/* Type Import */
import {
  CollectionsBoostCampaignState,
  CampaignSearchType,
} from "@merchant/api/collections-boost";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { getCancelReasonDetail } from "@toolkit/collections-boost/tooltips";
import { useLogger } from "@toolkit/logger";
import { formatCurrency } from "@toolkit/currency";

/* Merchant Store */
import { useToastStore } from "@stores/ToastStore";
import { useUserStore } from "@stores/UserStore";
import { Info, Layout, Text } from "@ContextLogic/lego";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

const PageSize = 15;
const DateFormat = "YYYY-MM-DD";

const CollectionsBoostListCampaignsContent = () => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const { merchantId } = useUserStore();
  const logger = useLogger("COLLECTIONS_BOOST_UI");

  useEffect(() => {
    // Log view
    logger.info({
      merchant_id: merchantId,
      action: "view list collections page",
    });
  }, [merchantId, logger]);

  const [pageOffsetArg, setPageOffsetArg] = useIntQueryParam("offset");

  const [searchType, setSearchType] =
    useStringEnumQueryParam<CampaignSearchType>("search_type", "campaign_id");
  const [searchInput, setSearchInput] = useStringQueryParam("search_value");
  const [filterStates, setFilterStates] =
    useStringEnumArrayQueryParam<CollectionsBoostCampaignState>(
      "filter_states",
    );

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));

  const [filterStartDate, setFilterStartDate] = useDateQueryParam("start_date");
  const [filterEndDate, setFilterEndDate] = useDateQueryParam("end_date");
  const filterStartDateString = filterStartDate
    ? moment(filterStartDate).format(DateFormat)
    : null;
  const filterEndDateString = filterEndDate
    ? moment(filterEndDate).format(DateFormat)
    : null;

  const pageOffset = pageOffsetArg || 0;

  const [merchantInfoResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostMerchantInfo({}),
  );
  const merchantInfoStats = merchantInfoResponse?.data;
  const priceDropEnabled = merchantInfoStats?.price_drop_enabled;

  const [
    collectionsBoostCampaignsResponse,
    refreshCollectionsBoostCampaignsResponse,
  ] = useRequest(
    collectionsBoostApi.getCollectionsBoostCampaigns({
      count: PageSize,
      start: pageOffset,
      filter_states: filterStates,
      search_type: searchType,
      search_value: searchInput,
      filter_start_date: filterStartDateString,
      filter_end_date: filterEndDateString,
    }),
  );

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setPageOffsetArg(nextPage * PageSize);
  };

  const campaignsData = collectionsBoostCampaignsResponse?.data;

  const tableRows = campaignsData?.results.rows || [];

  const isLoading =
    !collectionsBoostCampaignsResponse?.data || priceDropEnabled == undefined;

  const feedEnded = campaignsData?.results.feed_ended;

  const numResults = campaignsData?.results.num_results || 0;
  const rangeEnd = Math.min(pageOffset + PageSize, numResults);

  const renderStateLabel = (
    row: collectionsBoostApi.CollectionsBoostApiCampaign,
  ) => {
    const { state, cancel_reason: cancelReason } = row;
    const cancelReasonDetail = getCancelReasonDetail(cancelReason || "");
    return (
      <div className={css(styles.statusLabelContent)}>
        <CollectionBoostStatusLabel status={state} />
        {state === "CANCELED" && cancelReason && (
          <Info
            className={css({ marginLeft: 5 })}
            popoverContent={() => (
              <div className={css(styles.popover)}>
                <div className={css(styles.smallTextTitle)}>
                  {cancelReasonDetail}
                </div>
              </div>
            )}
            popoverMaxWidth={200}
          />
        )}
      </div>
    );
  };

  const renderCollectionName = (
    row: collectionsBoostApi.CollectionsBoostApiCampaign,
  ) => {
    const campaignName = row.name;
    const url = `/collection-boost/campaign/${row.id}`;
    return (
      <div className={css(styles.collectionNameContent)}>
        <img
          className={css(styles.collectionLogo)}
          alt="logo"
          src={row.logo_url}
        />
        <CopyButton
          style={{ width: "100%" }}
          text={row.name}
          prompt={i`Copy Collection Name`}
          copyOnBodyClick={false}
        >
          {row.state === "STARTED" || row.state === "ENDED" ? (
            <Link className={css(styles.identifier)} openInNewTab href={url}>
              {campaignName}
            </Link>
          ) : (
            <div className={css(styles.identifier)}>{campaignName}</div>
          )}
        </CopyButton>
      </div>
    );
  };

  const resetCampaignList = () => {
    setPageOffsetArg(0);
    setExpandedRows(new Set());
  };

  const renderCampaignDropPercentage = (
    row: collectionsBoostApi.CollectionsBoostApiCampaign,
  ) => {
    const dropPercentage = row.campaign_drop_percentage;
    if (dropPercentage > 0) {
      return (
        <Layout.FlexRow alignItems="center">
          <Text weight="semibold">
            {ci18n(
              "placeholder is a sale/discount",
              "%1$s OFF",
              numeral(dropPercentage / 100.0).format("0%"),
            )}
          </Text>
        </Layout.FlexRow>
      );
    }
    return (
      <Layout.FlexRow alignItems="center">
        <Text weight="semibold">{ci18n("Data not available", "No Data")}</Text>
      </Layout.FlexRow>
    );
  };

  const onFilterChange = (arg: {
    toggleState?: OptionType<CollectionsBoostCampaignState>;
    toStartDate?: Date;
    toEndDate?: Date;
  }) => {
    const { toggleState, toStartDate, toEndDate } = arg;
    if (toggleState) {
      const { value } = toggleState;
      const stateSet = new Set(filterStates);
      if (stateSet.has(value)) {
        stateSet.delete(value);
      } else {
        stateSet.add(value);
      }
      setFilterStates(Array.from(stateSet));
    }
    if (toStartDate != undefined) {
      setFilterStartDate(toStartDate);
    }
    if (toEndDate != undefined) {
      setFilterEndDate(toEndDate);
    }
    resetCampaignList();
  };

  const renderCampaignsTable = () => {
    const tableActions: TableAction[] = [
      {
        key: "editCampaign",
        name: i`Edit`,
        canBatch: false,
        canApplyToRow: (campaign) => campaign.state === "NEW",
        apply: async ([campaign]) => {
          const resp = await collectionsBoostApi
            .getCollectionsBoostMerchantInfo({})
            .call();
          if (resp.code !== 0 || !resp.data) {
            if (resp.msg) {
              toastStore.error(resp.msg);
            }
            return;
          }

          const modal = new EditCampaignModal({
            campaign: new Campaign({
              campaignId: campaign.id,
              searchQueries: campaign.search_queries,
              name: campaign.name,
              startDate: new Date(campaign.start_date),
              isAutoRenew: campaign.is_auto_renew,
              localizedCurrency: campaign.localized_currency,
              conversionRate: campaign.conversion_rate,
              campaignDropPercentage: campaign.campaign_drop_percentage,
              campaignPriceDropEnabled: campaign.price_drop_enabled,
              productsWithOverlappedPriceDropRecords: [
                ...campaign.products_with_overlapped_price_drop_records,
              ],
            }),
            maxAllowedSpending: resp.data.available_balance,
            minStartDate: new Date(resp.data.min_start_date),
            maxStartDate: new Date(resp.data.max_start_date),
            duration: resp.data.duration,
            isCreate: false,
          });
          modal.render();
        },
      },
      {
        key: "duplicateCampaign",
        name: i`Duplicate`,
        canBatch: false,
        canApplyToRow: (campaign) =>
          campaign.state !== "NEW" &&
          campaign.state !== "VALIDATING" &&
          campaign.is_rejected !== true,
        apply: async ([campaign]) => {
          const resp = await collectionsBoostApi
            .getCollectionsBoostMerchantInfo({})
            .call();
          if (resp.code !== 0 || !resp.data) {
            if (resp.msg) {
              toastStore.error(resp.msg);
            }
            return;
          }
          const respCollection = await collectionsBoostApi
            .getCollectionsBoostCollection({
              collection_id: campaign.source_collection_id,
            })
            .call();
          if (respCollection.code !== 0 || !respCollection.data) {
            if (respCollection.msg) {
              toastStore.error(respCollection.msg);
            }
            return;
          }
          if (respCollection.data.collection.state != "APPROVED") {
            toastStore.error(
              i`Associated collection not approved. ` +
                `Please go to create campaigns from approved collections.`,
            );
            return;
          }

          const modal = new EditCampaignModal({
            campaign: new Campaign({
              campaignId: campaign.id,
              searchQueries: campaign.search_queries,
              name: campaign.name,
              startDate: new Date(resp.data.min_start_date),
              isAutoRenew: true,
              localizedCurrency: campaign.localized_currency,
              conversionRate: campaign.conversion_rate,
              conversionTableId: campaign.conversion_table_id,
              campaignDropPercentage: campaign.campaign_drop_percentage,
              campaignPriceDropEnabled: campaign.price_drop_enabled,
              productsWithOverlappedPriceDropRecords: [
                ...campaign.products_with_overlapped_price_drop_records,
              ],
            }),
            maxAllowedSpending: resp.data.available_balance,
            minStartDate: new Date(resp.data.min_start_date),
            maxStartDate: new Date(resp.data.max_start_date),
            duration: resp.data.duration,
            isCreate: true,
          });
          modal.render();
        },
      },
      {
        key: "cancel",
        name: (rows) => {
          return i`Cancel`;
        },
        canApplyToRow: (campaign) => campaign.state === "NEW",
        apply: async ([campaign]) => {
          try {
            await collectionsBoostApi
              .editCollectionsCampaign({
                campaign_id: campaign.id,
                state_to: "CANCELED",
              })
              .call();
          } catch (e) {
            return;
          }
          refreshCollectionsBoostCampaignsResponse();
        },
      },
    ];

    return (
      <Table
        data={tableRows}
        actions={tableActions}
        noDataMessage={() => (
          <p>
            <span>No campaigns found.</span>&nbsp;
            <Link
              href="/collection-boost/list/collections?filter_states=APPROVED&offset=0"
              openInNewTab
            >
              Create a Campaign with your Approved collections
            </Link>
          </p>
        )}
        rowExpands={() => true}
        expandedRows={Array.from(expandedRows)}
        onRowExpandToggled={onRowExpandToggled}
        renderExpanded={(
          campaign: collectionsBoostApi.CollectionsBoostApiCampaign,
        ) => <CollectionsBoostCampaignRowExpand campaign={campaign} />}
        rowHeight={65}
        cellStyle={() => ({ fontSize: 16 })}
        highlightRowOnHover
        overflowY="visible"
      >
        <Table.ObjectIdColumn title={i`Campaign ID`} columnKey="id" />
        <Table.Column title={i`Collection Name`} columnKey="name">
          {({ row }) => renderCollectionName(row)}
        </Table.Column>
        <Table.CurrencyColumn
          title={i`Total Bid`}
          currencyCode={({ row }) => row.localized_currency}
          columnKey="total_bid"
          noDataMessage="-"
          description={i`After auction, this will be the total cost of your campaign.`}
        />
        <Table.Column title={i`Status`} columnKey="state" align="left">
          {({ row }) => renderStateLabel(row)}
        </Table.Column>
        <Table.Column
          title={i`Start Date`}
          columnKey="start_date"
          noDataMessage="-"
        />
        <Table.Column
          title={i`End Date`}
          columnKey="end_date"
          noDataMessage="-"
        />
        {priceDropEnabled && (
          <Table.Column
            title={i`Price Drop Percentage`}
            columnKey="campaign_drop_percentage"
            align="left"
            description={i`Drop percentage for the campaign if PriceDrop feature is enabled.`}
          >
            {({ row }) => renderCampaignDropPercentage(row)}
          </Table.Column>
        )}
        <Table.Column
          title={i`Auto Renew`}
          columnKey="is_auto_renew"
          description={
            i`This campaign will auto renew itself. ` +
            i`You can change this option anytime before ` +
            i`the campaign starts.`
          }
        >
          {({
            row,
          }: {
            row: collectionsBoostApi.CollectionsBoostApiCampaign;
          }) => (
            <Switch
              onToggle={async (isOn: boolean) => {
                try {
                  await collectionsBoostApi
                    .changeCollectionsBoostCampaignsAutoRenew({
                      campaign_id: row.id,
                      is_auto_renew: isOn,
                    })
                    .call();
                } catch (e) {
                  return;
                }
                refreshCollectionsBoostCampaignsResponse();
              }}
              isOn={row.is_auto_renew}
              disabled={row.state !== "NEW" && row.state !== "VALIDATING"}
              showText={false}
            />
          )}
        </Table.Column>
        <Table.NumeralColumn
          title={i`Collection Impressions`}
          columnKey="attributed_tile_impressions"
          noDataMessage="-"
          description={i`The number of times the boosted collection was viewed.`}
        />
        <Table.NumeralColumn
          title={i`Impressions`}
          columnKey="impressions"
          noDataMessage="-"
          description={
            i`The number of times products were ` +
            i`viewed during the campaign period.`
          }
        />
        <Table.Column
          title={i`Total GMV`}
          columnKey="localized_gmv"
          noDataMessage="-"
          description={
            i`Gross merchandising value, which indicates a total sales ` +
            i`value for all products within the collection sold during ` +
            i`the campaign period.`
          }
        >
          {({ row }) =>
            formatCurrency(
              row.gmv * row.conversion_rate,
              row.localized_currency,
            )
          }
        </Table.Column>
      </Table>
    );
  };

  return (
    <div className={css(styles.tableContent)}>
      <div className={css(styles.topControls)}>
        <div className={css(styles.buttonsLeft)}>
          <CollectionBoostCampaignSearch
            searchType={searchType}
            searchInput={searchInput}
            onSearchTypeChange={(value) => {
              setSearchType(value);
              resetCampaignList();
            }}
            onSearchInputChange={(value) => {
              setSearchInput(value);
              resetCampaignList();
            }}
          />
        </div>
        <div className={css(styles.buttonsRight)}>
          <PageIndicator
            className={css(styles.pageIndicator)}
            isLoading={isLoading}
            rangeStart={pageOffset + 1}
            rangeEnd={rangeEnd}
            hasNext={!feedEnded}
            hasPrev={pageOffset >= PageSize}
            currentPage={pageOffset / PageSize}
            onPageChange={onPageChange}
            totalItems={numResults}
          />

          <CollectionBoostCampaignsFilter
            className={css(styles.filterButton)}
            filterStates={filterStates}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterChange={onFilterChange}
            onDeselectAll={() => {
              setFilterStates([]);
              setFilterStartDate(undefined);
              setFilterEndDate(undefined);
              resetCampaignList();
            }}
            onApplyFilter={() => {
              refreshCollectionsBoostCampaignsResponse();
              resetCampaignList();
            }}
          />
        </div>
      </div>
      <Alert
        className={css(styles.select)}
        text={
          i`You can view more details of started or ended ` +
          i`campaigns' performance by clicking on campaigns' name.`
        }
        sentiment="info"
      />
      {isLoading ? <LoadingIndicator /> : renderCampaignsTable()}
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        collectionNameContent: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          transition: "opacity 0.3s linear",
        },
        select: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        },
        collectionLogo: {
          width: 40,
          height: 40,
          marginRight: 15,
          borderRadius: 4,
        },
        identifier: {
          fontSize: 16,
          userSelect: "none",
          whiteSpace: "nowrap",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        topControls: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
          marginBottom: 15,
        },
        tableContent: {
          padding: "20px 5% 90px",
        },
        buttonsLeft: {
          display: "flex",
          flexDirection: "row",
        },
        buttonsRight: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          ":nth-child(1n)": {
            height: 30,
            margin: "0px 0px 25px 0px",
          },
        },
        filterButton: {
          alignSelf: "stretch",
        },
        statusLabelContent: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        popover: {
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
        },
        smallTextTitle: {
          display: "flex",
          fontSize: 18,
          padding: 8,
        },
      }),
    [],
  );
};

export default observer(CollectionsBoostListCampaignsContent);
