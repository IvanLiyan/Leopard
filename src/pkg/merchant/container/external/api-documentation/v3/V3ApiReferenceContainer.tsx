import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { RedocStandalone } from "redoc";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as reference from "@merchant/api/reference";

/* SVGs */
import wishLogo from "@assets/img/wish-logo-white.svg";
import { useRequest } from "@toolkit/api";

const V3ApiReferenceContainer = () => {
  const styles = useStylesheet();

  const [response] = useRequest(reference.getOpenApiSpec({}));
  const spec = response?.data?.results;
  if (!spec) {
    return <LoadingIndicator className={css(styles.loading)} />;
  }

  const modifiedSpec = { ...spec };

  // if you find this please fix the any types (legacy)
  (modifiedSpec.info as any)["x-logo"] = {
    url: wishLogo,
    altText: i`Wish Marketplace API`,
    backgroundColor: palettes.coreColors.WishBlue,
    href: "/",
  };

  const specObject = JSON.parse(JSON.stringify(modifiedSpec));

  /* sort errors by lexicographical order */
  if (specObject.paths != null) {
    for (const endpoint of Object.keys(specObject.paths)) {
      for (const method of Object.keys(specObject.paths[endpoint])) {
        try {
          const exampleErrors =
            specObject.paths[endpoint][method].responses["400"].content[
              "application/json"
            ].examples;
          const sortedExampleErrors = {};
          Object.keys(exampleErrors)
            .sort()
            .forEach((key) => {
              (sortedExampleErrors as any)[key] = exampleErrors[key];
            });
          specObject.paths[endpoint][method].responses["400"].content[
            "application/json"
          ].examples = sortedExampleErrors;
        } catch {
          //pass
        }
      }
    }
  }

  return (
    <div className={css(styles.root)}>
      <RedocStandalone spec={specObject} options={RedocOptions} />
    </div>
  );
};

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      display: "flex",
      alignItems: "stretch",
      flexDirection: "column",
      backgroundColor: palettes.textColors.White,
    },
    loading: {
      margin: "300px 50%",
    },
  });

const RedocOptions = {
  hideDownloadButton: true,
  nativeScrollbars: true,
  requiredPropsFirst: true,
  sortPropsAlphabetically: true,
  theme: {
    colors: {
      primary: {
        main: palettes.textColors.Ink,
      },
      success: {
        main: palettes.cyans.LightCyan,
      },
      warning: {
        main: palettes.yellows.Yellow,
      },
      error: {
        main: palettes.reds.DarkRed,
      },
      text: {
        primary: palettes.textColors.Ink,
      },
    },
    schema: {
      nestedBackground: palettes.textColors.White,
    },
    typography: {
      fontFamily: fonts.proxima,
      fontWeightRegular: fonts.weightNormal,
      fontWeightBold: fonts.weightBold,
      headings: {
        fontFamily: fonts.proxima,
        fontWeight: fonts.weightBold,
      },
      links: {
        color: palettes.coreColors.WishBlue,
      },
      code: {
        wrap: true,
      },
    },
    rightPanel: {
      backgroundColor: palettes.textColors.Ink,
    },
    menu: {
      backgroundColor: palettes.greyScaleColors.LighterGrey,
      textColor: palettes.textColors.Ink,
      groupItems: {
        textTransform: "capitalize",
      },
      level1Items: {
        textTransform: "capitalize",
      },
    },
    logo: {
      gutter: "30px",
    },
  },
};

export default observer(V3ApiReferenceContainer);
