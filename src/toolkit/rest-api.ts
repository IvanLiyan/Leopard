// disables required since this file works with the legacy rest api which
// is not type safe
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as Sentry from "@sentry/nextjs";

import axios, { AxiosResponse } from "axios";
import qs from "qs";
import retry from "async-retry";

import { WISH_URL } from "@toolkit/context/constants";
import { Product } from "@riptide/components/productFeed/ProductCard";

const COUNT = 20;
const NUM_RETRIES = 5;
const INITIAL_DELAY_MS = 300;

type FetchWishAPIArgs = {
  readonly url: string;
  readonly body?: { [index: string]: string | number };
};

const fetchWishAPI = async ({
  url,
  body,
}: FetchWishAPIArgs): Promise<AxiosResponse> => {
  return await retry(
    async () => {
      // see https://github.com/ContextLogic/web/blob/96d1c2fb7704fb1a225f75759213af87d33ae496/cozy/utils/InternalCall.tsx#L58
      return await axios({
        method: "POST",
        url,
        data: qs.stringify({ ...body }, { arrayFormat: "brackets" }),
        xsrfCookieName: "_xsrf",
        xsrfHeaderName: "X-XSRFToken",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    {
      retries: NUM_RETRIES,
      minTimeout: INITIAL_DELAY_MS,
      randomize: true,
    },
  );
};

export type FetchAllProductsArgs = {
  readonly mid: string;
};

export const fetchAllProducts = async ({
  mid,
}: FetchAllProductsArgs): Promise<ReadonlyArray<Product>> => {
  // see https://github.com/ContextLogic/clroot/blob/master/sweeper/api/merchant.py#L24
  try {
    const resp = await fetchWishAPI({
      url: `${WISH_URL}/api/merchant`,
      body: { query: mid, count: COUNT },
    });

    const data = await resp.data();

    return data.results.map((result: any): Product => {
      const product: Product = {
        pid: result.id,
        imageUrl: result.display_picture,
        productUrl: result.external_mobile_url,
        productName:
          result.product_name_translation.translation ||
          result.product_name_translation.product_original_name,
        originalPrice: `${result.localized_value.symbol}${result.localized_value.localized_value}`,
        discountedPrice: `${result.commerce_product_info.variations[0].localized_price.symbol}${result.commerce_product_info.variations[0].localized_price.localized_value}`,
        numPurchasersText: result.feed_tile_text,
      };
      return product;
    });
  } catch (err) {
    Sentry.captureException(err);
    return [];
  }
};

export type FetchProductFeedArgs = {
  readonly fid: string;
};

export const fetchProductFeed = async ({
  fid,
}: FetchProductFeedArgs): Promise<ReadonlyArray<Product>> => {
  // see https://github.com/ContextLogic/clroot/blob/master/sweeper/api/collection_tiles.py#L29
  try {
    const resp = await fetchWishAPI({
      url: `${WISH_URL}/api/collection/get-products`,
      body: { collection_id: fid, count: COUNT },
    });

    const data = await resp.data();

    return data.items.map((result: any): Product => {
      const product: Product = {
        pid: result.id,
        imageUrl: result.display_picture,
        productUrl: result.external_mobile_url,
        productName:
          result.product_name_translation.translation ||
          result.product_name_translation.product_original_name,
        originalPrice: `${result.localized_value.symbol}${result.localized_value.localized_value}`,
        discountedPrice: `${result.commerce_product_info.variations[0].localized_price.symbol}${result.commerce_product_info.variations[0].localized_price.localized_value}`,
        numPurchasersText: result.feed_tile_text,
      };
      return product;
    });
  } catch (err) {
    Sentry.captureException(err);
    return [];
  }
};
