import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Merchant API */
import { getPromotedPartners } from "@merchant/api/partner-developer";

/* Toolkit */
import { useRequest } from "@toolkit/api";

const PartnerDeveloperPromotedPartnersContent = () => {
  const styles = useStylesheet();
  const [response] = useRequest(getPromotedPartners({}));
  const promotedPartners = response?.data?.promoted_partners;
  if (!promotedPartners) {
    return <LoadingIndicator />;
  }
  return (
    <PartnerDeveloperSection className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.contentPanel)}>
          <div className={css(styles.title)}>
            Some great developers already work with us
          </div>
          <div className={css(styles.contentRow)}>
            {promotedPartners.map(({ website, logo_source: logoSource }) => (
              <Link
                className={css(styles.imageWrapper)}
                href={website}
                key={website}
                openInNewTab
              >
                <img className={css(styles.image)} src={logoSource} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { textBlack, surfaceLightest, surfaceLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLight,
        },
        content: {
          display: "flex",
          padding: "50px 40px",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            padding: "0 20px",
          },
        },
        contentPanel: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            maxWidth: "100%",
            margin: "20px",
          },
        },
        contentRow: {
          display: "flex",
          width: "100%",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        },
        title: {
          color: textBlack,
          fontSize: "36px",
          fontWeight: weightBold,
          lineHeight: 1.3,
          marginBottom: 60,
          "@media (max-width: 1000px)": {
            fontSize: "32px",
            textAlign: "center",
            marginBottom: 30,
          },
        },
        imageWrapper: {
          display: "flex",
          backgroundColor: surfaceLightest,
          flex: "0 0 140px",
          margin: "0 30px 60px 30px",
          height: 140,
          width: 140,
          justifyContent: "center",
          borderRadius: 8,
        },
        image: {
          alignSelf: "center",
          backgroundColor: surfaceLightest,
          maxHeight: 140,
          maxWidth: 140,
          borderRadius: 8,
        },
      }),
    [textBlack, surfaceLightest, surfaceLight],
  );
};

export default PartnerDeveloperPromotedPartnersContent;
