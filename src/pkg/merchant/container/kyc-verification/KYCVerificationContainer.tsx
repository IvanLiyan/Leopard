import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, LoadingIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import GetStartedKYCPage from "@merchant/component/seller-profile-verification/kyc-verification/GetStartedKYCPage";
import IdentityPageKYC from "@merchant/component/seller-profile-verification/kyc-verification/IdentityPageKYC";
import CountryOfDomicileKYCPage from "@merchant/component/seller-profile-verification/kyc-verification/CountryOfDomicileKYCPage";

import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant API */
import * as KYCVerificationAPI from "@merchant/api/kyc-verification";
import { CountryCode } from "@schema/types";

const KYCVerificationContainer = () => {
  const navigationStore = useNavigationStore();
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(0);

  const [stateName, setStateName] = useState("");
  const [isRefetchingData, setIsRefetchingData] = useState(false);
  const [storedCountry, setStoredCountry] = useState<CountryCode | null>(null);

  const [canChangeCountry, setCanChangeCountry] = useState<boolean>(false);
  const [canStartVerification, setCanStartVerification] = useState<boolean>(
    false
  );

  const styles = useStylesheet();

  const reloadData = useCallback(async () => {
    setIsRefetchingData(true);

    const resp = await KYCVerificationAPI.getProfile({
      create_new: true,
    }).call();
    const data = resp?.data;
    if (data == null) {
      return;
    }

    setStateName(data.state_name);
    setStoredCountry(data.stored_country || null);
    setCanChangeCountry(data.can_change_country);
    setCanStartVerification(data.can_start_kyc);

    setIsRefetchingData(false);
  }, [setStateName, setIsRefetchingData]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  useEffect(() => {
    if (stateName && stateName != "incomplete") {
      navigationStore.navigate("/settings#seller-profile");
    }
  }, [stateName, navigationStore]);

  if (stateName.trim().length === 0) {
    return <LoadingIndicator />;
  }

  const goToNextPage = async () => {
    await reloadData();
    setCurrentPageNumber(currentPageNumber + 1);
  };

  const goToPrevPage = () => {
    setCurrentPageNumber(currentPageNumber - 1);
  };

  const goToSellerProfileSettings = () => {
    navigationStore.navigate("/settings#seller-profile");
  };

  const allPages = [
    <GetStartedKYCPage
      isRefetchingData={isRefetchingData}
      onNext={goToNextPage}
    />,
    <CountryOfDomicileKYCPage
      isRefetchingData={isRefetchingData}
      initialCountry={storedCountry}
      canChangeCountry={canChangeCountry}
      onNext={goToNextPage}
      onBack={goToPrevPage}
    />,
    <IdentityPageKYC
      isRefetchingData={isRefetchingData}
      skipVerification={!canStartVerification}
      onBack={goToPrevPage}
      onFinished={goToSellerProfileSettings}
    />,
  ];

  const pages = canStartVerification ? allPages : allPages.slice(1);

  return (
    <PageRoot>
      <PageGuide>
        <div className={css(styles.root)}>
          <div className={css(styles.right)}>
            <div className={css(styles.breadcrumb)}>
              <Link href="/" style={styles.smallGreyText}>
                Home
              </Link>
              <div className={css(styles.smallGreyText, styles.seperator)}>
                /
              </div>
              <div className={css(styles.smallBlackText)}>
                {canStartVerification
                  ? i`Validate my store`
                  : i`Seller profile`}
              </div>
            </div>
            <Card>{pages[currentPageNumber]}</Card>
          </div>
        </div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textLight, textBlack } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        fontSize: 16,
        lineHeight: 1.5,
        marginTop: 40,
      },
      sidebar: {
        "@media (max-width: 900px)": {
          display: "none",
        },
        marginRight: 24,
        paddingTop: 40,
      },
      right: {
        flex: 1,
        maxWidth: 1024,
      },
      breadcrumb: {
        marginBottom: 16,
        "@media (max-width: 900px)": {
          marginLeft: 10,
        },
        display: "flex",
        alignItems: "center",
      },
      seperator: {
        margin: "0 5px",
      },
      smallGreyText: {
        color: textLight,
        fontWeight: fonts.weightNormal,
      },
      smallBlackText: {
        color: textBlack,
      },
    });
  }, [textLight, textBlack]);
};

export default observer(KYCVerificationContainer);
