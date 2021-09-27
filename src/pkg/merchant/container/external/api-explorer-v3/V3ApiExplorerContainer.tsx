import React, { useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import PartnerDeveloperSiteNavbar from "@merchant/component/nav/chrome/partner-developer/PartnerDeveloperSiteNavbar";
import Navbar from "@merchant/component/external/api-explorer-v3/Navbar";
import ApiMethodPage from "@merchant/component/external/api-explorer-v3/ApiMethodPage";
import BasePage from "@merchant/component/external/api-explorer-v3/BasePage";

/* Merchant Store */
import ApiExplorerStore from "@merchant/stores/v3-api-explorer/ApiExplorerStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

import { UserSchema } from "@schema/types";

type InitialData = {
  readonly currentUser: Pick<UserSchema, "isStoreOrMerchantUser">;
};

type V3ApiExplorerContainerProps = {
  readonly initialData: InitialData;
};

const DefaultNavWidth = 260;

const V3ApiExplorerContainer = ({
  initialData,
}: V3ApiExplorerContainerProps) => {
  const styles = useStylesheet();
  const [apiStore] = useState(new ApiExplorerStore());
  const isStoreOrMerchantUser = initialData.currentUser?.isStoreOrMerchantUser;
  const { surfaceLightest } = useTheme();

  useEffect(() => {
    apiStore.fetchApiSpec();
  }, [apiStore]);

  const { loading, baseUrl } = apiStore;
  const { operationId } = usePathParams(`${baseUrl}/:operationId`);

  const renderPageByPath = () => {
    switch (operationId) {
      case undefined:
        return (
          <BasePage className={css(styles.contentWrapper)} type={"home"} />
        );
      case "404":
        return <BasePage className={css(styles.contentWrapper)} type={"404"} />;
      default:
        return (
          <ApiMethodPage
            className={css(styles.contentWrapper)}
            store={apiStore}
            isStoreOrMerchantUser={isStoreOrMerchantUser}
          />
        );
    }
  };

  return loading ? (
    <LoadingIndicator className={css(styles.loading)} />
  ) : (
    <div className={css(styles.root)}>
      <PartnerDeveloperSiteNavbar background={surfaceLightest} />

      <div className={css(styles.content)}>
        <Navbar className={css(styles.nav)} store={apiStore} />
        {renderPageByPath()}
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { isVerySmallScreen } = useDimenStore();
  const { surfaceLightest, pageBackground, textBlack } = useTheme();

  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      position: "absolute",
      backgroundColor: pageBackground,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      display: "flex",
      marginTop: 80,
    },
    nav: {
      position: "sticky",
      width: isVerySmallScreen ? 0 : DefaultNavWidth,
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      overflow: "scroll",
      position: "relative",
      width: isVerySmallScreen ? "100%" : `calc(100% - ${DefaultNavWidth}px)`,
      color: textBlack,
      backgroundColor: surfaceLightest,
    },
    loading: {
      margin: "300px 50%",
    },
  });
};

export default observer(V3ApiExplorerContainer);
