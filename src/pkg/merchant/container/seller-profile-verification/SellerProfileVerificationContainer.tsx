import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { SideProgressList } from "@ContextLogic/lego";
import { Card, LoadingIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant API Params */
import { SetDataParams } from "@merchant/api/seller-profile-verification";

/* Merchant Components */
import GetStartedPage from "@merchant/component/seller-profile-verification/GetStartedPage";
import CountryOfDomicilePage from "@merchant/component/seller-profile-verification/CountryOfDomicilePage";
import BusinessLocationPage from "@merchant/component/seller-profile-verification/BusinessLocationPage";
import PhoneNumberPage from "@merchant/component/seller-profile-verification/PhoneNumberPage";
import IdentityPage from "@merchant/component/seller-profile-verification/IdentityPage";

import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant API */
import * as sellerProfileApi from "@merchant/api/seller-profile-verification";

/* Type Imports */
import { CountryCode } from "@toolkit/countries";

type Page = SetDataParams["page_name"];

const PageOrder: [Page, string, string][] = [
  // page name, param to check, page title
  ["GetStartedPage", "get_started_viewed", i`Get Started`],
  [
    "CountryOfDomicilePage",
    "country_code_domicile",
    i`Country/region of domicile`,
  ],
  ["BusinessLocationPage", "ba_country_code", i`Business location`],
  ["PhoneNumberPage", "phone_number", i`Phone number`],
  ["IdentityPage", "proof_of_id", i`Identity Documentation`],
];

const SellerProfileVerificationContainer = () => {
  const navigationStore = useNavigationStore();
  const { isNavyBlueNav } = navigationStore;
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [stateName, setStateName] = useState("");
  const [isRefetchingData, setIsRefetchingData] = useState(false);
  const [suspectedCountryInCM, setSuspectedCountryInCM] =
    useState<CountryCode | null>(null);
  const [merchantCountry, setMerchantCountry] = useState<CountryCode | null>(
    null,
  );
  const [countryCodeDomicile, setCountryCodeDomicile] =
    useState<CountryCode | null>(null);

  const styles = useStylesheet();

  const reloadData = useCallback(async () => {
    setIsRefetchingData(true);

    const resp = await sellerProfileApi.getProfile({ create_new: true }).call();
    const data = resp?.data;
    if (data == null) {
      return;
    }

    setStateName(data.state_name);
    setSuspectedCountryInCM(data.suspected_country_in_cm || null);
    setMerchantCountry(data.merchant_country || null);
    setCountryCodeDomicile(data.country_code_domicile || null);

    let found = false;
    for (const item of PageOrder) {
      const pageName = item[0];
      const paramToCheck = item[1];
      if (
        (data as any)[paramToCheck] == null ||
        (data as any)[paramToCheck] === false
      ) {
        setCurrentPage(pageName);
        found = true;
        break;
      }
    }
    if (!found) {
      setCurrentPage("IdentityPage");
    }
    setIsRefetchingData(false);
  }, [
    setCurrentPage,
    setSuspectedCountryInCM,
    setStateName,
    setIsRefetchingData,
    setMerchantCountry,
    setCountryCodeDomicile,
  ]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  useEffect(() => {
    if (stateName && stateName != "incomplete" && stateName != "complete") {
      navigationStore.navigate("/settings#seller-profile");
    }
  }, [stateName, navigationStore]);

  if (stateName.trim().length === 0) {
    return <LoadingIndicator />;
  }

  const goToNextPage = () => {
    reloadData();
  };

  let pageComponent: ReactNode | null = null;
  if (currentPage == "GetStartedPage") {
    pageComponent = (
      <GetStartedPage
        isRefetchingData={isRefetchingData}
        onNext={goToNextPage}
      />
    );
  } else if (currentPage == "CountryOfDomicilePage") {
    pageComponent = (
      <CountryOfDomicilePage
        isRefetchingData={isRefetchingData}
        suspectedCountryInCM={suspectedCountryInCM}
        merchantCountry={merchantCountry}
        onNext={goToNextPage}
      />
    );
  } else if (currentPage == "BusinessLocationPage") {
    pageComponent = (
      <BusinessLocationPage
        isRefetchingData={isRefetchingData}
        countryCodeDomicile={countryCodeDomicile}
        onNext={goToNextPage}
      />
    );
  } else if (currentPage == "PhoneNumberPage") {
    pageComponent = (
      <PhoneNumberPage
        isRefetchingData={isRefetchingData}
        countryCodeDomicile={countryCodeDomicile}
        onNext={goToNextPage}
      />
    );
  } else if (currentPage == "IdentityPage") {
    pageComponent = (
      <IdentityPage
        isRefetchingData={isRefetchingData}
        countryCodeDomicile={countryCodeDomicile}
        onNext={goToNextPage}
      />
    );
  }

  let currentItemFound = false;
  const sidebarItems = PageOrder.map((pageItem) => {
    const pageName = pageItem[0];
    const pageTitle = pageItem[2];
    const selected = pageName == currentPage;
    if (selected) {
      currentItemFound = true;
    }

    return (
      <SideProgressList.Item
        key={pageName}
        hasCompleted={!selected && !currentItemFound}
        selected={selected}
      >
        {pageTitle}
      </SideProgressList.Item>
    );
  });

  return (
    <PageRoot>
      <PageGuide>
        <div className={css(styles.root)}>
          {!isNavyBlueNav && (
            <div className={css(styles.sidebar)}>
              <SideProgressList>{sidebarItems}</SideProgressList>
            </div>
          )}
          <div className={css(styles.right)}>
            <div className={css(styles.breadcrumb)}>
              <Link href="/" style={styles.smallGreyText}>
                Home
              </Link>
              <div
                className={css(styles.smallGreyText, styles.seperator)}
              >{`/`}</div>
              <div className={css(styles.smallBlackText)}>
                Validate my store
              </div>
            </div>
            <Card>{pageComponent}</Card>
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

export default observer(SellerProfileVerificationContainer);
