import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Illustration from "@merchant/component/core/Illustration";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core/Illustration";
import { useLocalizationStore } from "@core/stores/LocalizationStore";

export type WishForMerchantsMode = "default" | "ink" | "white";
type WishForMerchantsProps = BaseProps & {
  readonly text?: string;
  readonly mode?: WishForMerchantsMode;
};

const WishForMerchants = (props: WishForMerchantsProps) => {
  const { className, style, text, mode } = props;
  const styles = useStylesheet();
  const logo = useTranslatedLogo(mode);

  return (
    <Illustration
      name={logo}
      animate={false}
      alt={text || i`Wish for Merchants`}
      style={[styles.root, style, className]}
    />
  );
};

const getLogoByMode = (params: {
  readonly mode?: WishForMerchantsMode;
  readonly whiteLogo: IllustrationName;
  readonly inkLogo: IllustrationName;
}) => {
  const { mode, whiteLogo, inkLogo } = params;

  if (mode === "white") {
    return whiteLogo;
  }

  return inkLogo;
};

const useTranslatedLogo = (mode?: WishForMerchantsMode): IllustrationName => {
  const { locale } = useLocalizationStore();

  switch (locale) {
    case "zh":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteCN",
        inkLogo: "newWishMerchantLogoCN",
      });
    case "cs":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteCZ",
        inkLogo: "newWishMerchantLogoCZ",
      });
    case "de":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteDE",
        inkLogo: "newWishMerchantLogoDE",
      });
    case "es":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteES",
        inkLogo: "newWishMerchantLogoES",
      });
    case "fr":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteFR",
        inkLogo: "newWishMerchantLogoFR",
      });
    case "it":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteIT",
        inkLogo: "newWishMerchantLogoIT",
      });
    case "ja":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteJP",
        inkLogo: "newWishMerchantLogoJP",
      });
    case "ko":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteKR",
        inkLogo: "newWishMerchantLogoKR",
      });
    case "nl":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteNL",
        inkLogo: "newWishMerchantLogoNL",
      });
    case "pt":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhitePT",
        inkLogo: "newWishMerchantLogoPT",
      });
    case "sv":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteSE",
        inkLogo: "newWishMerchantLogoSE",
      });
    case "tr":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteTR",
        inkLogo: "newWishMerchantLogoTR",
      });
    case "vi":
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteVN",
        inkLogo: "newWishMerchantLogoVN",
      });
    case "en":
    default:
      return getLogoByMode({
        mode,
        whiteLogo: "newWishMerchantLogoWhiteEN",
        inkLogo: "newWishMerchantLogoEN",
      });
  }
};

export default observer(WishForMerchants);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 52,
        },
      }),
    [],
  );
};
