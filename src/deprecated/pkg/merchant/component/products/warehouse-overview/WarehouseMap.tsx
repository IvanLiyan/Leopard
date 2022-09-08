/*
 * WarehouseMap.tsx
 *
 * Created by Jonah Dlin on Tue Feb 23 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { ComposableMap, PlusMinusButton, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Schema */
import { CountryCode } from "@schema/types";

import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Toolkit */
import { PickedWarehouseType } from "@toolkit/products/warehouse-overview";

// ComposableMap expects a URL, this needs to be require and not ESM import
const geoUrlWorld110m = require("@toolkit/world-topojson.json");

type Props = BaseProps & {
  readonly warehouses: ReadonlyArray<PickedWarehouseType>;
};

type CountryColor = "RED" | "YELLOW" | "GREY" | "NONE";

const MinZoom = 1;
const MaxZoom = 5;

const WarehouseMap: React.FC<Props> = ({
  className,
  style,
  warehouses,
}: Props) => {
  const styles = useStylesheet();
  const [zoom, setZoom] = useState(1);

  const { surfaceLight, surfaceDark, negative, warning, primary } = useTheme();

  const renderWarehouseLocation = ({
    title,
    subtitle,
    sentiment,
  }: {
    title: string;
    subtitle: string;
    sentiment: Exclude<CountryColor, "NONE">;
  }) => {
    const illustrationMap: {
      [color in Exclude<CountryColor, "NONE">]: IllustrationName;
    } = {
      RED: "locationMarkerRed",
      YELLOW: "locationMarkerYellow",
      GREY: "locationMarkerGrey",
    };

    return (
      <div
        key={`${title}${subtitle}`}
        className={css(styles.warehouseLocation)}
      >
        <Illustration
          className={css(styles.marker)}
          name={illustrationMap[sentiment]}
          alt=""
        />
        <Text className={css(styles.locationTitle)}>{title}</Text>
        <Text className={css(styles.locationSubtitle)}>{subtitle}</Text>
      </div>
    );
  };

  const renderPopover = (cc: CountryCode) => {
    const popoverWarehouses = warehouses
      .filter(({ address }) => address != null && address.country.code === cc)
      .sort(({ weekStats: aWeekStats }, { weekStats: bWeekStats }) => {
        if (aWeekStats.length === 0) {
          return 1;
        }
        if (bWeekStats.length === 0) {
          return -1;
        }
        const {
          isLateDeliveryRateHigh: aIsWithheld,
          isLateDeliveryRateAtRisk: aIsRiskOfWithheld,
        } = aWeekStats[0];
        const {
          isLateDeliveryRateHigh: bIsWithheld,
          isLateDeliveryRateAtRisk: bIsRiskOfWithheld,
        } = bWeekStats[0];
        if (aIsWithheld) {
          return -1;
        }
        if (bIsWithheld) {
          return 1;
        }
        if (aIsRiskOfWithheld) {
          return -1;
        }
        if (bIsRiskOfWithheld) {
          return 1;
        }
        return 0;
      });

    return (
      <div
        className={css(styles.popover)}
        style={{
          gridTemplateRows: `repeat(${Math.min(
            popoverWarehouses.length,
            3
          )}, max-content)`,
        }}
      >
        {popoverWarehouses.map(({ unitId, address, weekStats }, index) => {
          // unreachable, null address are filtered out, TS can't see this
          if (address == null) {
            return null;
          }
          const {
            city,
            // state,
            country: { code },
          } = address;

          const isWithheld =
            weekStats.length > 0 ? weekStats[0].isLateDeliveryRateHigh : false;
          const isRiskOfWithheld =
            weekStats.length > 0
              ? weekStats[0].isLateDeliveryRateAtRisk
              : false;

          if (popoverWarehouses.length > 6) {
            if (index === 5) {
              return renderWarehouseLocation({
                title: i`+${popoverWarehouses.length - 6} more`,
                subtitle: i`Various locations`,
                sentiment: "GREY",
              });
            }
            if (index > 5) {
              return null;
            }
          }

          const subtitle = [
            city,
            // ...(state ? [state] : []),
            code,
          ].join(", ");

          let color: Exclude<CountryColor, "NONE"> = "GREY";
          if (isWithheld) {
            color = "RED";
          } else if (isRiskOfWithheld) {
            color = "YELLOW";
          }

          return renderWarehouseLocation({
            title: unitId,
            subtitle,
            sentiment: color,
          });
        })}
      </div>
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.mapWrapper)}>
        <ComposableMap
          className={css(styles.map)}
          geoUrl={[geoUrlWorld110m]}
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            rotate: [-11, 0, 0],
          }}
          canZoom
          zoomProps={{
            center: [0, 0],
            zoom,
            minZoom: MinZoom,
            maxZoom: MaxZoom,
          }}
        >
          {(geo) => {
            const cc = geo.properties.ISO_A2 as CountryCode;
            const color: CountryColor = warehouses.reduce(
              (
                currentColor,
                { address, weekStats }: PickedWarehouseType
              ): CountryColor => {
                // unreachable, null address are filtered out, TS can't see this
                if (address == null) {
                  return currentColor;
                }

                const {
                  country: { code },
                } = address;

                const isWithheld =
                  weekStats.length > 0
                    ? weekStats[0].isLateDeliveryRateHigh
                    : false;
                const isRiskOfWithheld =
                  weekStats.length > 0
                    ? weekStats[0].isLateDeliveryRateAtRisk
                    : false;
                if (currentColor === "RED" || (code === cc && isWithheld)) {
                  return "RED";
                }
                if (
                  currentColor === "YELLOW" ||
                  (code === cc && isRiskOfWithheld)
                ) {
                  return "YELLOW";
                }
                if (currentColor === "GREY" || code === cc) {
                  return "GREY";
                }
                return "NONE";
              },
              "NONE" as CountryColor
            );

            const fillMap: { [color in CountryColor]: string } = {
              RED: negative,
              YELLOW: warning,
              GREY: surfaceDark,
              NONE: surfaceLight,
            };

            return {
              fill: fillMap[color],
              style: {
                cursor: color == "NONE" ? "move" : "pointer",
                hover:
                  color == "NONE"
                    ? { cursor: "move" }
                    : { stroke: primary, strokeWidth: 1, cursor: "pointer" },
                active: {
                  cursor: color == "NONE" ? "move" : "pointer",
                },
              },
              renderPopover:
                color == "NONE" ? undefined : () => renderPopover(cc),
            };
          }}
        </ComposableMap>
      </div>
      <div className={css(styles.zoomButtons)}>
        <PlusMinusButton
          onPlus={() => zoom < MaxZoom && setZoom(zoom * 1.5)}
          onMinus={() => zoom > MinZoom && setZoom(zoom / 1.5)}
        />
      </div>
    </div>
  );
};

export default observer(WarehouseMap);

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          position: "relative",
          paddingBottom: "50%", // 2:1 aspect ratio
        },
        mapWrapper: {
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        },
        map: {
          position: "absolute",
          cursor: "move",
          marginTop: "12%", // initial vertical position of map
        },
        zoomButtons: {
          position: "absolute",
          bottom: 0,
          right: 0,
          alignSelf: "flex-end",
        },
        popover: {
          padding: 10,
          display: "grid",
          gridAutoFlow: "column",
          columnGap: "41px",
          rowGap: 8,
        },
        warehouseLocation: {
          display: "grid",
          columnGap: "10px",
          alignItems: "flex-start",
          justifyItems: "start",
          gridTemplateColumns: "max-content",
        },
        marker: {
          marginTop: 2,
          width: 12,
          gridRow: "1 / 3",
          gridColumn: 1,
        },
        locationTitle: {
          gridColumn: 2,
          gridRow: 1,
          color: textBlack,
          fontSize: 14,
          lineHeight: "20px",
        },
        locationSubtitle: {
          gridColumn: 2,
          gridRow: 2,
          color: textDark,
          fontSize: 12,
          lineHeight: "16px",
        },
      }),
    [textBlack, textDark]
  );
};
