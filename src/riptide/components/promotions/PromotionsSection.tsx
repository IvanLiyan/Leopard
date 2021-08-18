import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { useTheme } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import H2 from "@riptide/components/core/H2";
import H3 from "@riptide/components/core/H3";
import Text from "@riptide/components/core/Text";

export type Props = BaseProps;

const PromotionsSection: React.FC<Props> = ({ style }: Props) => {
  const styles = useStylesheet();
  return (
    <Layout.FlexColumn style={style}>
      <H3>Current promotions</H3>
      <Layout.FlexColumn alignItems="center" style={styles.card}>
        <Text fontSize={10} lineHeight={"10px"} style={styles.terms}>
          Valid $%-1. Max discount $100.
        </Text>
        <H2>Title title title title</H2>
        <Text
          fontSize={14}
          lineHeight={"20px"}
          fontWeight="MEDIUM"
          color="BLACK"
          style={styles.text}
        >
          Enjoy up to XX% off with code:{" "}
          <span className={css(styles.code)}>CODE</span>
        </Text>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default PromotionsSection;

const useStylesheet = () => {
  const { surfaceWhite, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          position: "relative",
          marginTop: 16,
          backgroundColor: surfaceWhite,
          padding: "42px 24px",
        },
        text: {
          paddingTop: 6,
        },
        code: {
          padding: "2px 8px",
          border: `1px dashed ${textBlack}`,
        },
        terms: {
          position: "absolute",
          top: 8,
          right: 8,
        },
      }),
    [surfaceWhite, textBlack],
  );
};
