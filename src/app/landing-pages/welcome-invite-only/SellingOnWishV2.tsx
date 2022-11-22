import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/lego";
import Illustration from "@core/components/Illustration";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { css } from "@core/toolkit/styling";

type SellingOnWishProps = BaseProps & {
  readonly insetX: number;
};

const SellingOnWishV2 = (props: SellingOnWishProps) => {
  const { style, className } = props;
  const deviceStore = useDeviceStore();
  const styles = useStylesheet(props);

  return (
    <div
      className={css(
        deviceStore.isSmallScreen ? styles.rootSmallScreen : styles.root,
        className,
        style,
      )}
    >
      <div style={styles.textContainer}>
        <Text style={styles.title} weight="bold">
          Selling on Wish
        </Text>
        <Text style={styles.description}>
          With offices around the globe, Wish is one of the largest cross-border
          eCommerce marketplaces.
        </Text>
        <Text style={styles.stat}>
          Wish is one of the largest global eCommerce marketplaces, connecting
          millions of consumers to over half a million merchants globally.
        </Text>
      </div>

      <Illustration
        style={styles.illustration}
        name="globePhoneLocations"
        animate={false}
        alt={i`Global reach`}
      />
    </div>
  );
};

export default observer(SellingOnWishV2);

const useStylesheet = (props: SellingOnWishProps) => {
  const { pageBackground, textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          justifyContent: "space-between",
          backgroundColor: pageBackground,
          padding: `20px ${props.insetX}px`,
        },
        rootSmallScreen: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: `20px ${props.insetX}px`,
          marginTop: 50,
        },
        illustration: {
          height: 410,
          flexShrink: 0,
        },
        textContainer: {
          display: "flex",
          flexDirection: "column",
          width: "50%",
          paddingLeft: 30,
          "@media (min-width: 900px)": {
            maxWidth: "50%",
            alignItems: "flex-start",
          },
          "@media (max-width: 900px)": {
            maxWidth: "100%",
            alignItems: "center",
          },
        },
        title: {
          fontSize: 24,
          color: textBlack,
          marginBottom: 35,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
        },
        description: {
          fontSize: 14,
          lineHeight: 1.4,
          color: textDark,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
          marginBottom: 30,
        },
        stat: {
          fontSize: 14,
          color: textDark,
        },
        source: {
          marginTop: 5,
          fontSize: 14,
          lineHeight: 1.4,
          color: textDark,
        },
      }),
    [props.insetX, textBlack, textDark, pageBackground],
  );
};
