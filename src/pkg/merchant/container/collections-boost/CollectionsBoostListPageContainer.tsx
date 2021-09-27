import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Pager } from "@ContextLogic/lego";
import { Field } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { usePathParams } from "@toolkit/url";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { Popover } from "@merchant/component/core";

/* Merchant Components */
import CollectionsBoostListCollectionsContent from "@merchant/component/collections-boost/CollectionsBoostListCollectionsContent";
import CollectionsBoostListCampaignsContent from "@merchant/component/collections-boost/CollectionsBoostListCampaignsContent";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { useRequest } from "@toolkit/api";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { Table } from "@ContextLogic/lego";

const CollectionsBoostListPageContainer = () => {
  const styles = useStylesheet();

  const { pageGuideXForPageWithTable: pageX } = useDimenStore();
  const routeStore = useRouteStore();

  const { selectedTab = "collections" } = usePathParams(
    "/collection-boost/list/:selectedTab",
  );

  const [merchantInfoResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostMerchantInfo({}),
  );

  const merchantInfoIsLoading = !merchantInfoResponse?.data;
  const merchantInfoStats = merchantInfoResponse?.data;
  const merchantAccountBalance = merchantInfoStats?.balance || 0.0;
  const merchantAccountCredit = merchantInfoStats?.credit || 0.0;
  const merchantAccountCreditInfo = merchantInfoStats?.credit_info || [];
  const merchantAccountPreferredCurrency =
    merchantInfoStats?.preferred_currency || "USD";

  const renderHeaderButton = () => {
    return selectedTab === "campaigns" ? (
      <PrimaryButton
        className={css(styles.createButton)}
        onClick={() => {
          routeStore.pushPath(`/collection-boost/list/collections`);
        }}
      >
        Create a Campaign
      </PrimaryButton>
    ) : (
      <PrimaryButton
        className={css(styles.createButton)}
        href="/collection-boost/edit-collection/"
        openInNewTab
      >
        Create a Collection
      </PrimaryButton>
    );
  };

  const creditsPopoverContent = () => {
    return (
      <div className={css(styles.popoverContent)}>
        <Table data={merchantAccountCreditInfo}>
          <Table.Column
            title={i`Issued Date`}
            columnKey="issued_date"
            align="left"
            width={200}
          />
          <Table.Column
            title={i`Expiry Date`}
            columnKey="expired_date"
            align="left"
            width={200}
          />
          <Table.CurrencyColumn
            title={i`Credit Amount`}
            columnKey="amount"
            currencyCode={merchantAccountPreferredCurrency}
          />
        </Table>
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Manage your CollectionBoost`}
        paddingX="5%"
        body={() => {
          return (
            <div className={css(styles.headerBody)}>
              <Markdown
                openLinksInNewTab
                text={
                  i`Here is a list of all your CollectionBoost collections and campaigns. ` +
                  i`You may create CollectionBoost campaigns for your approved collections to ` +
                  i`begin promoting them. [Learn more](${zendeskURL(
                    "360052936574",
                  )})`
                }
              />
              <div className={css(styles.btnBody)}>{renderHeaderButton()}</div>
            </div>
          );
        }}
        hideBorder
      >
        <LoadingIndicator loadingComplete={!merchantInfoIsLoading}>
          <div className={css(styles.statsContainer)}>
            <Field
              className={css(styles.textStatsTitle)}
              title={i`Account Balance`}
            >
              <div className={css(styles.textStatsBody)}>
                {formatCurrency(
                  merchantAccountBalance,
                  merchantAccountPreferredCurrency,
                )}
              </div>
            </Field>
            <Popover
              popoverContent={
                merchantAccountCreditInfo.length > 0
                  ? creditsPopoverContent
                  : null
              }
              position={"bottom center"}
            >
              <Field
                className={css(styles.textStatsTitle)}
                title={i`Credit balance`}
              >
                <div className={css(styles.textStatsBody)}>
                  {formatCurrency(
                    merchantAccountCredit,
                    merchantAccountPreferredCurrency,
                  )}
                </div>
              </Field>
            </Popover>
          </div>
        </LoadingIndicator>
      </WelcomeHeader>
      <Pager
        tabsPadding={`0px ${pageX}`}
        onTabChange={async (tabKey: string) => {
          routeStore.pushPath(`/collection-boost/list/${tabKey}`);
        }}
        selectedTabKey={selectedTab}
      >
        <Pager.Content titleValue={i`Collections`} tabKey="collections">
          <CollectionsBoostListCollectionsContent />
        </Pager.Content>
        <Pager.Content titleValue={i`Campaigns`} tabKey="campaigns">
          <CollectionsBoostListCampaignsContent />
        </Pager.Content>
      </Pager>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground, textBlack, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        statsContainer: {
          display: "flex",
          maxWidth: 600,
          transform: "translateZ(0)",
          marginTop: 16,
          justifyContent: "space-between",
        },
        textStatsTitle: {
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          color: textBlack,
          marginRight: 20,
        },
        textStatsBody: {
          fontSize: 15,
          fontWeight: fonts.weightMedium,
          color: textBlack,
          wordWrap: "break-word",
          userSelect: "text",
        },
        headerBody: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        },
        btnBody: {
          paddingBottom: 10,
          marginLeft: "10%",
        },
        createButton: {
          backgroundColor: primary,
          borderRadius: 4,
          fontSize: 16,
          lineHeight: 1.5,
        },
        popoverContent: {
          "@media (max-width: 900px)": {
            minWidth: 400,
          },
          "@media (min-width: 900px)": {
            minWidth: undefined,
          },
        },
      }),
    [pageBackground, textBlack, primary],
  );
};

export default observer(CollectionsBoostListPageContainer);
