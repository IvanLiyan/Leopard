import React, { useMemo } from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Merchant API */
import { getProductBrandDetectionInfoList } from "@merchant/api/brand/verify-brands";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { StyleSheet } from "aphrodite";

const VerifyBrandsTip = ({ className }: BaseProps) => {
  const styles = useStylesheet();
  const [response] = useRequest(
    getProductBrandDetectionInfoList({
      fetch_count_only: true,
      limit: 1,
    }).setOptions({
      failSilently: true,
    }),
  );

  const totalCount = response?.data?.total_count || 0;
  const { warning } = useTheme();

  return (
    <div className={css(className)}>
      {totalCount > 0 && (
        <Tip color={warning} icon="warning">
          <div className={css(styles.tipTextContainer)}>
            <div className={css(styles.title)}>
              Verify Branded Product Listings
            </div>
            <div className={css(styles.description)}>
              Wish has detected branded product listings. Verify to optimize
              your listings and maximize sales.
            </div>
            <Button
              className={css(styles.verifyButton)}
              href={"/branded-products/verify-brands"}
            >
              Verify Brands
            </Button>
          </div>
        </Tip>
      )}
    </div>
  );
};

export default observer(VerifyBrandsTip);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        tipTextContainer: {
          display: "flex",
          flexDirection: "column",
          fontSize: 14,
        },
        verifyButton: {
          maxWidth: 160,
          width: "100%",
          height: 40,
        },
        title: {
          fontWeight: weightBold,
        },
        description: {
          marginBottom: 12,
        },
      }),
    [],
  );
