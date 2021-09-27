import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { cni18n, ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Accordion, Markdown, Text } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";
import { EligibleProductsSearchType } from "@merchant/api/price-drop";

/* Merchant Components */
import PriceDropEligibleProducts from "@merchant/component/products/price-drop/PriceDropEligibleProducts";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { EligibleProduct } from "@merchant/api/price-drop";
import { CellInfo } from "@ContextLogic/lego";
import {
  useBoolQueryParam,
  useIntQueryParam,
  useStringEnumQueryParam,
  useStringQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { PriceDropConstants } from "@toolkit/price-drop/constants";
import { useTheme } from "@merchant/stores/ThemeStore";

type PriceDropCreateCampaignProductsSectionProps = BaseProps & {
  readonly selectedProduct: EligibleProduct | null | undefined;
  readonly onProductSelect: (
    product: EligibleProduct | null | undefined
  ) => void;
  readonly dropPercentage: number;
};

export const PriceDropProductPageSize = 10;

const PriceDropCreateCampaignProductsSection = (
  props: PriceDropCreateCampaignProductsSectionProps
) => {
  const styles = useStylesheet();
  const {
    className,
    style,
    onProductSelect,
    selectedProduct,
    dropPercentage,
  } = props;
  const [tableExpanded, setTableExpanded] = useState(true);

  const [searchOption] = useStringEnumQueryParam<EligibleProductsSearchType>(
    "search_type",
    "id"
  );
  const [query] = useStringQueryParam("q");
  const [startId] = useStringQueryParam("sid");
  const [rawOffset] = useIntQueryParam("offset");
  const [wishExpressOnly] = useBoolQueryParam("wish_express", false);
  const debouncedQuery = useDebouncer(query, 500);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : "";

  const offset = rawOffset || 0;

  const params: priceDropApi.GetPriceDropEligibleProductsParams = {
    count: PriceDropProductPageSize,
    start: offset,
    search_type: searchOption,
    search_query: searchQuery,
    wish_express_only: wishExpressOnly,
    start_id: startId,
  };

  const productRequest = priceDropApi.getPriceDropEligibleProducts(params);
  const data = productRequest.response?.data;
  const isExempted = data?.is_exempted || false;

  const salesText = cni18n(
    "A requirement for a product to appear in a list of products eligible for a price drop campaign",
    PriceDropConstants.PREFILTER_MIN_SALE_COUNT,
    "At least 1 sale",
    "At least %1$d sales"
  );
  const numRatingText = cni18n(
    "A requirement for a product to appear in a list of products eligible for a price drop campaign",
    PriceDropConstants.PREFILTER_MIN_RATING_COUNT,
    "At least 1 rating",
    "At least %1$d ratings"
  );
  const minRatingText = ci18n(
    "A requirement for a product to appear in a list of products eligible for a price drop campaign",
    "An average rating greater than %1$s",
    PriceDropConstants.PREFILTER_MIN_AVERAGE_RATING.toString()
  );

  const description = isExempted
    ? i`Select a product that you would like to promote in this campaign.`
    : ci18n(
        "This text is displayed above a bullet point list of requirements for products to be eligible for a price drop campaign",
        "Select a product that you would like to promote in this campaign. Products are eligible if they have"
      ) +
      `\n\n` +
      `- ${salesText}` +
      `\n\n` +
      `- ${numRatingText}` +
      `\n\n` +
      `- ${minRatingText}`;

  const renderPriceRange = (
    product: EligibleProduct,
    includeDropPercentage?: boolean | null | undefined
  ) => {
    const minPrice = includeDropPercentage
      ? (product.min_price * (100 - dropPercentage)) / 100.0
      : product.min_price;
    const maxPrice = includeDropPercentage
      ? (product.max_price * (100 - dropPercentage)) / 100.0
      : product.max_price;
    const currencyCode = product.currency_code;

    if (minPrice === maxPrice) {
      return formatCurrency(minPrice, currencyCode);
    }
    return `${formatCurrency(minPrice, currencyCode)}-${formatCurrency(
      maxPrice,
      currencyCode
    )}`;
  };

  return (
    <div className={css(className, style)}>
      {selectedProduct != null && (
        <div className={css(styles.topMargin)}>
          The following product has been added to this campaign.
        </div>
      )}
      {selectedProduct != null && (
        <Table
          className={css(styles.topMargin)}
          data={[selectedProduct]}
          fixLayout
          overflowY="visible"
          highlightRowOnHover
          rowHeight={68}
        >
          <ProductColumn
            showProductId
            title={i`Product ID`}
            columnKey="id"
            align="left"
          />
          <Table.Column
            columnKey="name"
            title={i`Product name`}
            noDataMessage={"\u2014"}
          >
            {({ value }) => {
              if (value.length > 30) {
                return value.substring(0, 30) + "...";
              }
              return value;
            }}
          </Table.Column>
          <Table.Column
            columnKey="parent_sku"
            title={i`Parent SKU`}
            noDataMessage={"\u2014"}
          />
          <Table.Column
            title={i`Listed Price`}
            columnKey="min_price"
            align="left"
          >
            {({ row }: CellInfo<number, EligibleProduct>) =>
              renderPriceRange(row)
            }
          </Table.Column>
        </Table>
      )}
      <Markdown
        className={css(styles.text, styles.topMargin)}
        text={description}
      />

      <Card showOverflow style={css(styles.topMargin)}>
        <Accordion
          className={css(styles.accordion)}
          header={() => (
            <Text weight="semibold" className={css(styles.accordionHeader)}>
              View All Products
            </Text>
          )}
          onOpenToggled={(isOpen) => {
            setTableExpanded(isOpen);
          }}
          isOpen={tableExpanded}
        >
          <PriceDropEligibleProducts
            selectedProduct={selectedProduct}
            onProductSelect={onProductSelect}
            data={data}
            isLoading={productRequest?.isLoading}
          />
        </Accordion>
      </Card>
    </div>
  );
};

export default observer(PriceDropCreateCampaignProductsSection);

const useStylesheet = () => {
  const { textBlack, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: textBlack,
          fontSize: 16,
        },
        topMargin: {
          marginTop: 20,
        },
        accordion: {
          backgroundColor: surfaceLightest,
        },
        accordionHeader: {
          fontSize: 16,
          color: textBlack,
        },
      }),
    [textBlack, surfaceLightest]
  );
};
