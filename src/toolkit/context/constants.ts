export const MD_URL =
  process.env.ENV === "prod"
    ? "https://www.merchant.wish.com"
    : process.env.ENV === "stage"
    ? "https://staging.merchant.wish.com"
    : process.env.ENV === "dev"
    ? "https://staging.merchant.wish.com"
    : process.env.NEXT_PUBLIC_MD_URL || "";

export const WISH_URL =
  process.env.ENV === "prod"
    ? "https://www.wish.com"
    : process.env.ENV === "stage"
    ? "https://staging.wish.com"
    : process.env.ENV === "dev"
    ? "https://staging.wish.com"
    : process.env.NEXT_PUBLIC_WISH_URL || "";
