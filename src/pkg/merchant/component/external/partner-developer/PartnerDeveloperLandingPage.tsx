import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PartnerDeveloperSiteNavbar from "@merchant/component/nav/chrome/partner-developer/PartnerDeveloperSiteNavbar";
import PartnerDeveloperIntroContent from "@merchant/component/external/partner-developer/PartnerDeveloperIntroContent";
import PartnerDeveloperNavigationContent from "@merchant/component/external/partner-developer/PartnerDeveloperNavigationContent";
import PartnerDeveloperPromotedPartnersContent from "@merchant/component/external/partner-developer/PartnerDeveloperPromotedPartnersContent";
import PartnerDeveloperCodeExampleContent from "@merchant/component/external/partner-developer/PartnerDeveloperCodeExampleContent";
import PartnerDeveloperBenefitsContent from "@merchant/component/external/partner-developer/PartnerDeveloperBenefitsContent";
import PartnerDeveloperGetStartedContent from "@merchant/component/external/partner-developer/PartnerDeveloperGetStartedContent";
import PartnerDeveloperMerchantsCountContent from "@merchant/component/external/partner-developer/PartnerDeveloperMerchantsCountContent";
import SiteFooter from "@merchant/component/nav/SiteFooter";
import { confirmLogoutModal } from "@merchant/stores/partner-developer/PartnerDeveloperSiteNavBarStore";

/* Merchant Model */
import PartnerDeveloperGlobalState from "@merchant/model/external/partner-developer/PartnerDeveloperGlobalState";

import { useTheme } from "@merchant/stores/ThemeStore";
import { useUserStore } from "@merchant/stores/UserStore";

type PartnerDeveloperLandingPageProps = {
  readonly partnerDeveloperState: PartnerDeveloperGlobalState;
};

const PartnerDeveloperLandingPage = ({
  partnerDeveloperState,
}: PartnerDeveloperLandingPageProps) => {
  const styles = useStylesheet();
  const { loggedInMerchantUser } = useUserStore();
  const { surfaceLightest } = useTheme();

  const isApiUser = loggedInMerchantUser?.is_api_user;

  return (
    <div className={css(styles.root)}>
      <PartnerDeveloperSiteNavbar background={surfaceLightest} />
      <PartnerDeveloperIntroContent
        partnerDeveloperState={partnerDeveloperState}
        confirmLogoutModal={confirmLogoutModal}
      />
      <PartnerDeveloperNavigationContent />
      <PartnerDeveloperBenefitsContent />
      <PartnerDeveloperCodeExampleContent />
      <PartnerDeveloperMerchantsCountContent />
      <PartnerDeveloperPromotedPartnersContent />
      {!isApiUser && (
        <PartnerDeveloperGetStartedContent
          confirmLogoutModal={confirmLogoutModal}
          partnerDeveloperState={partnerDeveloperState}
        />
      )}
      <SiteFooter />
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
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 80,
        },
      }),
    []
  );

export default PartnerDeveloperLandingPage;
