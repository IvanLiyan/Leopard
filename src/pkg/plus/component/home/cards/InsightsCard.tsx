import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import gql from "graphql-tag";
import numeral from "numeral";
import { useQuery } from "@apollo/react-hooks";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

import {
  Datetime,
  MerchantStats,
  ProductCatalogSchema,
  MerchantPreorder,
} from "@schema/types";

/* Lego Components */
import { Card } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

const GET_STORE_STATS = gql`
  query GetStoreStats {
    currentMerchant {
      storeStats {
        totalSold
        totalImpressions
        updateTime {
          formatted(fmt: "%B %d, %Y")
        }
      }
      preorder {
        isPreorderMerchant
        productsAreSyncing
      }
    }
    productCatalog {
      productCount
    }
  }
`;

type ResponseType = {
  readonly currentMerchant: {
    readonly storeStats: Pick<
      MerchantStats,
      "totalSold" | "totalImpressions"
    > & {
      readonly updateTime: Pick<Datetime, "formatted"> | null;
    };
    readonly preorder: Pick<
      MerchantPreorder,
      "isPreorderMerchant" | "productsAreSyncing"
    >;
  };
  readonly productCatalog: Pick<ProductCatalogSchema, "productCount">;
};

type Props = BaseProps & {
  readonly isStoreMerchant: boolean;
};

const InsightsCard: React.FC<Props> = ({
  style,
  className,
  isStoreMerchant,
}: Props) => {
  const styles = useStylesheet();
  const { data } = useQuery<ResponseType, void>(GET_STORE_STATS);
  const canShowOrderNumber = !isStoreMerchant;
  const canShowImpressions = !isStoreMerchant;

  const renderContent = () => {
    if (data == null) {
      return null;
    }

    const {
      storeStats: { totalSold, totalImpressions, updateTime: lastUpdated },
      preorder: { isPreorderMerchant, productsAreSyncing },
    } = data.currentMerchant;
    const {
      productCatalog: { productCount },
    } = data;

    const orders =
      isPreorderMerchant && productsAreSyncing ? (
        <div className={css(styles.value, styles.processing)}>Processing</div>
      ) : (
        <div className={css(styles.value, !totalSold && styles.blankValue)}>
          {numeral(totalSold).format("0,0").toString()}
        </div>
      );

    return (
      <>
        <div className={css(styles.row)}>
          <div className={css(styles.element)}>
            <div className={css(styles.title)}>Products</div>
            <div
              className={css(styles.value, !productCount && styles.blankValue)}
            >
              {numeral(productCount).format("0,0").toString()}
            </div>
          </div>
          {canShowOrderNumber && (
            <div className={css(styles.element)}>
              <div className={css(styles.border)}>
                <div className={css(styles.title)}>Orders</div>
                {orders}
              </div>
            </div>
          )}
        </div>
        <div className={css(styles.row)}>
          {canShowImpressions && (
            <div className={css(styles.element)}>
              <div className={css(styles.title)}>Impressions</div>
              <div
                className={css(
                  styles.value,
                  !totalImpressions && styles.blankValue,
                )}
              >
                {numeral(totalImpressions).format("0,0").toString()}
              </div>
            </div>
          )}
          {lastUpdated && (
            <div className={css(styles.lastUpdated)}>
              Updated on {lastUpdated.formatted}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Card style={css(style, className, styles.card)}>
      <div className={css(styles.container)}>{renderContent()}</div>
    </Card>
  );
};

export default InsightsCard;

const useStylesheet = () => {
  const { borderPrimary, textUltralight, textLight, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          maxWidth: 504,
        },
        container: {
          margin: 24,
          minHeight: 192,
          display: "flex",
          flexDirection: "column",
        },
        row: {
          display: "flex",
          flex: 1,
        },
        element: {
          flex: 1,
        },
        border: {
          borderLeft: `1px dashed ${borderPrimary}`,
          paddingLeft: 16,
        },
        title: {
          color: textLight,
          fontSize: 20,
          lineHeight: 1.4,
        },
        value: {
          color: textDark,
          fontSize: 28,
          fontWeight: weightBold,
          marginTop: 8,
        },
        blankValue: {
          color: textLight,
        },
        processing: {
          color: textUltralight,
        },
        lastUpdated: {
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          color: "#7790A3",
        },
      }),
    [borderPrimary, textUltralight, textLight, textDark],
  );
};
