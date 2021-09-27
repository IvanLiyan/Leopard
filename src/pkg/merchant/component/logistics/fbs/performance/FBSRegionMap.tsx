/* eslint-disable filenames/match-regex */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { ComposableMap } from "@ContextLogic/lego";
import { PlusMinusButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightNormal, proxima } from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { statesInverse } from "@ContextLogic/lego/toolkit/states";

/* Merchant Components */
import FBSRegionMapLegendGradient from "@merchant/component/logistics/fbs/performance/FBSRegionMapLegendGradient";
import FBSRegionMapLegendItem from "@merchant/component/logistics/fbs/performance/FBSRegionMapLegendItem";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBSRegionMapProps = BaseProps & {
  readonly dateRange: string;
  readonly countryGMVMap: {
    [country: string]: number;
  };
  readonly stateGMVMap: {
    [state: string]: number;
  };
  readonly legendBreakpoints: ReadonlyArray<number>;
  readonly currency: string;
};

// a few country names in the topological dataset do not match the names on our side (addressutil/countries.py),
// we should programatically change those to be consistent with ours
const normalizedCountryNames = {
  /* eslint-disable local-rules/unwrapped-i18n */
  Czechia: "Czech Republic",
  Moldova: "Moldova: Republic of",
  "United Kingdom": "United Kingdom (Great Britain)",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
};

// ComposableMap expects a URL, these need to be require and not ESM import
const geoUrlWorld = require("@toolkit/world-topojson.json");
const geoUrlUSStates = require("@toolkit/us-states-topojson.json");

const [lightGray, midGray, darkGray] = ["0.4", "0.8", "1"].map(
  (a) => `rgba(175, 199, 209, ${a})`
);
const stripedGradient = `repeating-linear-gradient(
  45deg, ${lightGray}, ${lightGray} 2px, transparent 2px, transparent 5px)`;

const minZoom = 0.25;
const maxZoom = 3;

const FBSRegionMap = (props: FBSRegionMapProps) => {
  const {
    dateRange,
    countryGMVMap,
    stateGMVMap,
    legendBreakpoints,
    currency,
  } = props;
  const styles = useStyleSheet();
  const [zoom, setZoom] = useState(0.75);

  const legendColors = [lightGray, midGray, darkGray];

  // if you find this please fix the any types (legacy)
  const generateGMV = (geography: any) => {
    // the world geodata contains ISO ALPHA-2 country codes, but
    // the state geodata contains only names (in English) - we must use a non-i18n mapping backwards
    if (geography.properties.ISO_A2 in countryGMVMap) {
      return countryGMVMap[geography.properties.ISO_A2];
    } else if (
      (statesInverse.US as any)[geography.properties.name] in stateGMVMap
    ) {
      return stateGMVMap[(statesInverse.US as any)[geography.properties.name]];
    }
    return -1;
  };

  // if you find this please fix the any types (legacy)
  const generateFill = (geography: any) => {
    const gmv = generateGMV(geography);
    if (gmv === -1) {
      return "url(#fbsNoPickupStoresFill)";
    }
    const chunk = legendBreakpoints.findIndex((breakpoint) => gmv < breakpoint);
    if (chunk === -1) {
      return darkGray;
    }
    return legendColors[chunk - 1];
  };

  // react-simple-maps no longer allows svg to be passed into ComposableMap
  // so we define the defs for the map in an external svg and refer to our gradient def by id
  return (
    <div className={css(styles.content)}>
      <div className={css(styles.mapContainer)}>
        <svg height={0}>
          <defs>
            <linearGradient
              /* eslint-disable react/forbid-dom-props */
              id={"fbsNoPickupStoresFill"}
              x1={0}
              y1={5}
              x2={5}
              y2={0}
              spreadMethod={"repeat"}
              gradientUnits={"userSpaceOnUse"}
            >
              <stop offset={"0%"} stopColor={lightGray} />
              <stop offset={"20%"} stopColor={lightGray} />
              <stop offset={"20%"} stopColor={"transparent"} />
              <stop offset={"100%"} stopColor={"transparent"} />
            </linearGradient>
          </defs>
        </svg>
        <ComposableMap
          className={css(styles.map)}
          geoUrl={[geoUrlWorld, geoUrlUSStates]}
          processGeographies={(geographies) => {
            geographies.forEach((geo) => {
              if ("NAME" in geo.properties) {
                geo.properties.NAME =
                  // if you find this please fix the any types (legacy)
                  (normalizedCountryNames as any)[geo.properties.NAME] ||
                  geo.properties.NAME;
              }
            });

            /* eslint-disable local-rules/unwrapped-i18n */
            return geographies.filter(
              (geo) => geo.properties.NAME !== "United States of America"
            );
          }}
          projection="geoMercator"
          projectionConfig={{
            rotate: [0, 0, 0],
            scale: 1000,
          }}
          canZoom
          zoomProps={{
            center: [-40, 50],
            zoom,
            minZoom,
            maxZoom,
            zoomSensitivity: 0,
          }}
        >
          {(geo) => {
            return {
              fill: generateFill(geo),
              style: {
                cursor: "pointer",
                hover: {
                  stroke: palettes.coreColors.WishBlue,
                  strokeWidth: 4,
                },
              },
              renderPopover: () => {
                return (
                  <div className={css(styles.popover)}>
                    <div
                      className={css(
                        styles.popoverDateRange,
                        styles.popoverText
                      )}
                    >
                      {dateRange}
                    </div>
                    <div
                      className={css(
                        styles.popoverLocation,
                        styles.popoverText
                      )}
                    >
                      {geo.properties.NAME ||
                        i`${geo.properties.name}, United States`}
                    </div>
                    {generateGMV(geo) >= 0 && (
                      <div className={css(styles.popoverMetricsContainer)}>
                        <div
                          className={css(
                            styles.popoverMetrics,
                            styles.popoverText
                          )}
                        >
                          {`GMV`}
                        </div>
                        <div
                          className={css(
                            styles.popoverMetrics,
                            styles.popoverText
                          )}
                        >
                          {formatCurrency(generateGMV(geo), currency)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            };
          }}
        </ComposableMap>
        <div className={css(styles.zoomButtons)}>
          <PlusMinusButton
            onPlus={() => zoom < maxZoom && setZoom(zoom * 1.5)}
            onMinus={() => zoom > minZoom && setZoom(zoom / 1.5)}
          />
        </div>
      </div>
      <div className={css(styles.legendContainer)}>
        <FBSRegionMapLegendGradient
          className={css(styles.legendGradient)}
          colors={legendColors}
          prices={legendBreakpoints}
          currency={currency}
        />
        <FBSRegionMapLegendItem
          swatchFill={stripedGradient}
          text={i`No pickup stores`}
        />
      </div>
    </div>
  );
};

export default observer(FBSRegionMap);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        content: {
          display: "flex",
          flexDirection: "column",
        },
        mapContainer: {
          position: "relative",
        },
        map: {
          width: "100%",
          height: 314,
        },
        zoomButtons: {
          position: "absolute",
          bottom: 0,
          right: 0,
          alignSelf: "flex-end",
        },
        legendContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 8,
        },
        legendGradient: {
          height: 40,
          width: "30%",
          marginRight: 20,
        },
        legendItem: {
          marginRight: 20,
        },
        popover: {
          margin: 4,
        },
        popoverText: {
          fontSize: 14,
          lineHeight: 1.43,
          fontFamily: proxima,
        },
        popoverDateRange: {
          fontWeight: weightNormal,
          color: palettes.coreColors.DarkWishBlue,
          marginBottom: 4,
        },
        popoverLocation: {
          fontWeight: weightNormal,
          color: palettes.textColors.LightInk,
        },
        popoverMetricsContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 4,
        },
        popoverMetrics: {
          fontWeight: weightBold,
          color: palettes.textColors.Ink,
        },
      }),
    []
  );
};
