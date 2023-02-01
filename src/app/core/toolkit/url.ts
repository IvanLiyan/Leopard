import { useCallback, useMemo } from "react";
import moment from "moment/moment";
import { isStaging, isTesting, isSandbox } from "@core/stores/EnvironmentStore";
import NavigationStore, {
  useNavigationStore,
} from "@core/stores/NavigationStore";

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
  contestId: string,
  size = "medium",
  sequenceId?: string,
  cacheBuster?: string,
): string => {
  let sequenceIdString = "";
  if (sequenceId) {
    sequenceIdString = sequenceId + "-";
  }
  let cacheBusterString = "";
  if (cacheBuster) {
    cacheBusterString = "?cache_buster=" + cacheBuster;
  }

  // clroot uses a different lemmings URL if mockS3 is true or it is running in sandbox
  // see sweeper/merchant_dashboard/base_handler.py:3749
  // since we aren't supporting either option, we can hardcode the standard URL
  return `https://canary.contestimg.wish.com/api/webimage/${contestId}-${sequenceIdString}${size}.jpg${cacheBusterString}`;
};

export const resizedContestImageURL = (
  contestId: string,
  width?: number,
  height?: number,
  sequenceId?: string,
  mode?: string,
): string => {
  let url = window.location.protocol;
  url += "//canary.contestimg.wish.com/api/image/fetch?contest_id=";
  url += contestId;

  if (width) {
    url += "&w=";
    url += Math.ceil(width);
  }

  if (height) {
    url += "&h=";
    url += Math.ceil(height);
  }

  if (sequenceId) {
    url += "&s=";
    url += sequenceId;
  }

  if (mode != null) {
    url += "&m=";
    url += mode;
  }

  return url;
};

export const zendeskURL = (articleId: string): string => {
  const zendeskLocale = getZendeskLocale();
  const zendeskUrl = `https://merchantfaq.wish.com/hc/${zendeskLocale}/articles/${articleId}`;
  return absExtURL(zendeskUrl);
};

export const zendeskCategoryURL = (
  categoryId: string,
  locale?: string,
): string => {
  const zendeskLocale = getZendeskLocale(locale);
  const zendeskCategoryUrl = `https://merchantfaq.wish.com/hc/${zendeskLocale}/categories/${categoryId}`;
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

export const StringOptions: QueryParamOptions<string> = {
  default: "",
  mapper: {
    deserialize: (value) => value,
    serialize: (str) => str || "",
  },
};

export const IntOptions: QueryParamOptions<number> = {
  default: "",
  mapper: {
    deserialize: (str) => parseInt(str || "") || 0,
    serialize: (value) => (value != null ? value.toString() : ""),
  },
};

export const BoolOptions: QueryParamOptions<boolean> = {
  default: null,
  mapper: {
    deserialize: (str) => (str == null ? str : str === "true"),
    serialize: (value) => (value ? value.toString() : ""),
  },
};

export const StringArrayOptions: QueryParamOptions<ReadonlyArray<string>> = {
  default: "",
  mapper: {
    deserialize: (str) => (str || "").split(",").filter((_) => _.length > 0),
    serialize: (list): string => list.join(","),
  },
};

export const SetOptions: QueryParamOptions<ReadonlySet<unknown>> = {
  default: "",
  mapper: {
    deserialize: (str) =>
      new Set((str || "").split(",").filter((_) => _.length > 0)),
    serialize: (set) => Array.from(set).join(","),
  },
};

export const IntArrayOptions: QueryParamOptions<ReadonlyArray<number>> = {
  default: "",
  mapper: {
    deserialize: (str) =>
      (str || "")
        .split(",")
        .map((_) => parseInt(_))
        .filter((_) => !isNaN(_)),
    serialize: (list) => list.join(","),
  },
};

export const dateOptions = (args: {
  format: string;
}): QueryParamOptions<Date> => ({
  default: "",
  mapper: {
    deserialize: (str) => {
      if (!str) {
        return null;
      }
      return moment(str, args.format).toDate();
    },
    serialize: (date) => {
      if (!date) {
        return "";
      }
      return moment(date).format(args.format);
    },
  },
});

export const usePathParams = (
  pattern: string,
): {
  // legacy code, any's need to be fixed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} => {
  const navigationStore = NavigationStore.instance();
  return navigationStore.pathParams(pattern);
};

export const mdLink = (text: string, url: string): string => {
  return `[${text}](${url})`;
};

export const mdList = (text: string): string => {
  return `- ${text}`;
};

export const learnMoreLink = (
  learnMoreURL?: string,
  addFinalPeriod?: boolean,
): string => {
  if (!learnMoreURL) {
    return "";
  }
  const learnMoreText = addFinalPeriod ? i`Learn more.` : i`Learn more`;
  const learnMoreLink = mdLink(learnMoreText, learnMoreURL);
  return learnMoreLink;
};

export const learnMoreZendesk = (
  zendeskNumber: string,
  addFinalPeriod?: boolean,
): string => {
  if (!zendeskNumber) {
    return "";
  }
  return learnMoreLink(zendeskURL(zendeskNumber), addFinalPeriod);
};

export const learnMoreZendeskCategory = (
  zendeskNumber: string,
  addFinalPeriod?: boolean,
): string => {
  if (!zendeskNumber) {
    return "";
  }
  return learnMoreLink(zendeskCategoryURL(zendeskNumber), addFinalPeriod);
};

type QueryParamOptions<T> = {
  // legacy code, any's need to be fixed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any;
  mapper?: {
    deserialize?: (rawValue: string) => T | null | undefined;
    serialize?: (domain: T) => string;
  };
};

const useQueryParam = <T>(
  key: string,
  options: QueryParamOptions<T> = { default: null },
): [T | null | undefined, (value: T | null | undefined) => void] => {
  const navigationStore = useNavigationStore();
  const { queryParams, currentPath } = navigationStore;
  const value: T | null | undefined = useMemo(() => {
    const currentValueRaw = queryParams[key];
    let currentValue: T | null | undefined = null;
    if (options.mapper && options.mapper.deserialize) {
      currentValue = options.mapper.deserialize(currentValueRaw);
    }

    return currentValue;
    // Eslint bug: it thinks `T` is dependency, but its a type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, options.mapper, queryParams]);

  const setter = useCallback(
    async (value: T | null | undefined) => {
      const { queryParams } = navigationStore;
      const newQueryParams = { ...queryParams };

      let valRaw: string | null | undefined = null;
      if (value != null && options.mapper && options.mapper.serialize) {
        valRaw = options.mapper.serialize(value);
      }

      if (valRaw == null || options?.default == valRaw) {
        delete newQueryParams[key];
      } else {
        newQueryParams[key] = valRaw;
      }

      if (currentPath != null) {
        if (valRaw != null || Object.keys(newQueryParams).length) {
          await navigationStore.pushPath(currentPath, newQueryParams);
        } else {
          await navigationStore.pushPath(currentPath);
        }
      }
    },
    // Eslint bug: it thinks `T` is dependency, but its a type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, options, navigationStore, currentPath],
  );

  return [value, setter];
};

export const useIntQueryParam = (
  key: string,
): [number | null | undefined, (value: number | null | undefined) => void] => {
  return useQueryParam(key, IntOptions);
};

export const useIntArrayQueryParam = (
  key: string,
): [
  ReadonlyArray<number> | null | undefined,
  (value: ReadonlyArray<number> | null | undefined) => void,
] => {
  return useQueryParam<ReadonlyArray<number>>(key, IntArrayOptions);
};

export const useStringQueryParam = (
  key: string,
  defaultValue = "",
): [string, (value: string | null | undefined) => void] => {
  const [v, setter] = useQueryParam(key, StringOptions);
  return [v || defaultValue, setter];
};

export const useStringEnumQueryParam = <T>(
  key: string,
  defaultValue?: null | undefined | T,
): [T, (value: null | undefined | T) => void] => {
  const [v, setter] = useQueryParam(key, StringOptions);
  return [
    (v || defaultValue) as T,
    setter as (value: null | undefined | T) => void,
  ];
};

export const useStringEnumArrayQueryParam = (
  key: string,
  defaultValue?: ReadonlyArray<string>,
): [ReadonlyArray<string>, (value: ReadonlyArray<string>) => void] => {
  const [v, setter] = useQueryParam<ReadonlyArray<string>>(
    key,
    StringArrayOptions,
  );
  return [
    v || defaultValue || [],
    setter as (value: ReadonlyArray<string>) => void,
  ];
};

export const useIntEnumQueryParam = <T>(
  key: string,
  defaultValue: null | undefined | T,
): [T, (value: null | undefined | T) => void] => {
  const [v, setter] = useQueryParam(key, IntOptions);
  return [
    (v || defaultValue) as T,
    setter as (value: null | undefined | T) => void,
  ];
};

// TODO: Support passing <T>
export const useStringArrayQueryParam = (
  key: string,
  defaultValue?: null | undefined | ReadonlyArray<string>,
): [ReadonlyArray<string>, (value: ReadonlyArray<string>) => void] => {
  const [v, setter] = useQueryParam<ReadonlyArray<string>>(
    key,
    StringArrayOptions,
  );

  const value = useMemo(
    () => (v != null && v.length > 0 ? v : defaultValue || []),
    [v, defaultValue],
  );
  return [
    value,
    setter as (value: null | undefined | ReadonlyArray<string>) => void,
  ];
};

export const useStringSetQueryParam = <T>(
  key: string,
  defaultValue: ReadonlySet<T> = new Set(),
): [ReadonlySet<T>, (value: ReadonlySet<T>) => void] => {
  const [v, setter] = useQueryParam(key, SetOptions);
  const value = useMemo(() => v || defaultValue, [v, defaultValue]);
  return [value as ReadonlySet<T>, setter];
};

export const useDateQueryParam = (
  key: string,
  args: { format: string; defaultValue?: Date | null | undefined } = {
    format: "YYYY-MM-DD",
  },
): [Date | null | undefined, (value: Date | null | undefined) => void] => {
  const [v, setter] = useQueryParam(key, dateOptions(args));
  const value = useMemo(() => v || args.defaultValue, [v, args.defaultValue]);
  return [value, setter];
};

export const useBoolQueryParam = (
  key: string,
  defaultValue = false,
): [boolean, (value: boolean | null | undefined) => void] => {
  const [val, setter] = useQueryParam(key, BoolOptions);
  return [val != null ? val : defaultValue, setter];
};
