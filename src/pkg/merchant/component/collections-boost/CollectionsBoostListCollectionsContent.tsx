import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { ThemedLabel } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { TableAction } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import {
  useIntQueryParam,
  useIntArrayQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringEnumArrayQueryParam,
} from "@toolkit/url";

/* Merchant Components */
import CollectionBoostStatusLabel from "@merchant/component/collections-boost/CollectionBoostStatusLabel";
import EditCampaignModal from "@merchant/component/collections-boost/modals/EditCampaignModal";
import CollectionsBoostCollectionsFilter from "@merchant/component/collections-boost/CollectionsBoostCollectionsFilter";
import CollectionsBoostCollectionSearch from "@merchant/component/collections-boost/CollectionsBoostCollectionSearch";
import CollectionsBoostCollectionRowExpand from "@merchant/component/collections-boost/CollectionsBoostCollectionRowExpand";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useUserStore } from "@merchant/stores/UserStore";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

/* Type Import */
import {
  CollectionsBoostApiCollection,
  CollectionsBoostCollectionState,
  CollectionSearchType,
} from "@merchant/api/collections-boost";
import Campaign from "@merchant/model/collections-boost/Campaign";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { getRejectReasonDetail } from "@toolkit/collections-boost/tooltips";
import { useLogger } from "@toolkit/logger";

const PageSize = 15;

const CollectionsBoostListCollectionsContent = () => {
  const styles = useStylesheet();
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
  const [searchType, setSearchType] = useStringEnumQueryParam<
    CollectionSearchType
  >("search_type", "collection_id");
  const [searchInput, setSearchInput] = useStringQueryParam("search_value");
  const [filterStates, setFilterStates] = useStringEnumArrayQueryParam<
    CollectionsBoostCollectionState
  >("filter_states");
  const [expandedRowsIndices, setExpandedRowsIndices] = useIntArrayQueryParam(
    "expand_row"
  );

  const pageOffset = pageOffsetArg || 0;

  const [
    collectionsBoostCollectionsResponse,
    refreshCollectionsResponse,
  ] = useRequest(
    collectionsBoostApi.getCollectionsBoostCollections({
      count: PageSize,
      start: pageOffset,
      filter_states: filterStates,
      search_type: searchType,
      search_value: searchInput,
    })
  );

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setPageOffsetArg(nextPage * PageSize);
  };

  const collectionsData = collectionsBoostCollectionsResponse?.data;

  const tableRows = collectionsData?.results.rows || [];

  const isLoading = !collectionsBoostCollectionsResponse?.data;

  const feedEnded = collectionsData?.results.feed_ended;

  const numResults = collectionsData?.results.num_results || 0;
  const rangeEnd = Math.min(pageOffset + PageSize, numResults);

  const renderStateLabel = (row: CollectionsBoostApiCollection) => {
    const {
      state,
      reject_reason: rejectReason,
      reject_comment: rejectComment,
    } = row;
    const rejectReasonDetail = getRejectReasonDetail(rejectReason || "");
    return (
      <div className={css(styles.rowCellItems)}>
        <CollectionBoostStatusLabel status={state} />
        {state === "REJECTED" && (
          <Info
            className={css(styles.infoIcon)}
            popoverContent={() => (
              <div className={css(styles.popover)}>
                <div className={css(styles.smallTextTitle)}>
                  {rejectReasonDetail}
                </div>
                {rejectComment && (
                  <div className={css(styles.smallTextChunk)}>
                    {rejectComment}
                  </div>
                )}
              </div>
            )}
            popoverMaxWidth={200}
          />
        )}
      </div>
    );
  };

  const renderCollectionName = (row: CollectionsBoostApiCollection) => {
    const { source } = row;
    return (
      <div className={css(styles.collectionNameContent)}>
        <img
          className={css(styles.collectionLogo)}
          alt="logo"
          src={row.logo_url}
        />
        <div className={css(styles.collectionNameColumn)}>
          <CopyButton
            style={styles.copyButton}
            text={row.name}
            prompt={i`Copy Collection Name`}
            copyOnBodyClick={false}
          >
            <div className={css(styles.identifier)}>{row.name}</div>
          </CopyButton>
          {source === "AUTOMATED" && (
            <ThemedLabel theme={"DarkWishBlue"} style={styles.automatedLabel}>
              Created by Wish
            </ThemedLabel>
          )}
        </div>
      </div>
    );
  };

  const renderCollectionsTable = () => {
    const tableActions: TableAction[] = [
      {
        key: "createCampaign",
        name: i`Create Campaign`,
        canBatch: false,
        canApplyToRow: (collection: CollectionsBoostApiCollection) =>
          collection.state === "APPROVED",
        apply: async ([collection]: ReadonlyArray<
          CollectionsBoostApiCollection
        >) => {
          const { toastStore } = AppStore.instance();
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
              collectionId: collection.id,
              searchQueries: [...collection.search_queries],
              startDate: new Date(resp.data.min_start_date),
              name: collection.name,
              isAutoRenew: true,
              productsWithOverlappedPriceDropRecords: [
                ...collection.products_with_overlapped_price_drop_records,
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
        key: "edit",
        name: i`Edit`,
        canApplyToRow: () => true,
        href: ([collection]: ReadonlyArray<CollectionsBoostApiCollection>) =>
          `/collection-boost/edit-collection/${collection.id}`,
      },
    ];
    return (
      <Table
        data={tableRows}
        actions={tableActions}
        noDataMessage={() => (
          <p>
            <span>No collections found.</span>&nbsp;
            <Link href="/collection-boost/edit-collection/" openInNewTab>
              Create a Collection
            </Link>
          </p>
        )}
        rowHeight={65}
        cellStyle={() => ({ fontSize: 16 })}
        highlightRowOnHover
        overflowY="visible"
        rowExpands={() => true}
        expandedRows={expandedRowsIndices}
        renderExpanded={(row: CollectionsBoostApiCollection) => (
          <CollectionsBoostCollectionRowExpand collection={row} />
        )}
        onRowExpandToggled={(index, shouldExpand) => {
          if (shouldExpand) {
            setExpandedRowsIndices([
              ...(expandedRowsIndices || []),
              ...[index],
            ]);
          } else {
            setExpandedRowsIndices(
              (expandedRowsIndices || []).filter((idx) => idx !== index)
            );
          }
        }}
      >
        <Table.ObjectIdColumn title={i`Collection ID`} columnKey="id" />
        <Table.Column title={i`Collection Name`} columnKey="name">
          {({ row }) => renderCollectionName(row)}
        </Table.Column>
        <Table.Column title={i`Status`} columnKey="state" align="left">
          {({ row }) => renderStateLabel(row)}
        </Table.Column>
      </Table>
    );
  };

  return (
    <div className={css(styles.tableContent)}>
      <div className={css(styles.topControls)}>
        <div className={css(styles.buttonsLeft)}>
          <CollectionsBoostCollectionSearch
            searchType={searchType}
            searchInput={searchInput}
            onSearchTypeChange={(value) => {
              setSearchType(value);
              setPageOffsetArg(0);
              setExpandedRowsIndices([]);
            }}
            onSearchInputChange={(value) => {
              setSearchInput(value);
              setPageOffsetArg(0);
              setExpandedRowsIndices([]);
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
          <CollectionsBoostCollectionsFilter
            className={css(styles.filterButton)}
            filterStates={filterStates}
            onFilterStateSelect={(state) => {
              const stateSet = new Set(filterStates);
              if (stateSet.has(state.value)) {
                stateSet.delete(state.value);
              } else {
                stateSet.add(state.value);
              }
              setFilterStates(Array.from(stateSet));
              setPageOffsetArg(0);
              setExpandedRowsIndices([]);
            }}
            onDeselectAll={() => {
              setFilterStates([]);
              setPageOffsetArg(0);
              setExpandedRowsIndices([]);
            }}
            onApplyFilter={() => {
              setPageOffsetArg(0);
              setExpandedRowsIndices([]);
              refreshCollectionsResponse();
            }}
          />
        </div>
      </div>
      {isLoading ? <LoadingIndicator /> : renderCollectionsTable()}
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        automatedLabel: {
          borderRadius: 10,
          marginTop: 3,
          marginBottom: 3,
        },
        collectionNameContent: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          transition: "opacity 0.3s linear",
        },
        collectionNameColumn: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        },
        collectionLogo: {
          width: 40,
          height: 40,
          marginRight: 15,
          borderRadius: 4,
        },
        identifier: {
          color: textBlack,
          fontSize: 16,
          userSelect: "none",
          whiteSpace: "nowrap",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        topControls: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
          marginBottom: 15,
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
        copyButton: {
          width: "100%",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        filterButton: {
          alignSelf: "stretch",
        },
        tableContent: {
          padding: "20px 5% 90px",
        },
        rowCellItems: {
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
          color: textBlack,
          fontSize: 18,
          padding: 8,
        },
        smallTextChunk: {
          display: "flex",
          color: textBlack,
          padding: 10,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          alignSelf: "center",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
          maxWidth: 400,
        },
        infoIcon: {
          marginLeft: 5,
        },
      }),
    [textBlack]
  );
};

export default observer(CollectionsBoostListCollectionsContent);
