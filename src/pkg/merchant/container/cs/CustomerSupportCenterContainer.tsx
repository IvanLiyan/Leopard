import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";

import { css } from "@toolkit/styling";

import { useRouteStore } from "@merchant/stores/RouteStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

import {
  Pager,
  Markdown,
  Layout,
  SecondaryButton,
  Label,
} from "@ContextLogic/lego";
import { WelcomeHeader, Illustration } from "@merchant/component/core";
import { usePathParams } from "@toolkit/url";

import TicketList from "@merchant/component/cs/tickets/TicketList";

import PageRoot from "@plus/component/nav/PageRoot";

import { InitialData } from "@toolkit/cs/center";

type Props = {
  readonly initialData: InitialData;
};
const CustomerSupportCenterContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const {
    cs: {
      closedTicketCount,
      prePurchaseTicketCount,
      awaitingUserTicketCount,
      awaitingMerchantTicketCount,
      postCSTicketCount,
    },
    currentMerchant: { isWhiteGlove },
  } = initialData;
  const routeStore = useRouteStore();
  const dimenStore = useDimenStore();
  const { textWhite, primary } = useTheme();
  const { currentTab } = usePathParams("/plus/cs/:currentTab");
  const styles = useStylesheet();

  const withCount = (title: string, count: number) => {
    if (count == 0) {
      return title;
    }
    return `${title} (${numeral(count).format("0,0")})`;
  };

  return (
    <PageRoot>
      <WelcomeHeader
        title={i`Support Tickets`}
        body={() => (
          <Layout.FlexColumn>
            <Markdown
              className={css(styles.bannerParagraph)}
              text={
                i`Please note that Wish merchants must respond to support ` +
                i`tickets within **${
                  isWhiteGlove ? 120 : 48
                } hours**. After this time, Wish Customer ` +
                i`Support team will process tickets and may resolve them to benefit the customer.`
              }
            />
            <Layout.FlexRow>
              <SecondaryButton
                text={i`Customer Service Program`}
                href="/customer-service"
                openInNewTab
                className={css(styles.bannerButton)}
              />
              <Label
                text={i`New`}
                borderRadius={16}
                textColor={textWhite}
                backgroundColor={primary}
              />
            </Layout.FlexRow>
          </Layout.FlexColumn>
        )}
        paddingX={dimenStore.pageGuideXForPageWithTable}
        illustration={() => (
          <Illustration
            name="customerSupport"
            style={{ minWidth: 150 }}
            alt={i`Customer Support`}
          />
        )}
        hideBorder
      />

      <Pager
        onTabChange={(tab: string) => {
          routeStore.pushPath(`/plus/cs/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${dimenStore.pageGuideXForPageWithTable}`,
        }}
        hideHeaderBorder
      >
        <Pager.Content
          titleValue={withCount(
            i`Action Required`,
            awaitingMerchantTicketCount,
          )}
          tabKey="action-required"
        >
          <div className={css(styles.pagerContent)}>
            <TicketList
              initialData={initialData}
              state="AWAITING_MERCHANT"
              type="ORDER"
              includeMissingTicketType
              title={i`Tickets - Action Required`}
            />
          </div>
        </Pager.Content>
        <Pager.Content
          titleValue={withCount(i`Awaiting Buyer`, awaitingUserTicketCount)}
          tabKey="blocked"
        >
          <div className={css(styles.pagerContent)}>
            <TicketList
              initialData={initialData}
              state="AWAITING_USER"
              type="ORDER"
              title={i`Tickets - Awaiting Buyer`}
            />
          </div>
        </Pager.Content>
        <Pager.Content
          titleValue={withCount(i`Closed`, closedTicketCount)}
          tabKey="closed"
        >
          <div className={css(styles.pagerContent)}>
            <TicketList
              initialData={initialData}
              state="CLOSED"
              type="ORDER"
              title={i`Tickets - Closed`}
            />
          </div>
        </Pager.Content>
        <Pager.Content
          titleValue={withCount(
            i`Pre-purchase Questions`,
            prePurchaseTicketCount,
          )}
          tabKey="pre-purchase-questions"
        >
          <div className={css(styles.pagerContent)}>
            <TicketList
              initialData={initialData}
              state="AWAITING_MERCHANT"
              type="PRE_PURCHASE"
              title={i`Questions - Pre Purchase`}
            />
          </div>
        </Pager.Content>
        <Pager.Content
          titleValue={withCount(
            i`Post Customer Support Questions`,
            postCSTicketCount,
          )}
          tabKey="post-purchase-questions"
        >
          <div className={css(styles.pagerContent)}>
            <TicketList
              initialData={initialData}
              state="AWAITING_MERCHANT"
              type="POST_CUSTOMER_SUPPORT"
              title={i`Questions - Post Customer Support`}
            />
          </div>
        </Pager.Content>
      </Pager>
    </PageRoot>
  );
};

export default observer(CustomerSupportCenterContainer);

const useStylesheet = () => {
  const dimenStore = useDimenStore();
  return useMemo(
    () =>
      StyleSheet.create({
        bannerParagraph: {
          paddingTop: 20,
          fontSize: 16,
          lineHeight: "24px",
          "@media (min-width: 900px)": {
            maxWidth: "70%",
          },
          marginBottom: 30,
        },
        pagerContent: {
          display: "flex",
          flexDirection: "column",
          padding: `32px ${dimenStore.pageGuideXForPageWithTable} 65px ${dimenStore.pageGuideXForPageWithTable}`,
        },
        bannerButton: {
          maxWidth: 250,
          marginRight: 8,
        },
      }),
    [dimenStore.pageGuideXForPageWithTable],
  );
};
