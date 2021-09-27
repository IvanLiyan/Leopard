import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager, LoadingIndicator } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant Components */
import OrderFines from "@merchant/component/policy/fines/order-fines/OrderFines";
import Infractions from "@merchant/component/policy/fines/warnings/Infractions";

/* Merchant API */
import * as warningsApi from "@merchant/api/warnings";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useRequest } from "@toolkit/api";

const FinesOverviewContainer: React.FC<{}> = () => {
  const styles = useStylesheet();
  const { dimenStore, routeStore } = useStore();
  const [infractionsResponse] = useRequest(warningsApi.getWarningMetadata({}));
  const infractionsMetadata = infractionsResponse?.data;

  const { tab } = usePathParams("/penalties/:tab");

  if (infractionsMetadata == null) {
    return <LoadingIndicator />;
  }

  // gated feature
  const showInfractionsTab = infractionsMetadata.show_infractions_tab;
  const { pageGuideXForPageWithTable: pageX } = dimenStore;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Penalties Overview`}
        body={
          i`Here is a summary of the infractions and penalties issued ` +
          i`to your account due to policy violations. You can review ` +
          i`details and dispute them if they are eligible. To learn about ` +
          i`Wish’s policies and improve your policy compliance, please ` + // eslint-disable-next-line local-rules/no-links-in-i18n
          i`visit [Penalty Policies](/penalties/policies).`
        }
        paddingX={pageX}
        illustration="finesHeader"
        hideBorder
      />
      {showInfractionsTab ? (
        <Pager
          tabsPadding={"0px 5%"}
          equalSizeTabs
          selectedTabKey={tab}
          onTabChange={(tabKey: string) => {
            routeStore.pushPath(`/penalties/${tabKey}`);
          }}
        >
          <Pager.Content titleValue={i`Order Penalties`} tabKey="orders">
            <OrderFines
              key={"order_fines"}
              style={{
                padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
              }}
            />
          </Pager.Content>
          <Pager.Content titleValue={i`Infractions`} tabKey="infractions">
            <Infractions
              key={"infractions"}
              infractionsMetadata={infractionsMetadata}
              style={{
                padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
              }}
            />
          </Pager.Content>
        </Pager>
      ) : (
        <OrderFines
          style={{
            padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
          }}
        />
      )}
    </div>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
      }),
    []
  );

export default observer(FinesOverviewContainer);
