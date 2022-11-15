import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Illustration, { IllustrationName } from "@core/components/Illustration";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
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
        whiteLogo: "merchantLogoWhiteCN",
        inkLogo: "merchantLogoCN",
      });
    case "cs":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteCZ",
        inkLogo: "merchantLogoCZ",
      });
    case "de":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteDE",
        inkLogo: "merchantLogoDE",
      });
    case "es":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteES",
        inkLogo: "merchantLogoES",
      });
    case "fr":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteFR",
        inkLogo: "merchantLogoFR",
      });
    case "it":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteIT",
        inkLogo: "merchantLogoIT",
      });
    case "ja":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteJP",
        inkLogo: "merchantLogoJP",
      });
    case "ko":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteKR",
        inkLogo: "merchantLogoKR",
      });
    case "nl":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteNL",
        inkLogo: "merchantLogoNL",
      });
    case "pt":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhitePT",
        inkLogo: "merchantLogoPT",
      });
    case "sv":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteSE",
        inkLogo: "merchantLogoSE",
      });
    case "tr":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteTR",
        inkLogo: "merchantLogoTR",
      });
    case "vi":
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteVN",
        inkLogo: "merchantLogoVN",
      });
    case "en":
    default:
      return getLogoByMode({
        mode,
        whiteLogo: "merchantLogoWhiteEN",
        inkLogo: "merchantLogoEN",
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
