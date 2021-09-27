import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Field,
  LoadingIndicator,
  Table,
  Markdown,
  CopyButton,
  Text,
  Layout,
} from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { WelcomeHeader } from "@merchant/component/core";

/* Merchant Components */
import CollectionBoostStatusLabel from "@merchant/component/collections-boost/CollectionBoostStatusLabel";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { usePathParams } from "@toolkit/url";

/* Toolkit */
import { zendeskURL, wishURL } from "@toolkit/url";
import { useLogger } from "@toolkit/logger";
import { useRequest } from "@toolkit/api";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

/* External Libraries */
import numeral from "numeral";

const CollectionsBoostCampaignPerformanceContainer = () => {
  const styles = useStylesheet();
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();
  const { campaignIdParam } = usePathParams(
    "/collection-boost/campaign/:campaignIdParam",
  );

  const logger = useLogger("COLLECTIONS_BOOST_UI");

  useEffect(() => {
    // Log view
    logger.info({
      action: "view campaign performance page",
      campaign_id: campaignIdParam,
    });
  }, [logger, campaignIdParam]);

  const [collectionsBoostGetCampaignResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostCampaignById({
      campaign_id: campaignIdParam || "",
    }),
  );

  const campaignDetail =
    collectionsBoostGetCampaignResponse?.data?.campaign_dict;

  const campaignDetailIsLoading = !collectionsBoostGetCampaignResponse?.data;

  const [collectionsBoostGetCampaignPerformanceResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostCampaignPerformance({
      campaign_id: campaignIdParam || "",
    }),
  );

  const campaignPerformance =
    collectionsBoostGetCampaignPerformanceResponse?.data;

  const campaignSummaryPerformance = campaignPerformance?.aggregated_stats;

  const campaignPerformanceDate = useMemo(
    () => [
      ...(campaignPerformance?.dod_stats || []),
      campaignSummaryPerformance,
    ],
    [campaignPerformance?.dod_stats, campaignSummaryPerformance],
  );

  const campaignPerformanceIsLoading =
    !collectionsBoostGetCampaignPerformanceResponse?.data;

  const campaignProducts = campaignDetail?.products;

  const preferredCurrency = campaignPerformance?.preferred_currency || "USD";

  const showSearchTermPerf =
    campaignPerformance?.show_search_term_perf || false;

  const showProductPerf = campaignPerformance?.show_product_perf || false;

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));

  const [merchantInfoResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostMerchantInfo({}),
  );
  const merchantInfoStats = merchantInfoResponse?.data;
  const priceDropEnabled = merchantInfoStats?.price_drop_enabled;

  const productDetailIsLoading =
    campaignProducts?.length == 0 || priceDropEnabled == undefined;

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const renderExpandedStats = (
    row: collectionsBoostApi.CollectionsBoostCampaignStats,
  ) => (
    <div>
      {showSearchTermPerf && (
        <Table
          style={styles.expandRowContent}
          data={row.search_term_stats}
          rowHeight={65}
          cellStyle={() => ({ fontSize: 16 })}
          highlightRowOnHover
          overflowY="scroll"
        >
          <Table.Column title={i`Search Term`} columnKey="search_term" />
          <Table.Column
            title={i`Impressions`}
            columnKey="impressions"
            description={
              i`The percentage of collection impressions ` +
              `the search term contributes among all the search terms of this collection.`
            }
          />
          <Table.Column
            title={i`Clicks`}
            columnKey="clicks"
            description={
              i`The percentage of collection clicks ` +
              `the search term contributes among all the search terms of this collection.`
            }
          />
        </Table>
      )}
      {showProductPerf && (
        <Table
          style={styles.expandRowContent}
          data={row.product_stats}
          rowHeight={65}
          cellStyle={() => ({ fontSize: 16 })}
          highlightRowOnHover
          overflowY="scroll"
        >
          <ProductColumn
            hideText
            showDetailsInPopover
            popoverPosition="right"
            imageSize={70}
            title={i`Product`}
            columnKey="product_id"
            width={300}
          />
          <Table.Column
            title={i`Impressions`}
            columnKey="impressions"
            description={
              i`The percentage of collection products impressions ` +
              `the product contributes among all the products of this collection.`
            }
          />

          <Table.Column
            title={i`Clicks`}
            columnKey="clicks"
            description={
              i`The percentage of collection products clicks ` +
              `the product contributes among all the products of this collection.`
            }
          />
        </Table>
      )}
    </div>
  );

  const dodPerformanceTable = () => {
    return (
      <div className={css(styles.statsTable)}>
        <Table
          data={campaignPerformanceDate}
          rowExpands={() => showSearchTermPerf || showProductPerf}
          expandedRows={Array.from(expandedRows)}
          onRowExpandToggled={onRowExpandToggled}
          renderExpanded={renderExpandedStats}
        >
          <Table.Column
            title={i`Date`}
            columnKey="date"
            noDataMessage={i`Total`}
          />
          <Table.NumeralColumn
            title={i`Product Impressions`}
            columnKey="impressions"
            noDataMessage="-"
            numeralFormat="0,0"
            description={i`The number of times products were viewed.`}
          />
          <Table.NumeralColumn
            title={i`Product Clicks`}
            columnKey="clicks"
            noDataMessage="-"
            numeralFormat="0,0"
            align="left"
            description={i`The number of times products were clicked.`}
          />
          <Table.CurrencyColumn
            title={i`GMV`}
            columnKey="localized_gmv"
            noDataMessage="-"
            currencyCode={preferredCurrency}
            description={
              i`Gross merchandising value, which indicates a total sales ` +
              i`value for all products within the collection sold.`
            }
          />
          <Table.NumeralColumn
            title={i`Collection Impressions`}
            columnKey="attributed_tile_impressions"
            noDataMessage="-"
            numeralFormat="0,0"
            align="left"
            description={i`The number of times the boosted collection was viewed.`}
          />
          <Table.NumeralColumn
            title={i`Collection Clicks`}
            columnKey="tile_clicks"
            noDataMessage="-"
            numeralFormat="0,0"
            align="left"
            description={i`The number of times Wish users clicked on the boosted collection.`}
          />
          <Table.NumeralColumn
            title={i`Collection Products Impressions`}
            columnKey="attributed_impressions"
            noDataMessage="-"
            numeralFormat="0,0"
            align="left"
            description={
              i`The number of times products were ` +
              i`viewed through the boosted collection.`
            }
          />
        </Table>
      </div>
    );
  };

  const feedCollectionId = campaignDetail?.feed_collection_id || "";

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Campaign Detail`}
        illustration="productBoostDetailHeader"
        paddingX={pageX}
        body={() => {
          return (
            <div className={css(styles.textBody)}>
              <Markdown
                openLinksInNewTab
                text={i`Campaign's performance data can be found here. [Learn more](${zendeskURL(
                  "360052936574",
                )})`}
              />
            </div>
          );
        }}
      >
        <LoadingIndicator loadingComplete={!campaignDetailIsLoading}>
          <div className={css(styles.statsContainer)}>
            <Field style={styles.textStatsTitle} title={i`Collection Name`}>
              <div className={css(styles.textStatsBody)}>
                {campaignDetail?.name || ""}
              </div>
            </Field>
            <Field style={styles.textStatsTitle} title={i`Campaign ID`}>
              <div className={css(styles.textStatsBody)}>
                {campaignDetail?.id || ""}
              </div>
            </Field>
            <Field style={styles.textStatsTitle} title={i`Start Date`}>
              <div className={css(styles.textStatsBody)}>
                {campaignDetail?.start_date || ""}
              </div>
            </Field>
            <Field style={styles.textStatsTitle} title={i`End Date`}>
              <div className={css(styles.textStatsBody)}>
                {campaignDetail?.end_date || ""}
              </div>
            </Field>
            <Field style={styles.textStatsTitle} title={i`State`}>
              <CollectionBoostStatusLabel
                status={campaignDetail?.state || ""}
              />
            </Field>
            {feedCollectionId && (
              <Field style={styles.textStatsTitle} title={i`View on Wish`}>
                <Link
                  href={wishURL(`/collection/${feedCollectionId}`)}
                  openInNewTab
                >
                  View
                </Link>
              </Field>
            )}
          </div>
        </LoadingIndicator>
      </WelcomeHeader>
      <PageGuide mode="page-with-table">
        <div className={css(styles.sectionLabelText)}>
          Collection's Products:
        </div>
        <LoadingIndicator loadingComplete={!productDetailIsLoading}>
          <Table
            data={campaignProducts}
            rowHeight={65}
            highlightRowOnHover
            style={styles.productsTable}
          >
            <ProductColumn
              showFullName={false}
              title={i`Product Details`}
              columnKey="product_id"
            />
            {priceDropEnabled && (
              <Table.Column
                title={i`Drop Percentage`}
                columnKey="drop_percentage"
                noDataMessage={i`No Data`}
              >
                {({ row }) => {
                  if (row.drop_percentage) {
                    const dropPercentage = parseFloat(row.drop_percentage);
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
                  }
                  return (
                    <Layout.FlexRow alignItems="center">
                      <Text weight="semibold">
                        {ci18n("Data not available", "No Data")}
                      </Text>
                    </Layout.FlexRow>
                  );
                }}
              </Table.Column>
            )}
            {priceDropEnabled && (
              <Table.Column
                title={i`Price Drop Record`}
                columnKey="price_drop_record_id"
                noDataMessage={i`No Data`}
              >
                {({ row: product }) => {
                  const campaignId = product.price_drop_record_id;
                  if (campaignId) {
                    const url = `/marketplace/price-drop/performance/${campaignId}`;
                    return (
                      <CopyButton
                        text={campaignId}
                        prompt={i`Copy Campaign ID`}
                        copyOnBodyClick={false}
                      >
                        <Link
                          style={styles.priceDropLink}
                          openInNewTab
                          href={url}
                        >
                          {campaignId}
                        </Link>
                      </CopyButton>
                    );
                  }
                }}
              </Table.Column>
            )}
          </Table>
        </LoadingIndicator>

        <div className={css(styles.sectionLabelText)}>Performance</div>
        <LoadingIndicator loadingComplete={!campaignPerformanceIsLoading}>
          {dodPerformanceTable()}
        </LoadingIndicator>
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        statsContainer: {
          display: "flex",
          maxWidth: 600,
          transform: "translateZ(0)",
          marginTop: 16,
          justifyContent: "space-between",
        },
        headerTitleBold: {
          fontSize: 32,
          fontWeight: fonts.weightBold,
          lineHeight: 1.25,
          color: textBlack,
        },
        sectionLabelText: {
          fontSize: 24,
          padding: `40px 0px 20px`,
          fontWeight: fonts.weightBold,
          color: textBlack,
        },
        textStatsTitle: {
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          color: textBlack,
          marginRight: 20,
        },
        textStatsBody: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          color: textBlack,
          wordWrap: "break-word",
          userSelect: "text",
        },
        statsTable: {
          marginBottom: 70,
        },
        productsTable: {
          maxHeight: 300,
          overflowY: "scroll",
        },
        textBody: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
        },
        expandRowContent: {
          margin: "24px 24px 0px 24px",
          maxHeight: "250px",
          overflowY: "scroll",
        },
        priceDropLink: {
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
      }),
    [textBlack],
  );
};

export default observer(CollectionsBoostCampaignPerformanceContainer);
