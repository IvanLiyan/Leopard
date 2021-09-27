import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";
import PartnerDeveloperBenefitsContentCard from "@merchant/component/external/partner-developer/PartnerDeveloperBenefitsContentCard";

const contentCards = [
  {
    title: i`Make a lasting global impact`,
    message:
      i`Make a difference for 500 million people in under-served markets ` +
      i`around the world.`,
    color: palettes.palaceBlues.DarkerPalaceBlue,
  },
  {
    title: i`Receive predictable, frequent payouts`,
    message: i`Year over year payouts that you can count on.`,
    color: palettes.oranges.DarkerOrange,
  },
  {
    title: i`Realize incredible earning potential`,
    message:
      i`Create software for businesses desperate for help in managing everything ` +
      i`from data to listings.`,
    color: palettes.cyans.Cyan,
  },
];

const PartnerDeveloperBenefitsContent = () => {
  const styles = useStylesheet();
  return (
    <PartnerDeveloperSection className={css(styles.root)}>
      <div className={css(styles.content)}>
        {contentCards.map(({ title, message, color }) => (
          <PartnerDeveloperBenefitsContentCard
            className={css(styles.contentCard)}
            key={title}
            color={color}
            title={title}
            message={message}
          />
        ))}
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { surfaceLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLight,
        },
        content: {
          display: "flex",
          flexWrap: "wrap",
          padding: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 900px)": {
            flexDirection: "column",
            padding: "0 20px",
          },
        },
        contentCard: {
          margin: 20,
          maxWidth: 360,
          minHeight: 190,
        },
      }),
    [surfaceLight]
  );
};

export default PartnerDeveloperBenefitsContent;
