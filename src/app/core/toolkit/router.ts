import { NextRouter, useRouter as useNextRouter } from "next/router";

/**
 * Return the corresponding MD url. Note that the resulting link should only be used with
 * core/router or core/Link. Using it with nextjs router or link will cause the
 * basePath "md" to automatically prefix to the destination url
 */
export const merchFeUrl = (link: string): string => {
  if (typeof window == "undefined") {
    return `https://merchant.wish.com${link}`;
  }

  return `${window.location.origin}${link}`;
};

/**
 * Used in components like core/Link to check for usage of the above merchFeUrl
 */
export const isValidURL = (s: string): boolean => {
  try {
    new URL(s);
    // test has passed, s is a valid URL
    return true;
  } catch (_) {
    // test failed, s is not a valid URL
    return false;
  }
};

/**
 * Override nextjs useRouter to properly handle transitions to leopard and merch FE urls
 * - push: a function for navigating to a given url (both leopard and Merch-FE urls are acceptable)
 */
export const useRouter = (): Omit<NextRouter, "push"> & {
  push: (...args: Parameters<NextRouter["push"]>) => Promise<void>;
} => {
  const nextRouter = useNextRouter();

  // urls of the form `${window.location.origin}/slug` can be used to access
  // Merch-FE pages, while "/slug" can be used to access Leopard pages
  const push = async (...args: Parameters<NextRouter["push"]>) => {
    const url = args[0];
    if (typeof url == "string" && isValidURL(url)) {
      window.location.href = url;
    } else {
      await nextRouter.push(...args);
    }
  };

  return { ...nextRouter, push };
};
