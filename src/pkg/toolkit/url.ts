import { useNavigationStore } from "@stores/NavigationStore";
import { isStaging, isTesting, isSandbox } from "@stores/EnvironmentStore";

/* eslint-disable no-underscore-dangle */
import { useCallback, useMemo } from "react";

/* External Libraries */
import moment from "moment/moment";

type ContestImageSize =
  | "large"
  | "normal"
  | "medium"
  | "small"
  | "tiny"
  | "feed"
  | "s-feed"
  | "contest"
  | "original";

type ContestImageUrlParam = {
  readonly contestId: string;
  readonly size?: ContestImageSize;
  readonly sequenceId?: string;
  readonly cacheBuster?: string;
};

/************************** WRAP LEGACY URL FUNCTIONS *************************/

const absExtURL = (url: string) => {
  if (url.indexOf("https://") === 0) {
    return "https://" + url.replace("https://", "");
  }
  return "http://" + url.replace("http://", "");
};

const getZendeskLocale = (locale?: string) => {
  // TODO [lliepert]: handle properly
  // const zendeskLocale = locale || window.locale_info.locale || "en";
  const zendeskLocale = locale || "en";
  if (zendeskLocale === "en") {
    return "en-us";
  }
  if (zendeskLocale === "zh") {
    return "zh-cn";
  }
  return zendeskLocale;
};

export const zendeskURL = (articleId: string, locale?: string): string => {
  const zendeskLocale = getZendeskLocale(locale);
  const zendeskUrl =
    "https://merchantfaq.wish.com/hc/" +
    zendeskLocale +
    "/articles/" +
    articleId;
  return absExtURL(zendeskUrl);
};

export const zendeskCategoryURL = (
  categoryId: string,
  locale?: string,
): string => {
  const zendeskLocale = getZendeskLocale(locale);
  const zendeskCategoryUrl =
    "https://merchantfaq.wish.com/hc/" +
    zendeskLocale +
    "/categories/" +
    categoryId;
  return absExtURL(zendeskCategoryUrl);
};

export const zendeskSectionURL = (
  sectionId: string,
  locale?: string,
): string => {
  const zendeskLocale = getZendeskLocale(locale);
  const zendeskUrl =
    "https://merchantfaq.wish.com/hc/" +
    zendeskLocale +
    "/sections/" +
    sectionId;
  return absExtURL(zendeskUrl);
};

export const contestImageURL = ({
  contestId,
  size,
  sequenceId,
  cacheBuster,
}: ContestImageUrlParam): string => {
  const lemmingsUrl = ""; // TODO [lliepert]: handle this
  if (!size) {
    size = "medium";
  }
  let sequenceIdString = "";
  if (sequenceId) {
    sequenceIdString = sequenceId + "-";
  }
  let cacheBusterString = "";
  if (cacheBuster) {
    cacheBusterString = "?cache_buster=" + cacheBuster;
  }
  return `${lemmingsUrl}/${contestId}-${sequenceIdString}${size}.jpg${cacheBusterString}`;
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

export const externalURL = (path: string): string =>
  path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `http://${path}`;

/***************************** QUERY PARAMS HOOKS *****************************/

const StringOptions: QueryParamsOptions<string> = {
  default: "",
  mapper: {
    deserialize: (value) => value,
    serialize: (str: string | null | undefined): string => str || "",
  },
};

const IntOptions: QueryParamsOptions<number> = {
  default: "",
  mapper: {
    deserialize: (str) => parseInt(str || "") || 0,
    serialize: (value) => (value != null ? value.toString() : ""),
  },
};

const BoolOptions: QueryParamsOptions<boolean> = {
  default: null,
  mapper: {
    deserialize: (str) => (str == null ? str : str === "true"),
    serialize: (value) => (value ? value.toString() : ""),
  },
};

const StringArrayOptions: QueryParamsOptions<ReadonlyArray<string>> = {
  default: "",
  mapper: {
    deserialize: (str) => (str || "").split(",").filter((_) => _.length > 0),
    serialize: (list) => list.join(","),
  },
};

const SetOptions: QueryParamsOptions<ReadonlySet<unknown>> = {
  default: "",
  mapper: {
    deserialize: (str) =>
      new Set((str || "").split(",").filter((_) => _.length > 0)),
    serialize: (set) => Array.from(set).join(","),
  },
};

const IntArrayOptions: QueryParamsOptions<ReadonlyArray<number>> = {
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

const useDateOptions = (args: {
  format: string;
}): QueryParamsOptions<Date> => ({
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

type QueryParamsOptions<T> = {
  default?: "" | null;
  mapper?: {
    deserialize?: (rawValue: string) => T | null | undefined;
    serialize?: (domain: T) => string;
  };
};

const useQueryParam = <T>(
  key: string,
  options: QueryParamsOptions<T> = { default: null },
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
  }, [key, options.mapper, queryParams]);

  const setter = useCallback(
    (value: T | null | undefined) => {
      const { queryParams: previousQueryParams } = navigationStore;
      const queryParams = { ...previousQueryParams };

      let valRaw: string | null | undefined = null;
      if (value != null && options.mapper && options.mapper.serialize) {
        valRaw = options.mapper.serialize(value);
      }

      if (valRaw == null || options?.default == valRaw) {
        delete queryParams[key];
      } else {
        queryParams[key] = valRaw;
      }

      if (currentPath != null) {
        if (valRaw != null || Object.keys(queryParams).length) {
          navigationStore.pushPath(currentPath, { queryParams });
        } else {
          navigationStore.pushPath(currentPath);
        }
      }
    },
    [key, options, currentPath, navigationStore],
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

export const useStringEnumArrayQueryParam = <T>(
  key: string,
  defaultValue?: ReadonlyArray<T>,
): [ReadonlyArray<T>, (value: ReadonlyArray<T>) => void] => {
  const [v, setter] = useQueryParam<ReadonlyArray<string>>(
    key,
    StringArrayOptions,
  );
  return [
    (v || defaultValue || []) as ReadonlyArray<T>,
    setter as unknown as (value: ReadonlyArray<T>) => void,
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
  return [value as unknown as ReadonlySet<T>, setter];
};

export const useDateQueryParam = (
  key: string,
  args: { format: string; defaultValue?: Date | null | undefined } = {
    format: "YYYY-MM-DD",
  },
): [Date | null | undefined, (value: Date | null | undefined) => void] => {
  const [v, setter] = useQueryParam(key, useDateOptions(args));
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

export const usePathParams = (
  pattern: string,
): {
  [key: string]: string;
} => {
  const navigationStore = useNavigationStore();
  return navigationStore.pathParams(pattern);
};

/* MISCELLANEOUS */

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
