import { isStaging, isTesting, isSandbox } from "@stores/EnvironmentStore";

export const absURL = (path: string, hostname?: string): string => {
  let port = location.port;
  port = port == "" || port == "80" ? "" : ":" + port;
  if (path.indexOf("/") == 0) {
    path = path.substring(1);
  }
  if (!hostname) {
    hostname = location.hostname;
  }
  return location.protocol + "//" + hostname + port + "/" + path;
};

export const updateHash = (category: string, value: string): void => {
  window.location.hash = category + "=" + value;
};

export const getURIFragment = (name: string): string => {
  const regex_string = "#" + name + "=([^&#]*)";
  const regex = new RegExp(regex_string);
  const result = regex.exec(window.location.hash);
  if (result == null) {
    return "";
  } else {
    return decodeURIComponent(result[1]);
  }
};

export const getURLParams = (): { [key: string]: string } => {
  const queryDict: { [key: string]: string } = {};

  location.search
    .substr(1)
    .split("&")
    .forEach((item) => {
      const key = decodeURIComponent(item.split("=")[0]);
      const val = decodeURIComponent(item.split("=")[1]);
      queryDict[key] = val;
    });

  return queryDict;
};

export const getURLParam = (key: string): string | null => {
  const params = getURLParams();
  if (key in params) {
    return params[key];
  } else {
    return null;
  }
};

export const absExtURL = (url: string): string => {
  if (url.indexOf("https://") === 0) {
    return "https://" + url.replace("https://", "");
  }
  return "http://" + url.replace("http://", "");
};

export const wishURL = (path: string): string => {
  const domain = (() => {
    if (isStaging) {
      return "staging.wish.com";
    } else if (isTesting) {
      return "testing.wish.com";
    } else if (isSandbox) {
      return "sandbox.wish.com";
    } else {
      return "wish.com";
    }
  })();

  return `${location.protocol}//${domain}${path}`;
};

export const contestImageURL = (
  contest_id: string,
  size?: string,
  sequence_id?: string,
  cache_buster?: string,
): string => {
  if (!size) {
    size = "medium";
  }
  let sequence_id_string = "";
  if (sequence_id) {
    sequence_id_string = sequence_id + "-";
  }
  let cache_buster_string = "";
  if (cache_buster) {
    cache_buster_string = "?cache_buster=" + cache_buster;
  }

  // @ts-expect-error: need to add lemmings_url to GQL (ex: "https://canary.contestimg.wish.com/api/webimage") (https://jira.wish.site/browse/MKL-54835)
  return `${window.lemmings_url}/${contest_id}-${sequence_id_string}${size}.jpg${cache_buster_string}`;
};

export const resizedContestImageURL = (
  contest_id: string,
  width?: number,
  height?: number,
  sequence_id?: string,
  mode?: string,
): string => {
  let url = window.location.protocol;
  url += "//canary.contestimg.wish.com/api/image/fetch?contest_id=";
  url += contest_id;

  if (width) {
    url += "&w=";
    url += Math.ceil(width);
  }

  if (height) {
    url += "&h=";
    url += Math.ceil(height);
  }

  if (sequence_id) {
    url += "&s=";
    url += sequence_id;
  }

  if (mode != null) {
    url += "&m=";
    url += mode;
  }

  return url;
};

export const zendeskURL = (article_id: string): string => {
  const zendeskLocale = getZendeskLocale();
  const zendeskUrl = `https://merchantfaq.wish.com/hc/${zendeskLocale}/articles/${article_id}`;
  return absExtURL(zendeskUrl);
};

export const zendeskCategoryURL = (
  category_id: string,
  locale?: string,
): string => {
  const zendeskLocale = getZendeskLocale(locale);
  const zendeskCategoryUrl = `https://merchantfaq.wish.com/hc/${zendeskLocale}/categories/${category_id}`;
  return absExtURL(zendeskCategoryUrl);
};

export const zendeskSectionURL = (
  section_id: string,
  locale?: string,
): string => {
  const zendeskLocale = getZendeskLocale(locale);
  const zendeskUrl = `https://merchantfaq.wish.com/hc/${zendeskLocale}/sections/${section_id}`;
  return absExtURL(zendeskUrl);
};

export const getZendeskLocale = (locale?: string): string => {
  // @ts-expect-error: need to add locale_info to GQL (https://jira.wish.site/browse/MKL-54838)
  // TODO [lliepert, yzhang]: check to make sure this still works for Chinese merchants
  const zendeskLocale = locale || window?.locale_info?.locale || "en";

  if (zendeskLocale === "en") {
    return "en-us";
  }
  if (zendeskLocale === "zh") {
    return "zh-cn";
  }

  return zendeskLocale;
};
