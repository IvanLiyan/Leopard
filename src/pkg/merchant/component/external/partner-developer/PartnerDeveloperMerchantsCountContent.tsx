import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import { developerMerchantsIllustration } from "@assets/illustrations";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

const PartnerDeveloperMerchantsCountContent = () => {
  const styles = useStylesheet();

  return (
    <PartnerDeveloperSection
      className={css(styles.section)}
      childWrapperStyle={{
        margin: 0,
      }}
    >
      <div className={css(styles.bgi)}>
        <div className={css(styles.title)}>1,000,000+ merchants</div>
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { textWhite, surfaceLightest, greenSurface, surfaceLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          background: `linear-gradient(to bottom, 
            ${surfaceLightest} 0, ${surfaceLightest} 18%, 
            ${greenSurface} 0, ${greenSurface} 88%, 
            ${surfaceLight} 0, ${surfaceLight} 100%)`,
          height: 630,
        },
        bgi: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `url(${developerMerchantsIllustration})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        },
        title: {
          display: "flex",
          color: textWhite,
          fontSize: "90px",
          fontWeight: weightBold,
          textAlign: "center",
          margin: "0 20px",
          "@media (max-width: 900px)": {
            fontSize: "50px",
          },
        },
      }),
    [textWhite, surfaceLightest, greenSurface, surfaceLight]
  );
};

export default PartnerDeveloperMerchantsCountContent;
