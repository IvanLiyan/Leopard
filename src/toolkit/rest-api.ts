// disables required since this file works with the legacy rest api which
// is not type safe
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Product } from "@riptide/components/core/products/ProductCard";

type FetchWishAPIArgs = {
  readonly url: string;
  readonly body?: string;
};

const fetchWishAPI = async ({
  url,
  body,
}: FetchWishAPIArgs): Promise<Response> => {
  const resp = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization: process.env.AUTHORIZATION_HEADER || "",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-xsrftoken": process.env.XSRFTOKEN || "",
      cookie: `_xsrf=${process.env.XSRFTOKEN || ""};`,
    },
    body,
    method: "POST",
    mode: "cors",
  });

  return resp;
};

export type FetchAllProductsArgs = {
  readonly mid: string;
};

export const fetchAllProducts = async ({
  mid,
}: FetchAllProductsArgs): Promise<ReadonlyArray<Product>> => {
  // see https://github.com/ContextLogic/clroot/blob/master/sweeper/api/merchant.py#L24
  const resp = await fetchWishAPI({
    url: `${process.env.NEXT_PUBLIC_WISH_URL}/api/merchant`,
    body: `query=${mid}&count=20`,
  });

  const json = await resp.json();

  return json.data.results.map((result: any): Product => {
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
};

export type FetchProductFeedArgs = {
  readonly fid: string;
};

export const fetchProductFeed = async ({
  fid,
}: FetchProductFeedArgs): Promise<ReadonlyArray<Product>> => {
  // see https://github.com/ContextLogic/clroot/blob/master/sweeper/api/collection_tiles.py#L29
  const resp = await fetchWishAPI({
    url: `${process.env.NEXT_PUBLIC_WISH_URL}/api/collection/get-products`,
    body: `collection_id=${fid}&count=5`,
  });

  const json = await resp.json();

  return json.data.items.map((result: any): Product => {
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
};
