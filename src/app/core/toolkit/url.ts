import { useCallback, useMemo } from "react";
import { computed, decorate } from "mobx";
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

export const StringOptions = {
  default: "",
  mapper: {
    deserialize: (value: string | null | undefined) => value,
    serialize: (str: string | null | undefined) => str || "",
  },
};

export const IntOptions = {
  default: "",
  mapper: {
    deserialize: (str: string | null | undefined) => parseInt(str || "") || 0,
    serialize: (value: number | null | undefined) =>
      value != null ? value.toString() : "",
  },
};

export const BoolOptions = {
  default: null,
  mapper: {
    deserialize: (str: string | null | undefined) =>
      str == null ? str : str === "true",
    serialize: (value: boolean | null | undefined) =>
      value ? value.toString() : "",
  },
};

export const StringArrayOptions = {
  default: "",
  mapper: {
    deserialize: (str: string | null | undefined) =>
      (str || "").split(",").filter((_) => _.length > 0),
    serialize: (list: ReadonlyArray<string>) => list.join(","),
  },
};

export const SetOptions = {
  default: "",
  mapper: {
    deserialize: (str: string | null | undefined): ReadonlySet<unknown> =>
      new Set((str || "").split(",").filter((_) => _.length > 0)),
    serialize: (set: ReadonlySet<unknown>) => Array.from(set).join(","),
  },
};

export const IntArrayOptions = {
  default: "",
  mapper: {
    deserialize: (str: string | null | undefined) =>
      (str || "")
        .split(",")
        .map((_) => parseInt(_))
        .filter((_) => !isNaN(_)),
    serialize: (list: ReadonlyArray<unknown>) => list.join(","),
  },
};

export const dateOptions = (args: { format: string }) => ({
  default: "",
  mapper: {
    deserialize: (str: string | null | undefined) => {
      if (!str) {
        return null;
      }
      return moment(str, args.format).toDate();
    },
    serialize: (date: Date | null | undefined) => {
      if (!date) {
        return "";
      }
      return moment(date).format(args.format);
    },
  },
});

// legacy code, any's need to be fixed
/* eslint-disable @typescript-eslint/no-explicit-any */
const queryParamDecorator = (
  queryFieldName: string,
  options: {
    default?: any;
    mapper?: {
      deserialize?: (rawValue: string) => any;
      serialize?: (domain: any) => string;
    };
  } = { default: null },
) => {
  const navigationStore = NavigationStore.instance();
  // eslint-disable-next-line local-rules/no-large-method-params
  return function (target: any, name: string, descriptor: any) {
    const computedFieldName = `compute_${name}`;

    if (!target.constructor.__filterFieldNames) {
      target.constructor.__filterFieldNames = [];
    }

    target.constructor.__filterFieldNames.push(queryFieldName);

    Object.defineProperty(target, computedFieldName, {
      enumerable: true,
      configurable: true,

      get() {
        const { queryParams } = navigationStore;
        let retValue = queryParams[queryFieldName];
        if (options.mapper && options.mapper.deserialize) {
          retValue = options.mapper.deserialize(retValue);
        }
        return retValue;
      },

      set(val) {
        const { queryParams, currentPath } = navigationStore;
        const _queryParams = { ...queryParams };

        if (options.mapper && options.mapper.serialize) {
          val = options.mapper.serialize(val);
        }

        if (!val || !options || options.default == val) {
          delete _queryParams[queryFieldName];
        } else {
          _queryParams[queryFieldName] = val;
        }

        if (currentPath != null) {
          void navigationStore.pushPath(currentPath, _queryParams);
        }
      },
    });

    // make `computedFieldName` @computed.
    decorate(target, {
      [computedFieldName]: computed,
    });

    descriptor = { ...descriptor };

    delete descriptor.writable;
    delete descriptor.initializer;

    descriptor = {
      ...descriptor,
      get() {
        return this[computedFieldName];
      },
      set(val: any) {
        return (this[computedFieldName] = val);
      },
    };

    return descriptor;
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const params_DEPRECATED = {
  int(queryFieldName: string) {
    return queryParamDecorator(queryFieldName, IntOptions);
  },
  string(queryFieldName: string) {
    return queryParamDecorator(queryFieldName, StringOptions);
  },
  bool(queryFieldName: string) {
    return queryParamDecorator(queryFieldName, BoolOptions);
  },
  array(queryFieldName: string) {
    return queryParamDecorator(queryFieldName, StringArrayOptions);
  },
  intArray(queryFieldName: string) {
    return queryParamDecorator(queryFieldName, IntArrayOptions);
  },
  date(
    queryFieldName: string,
    args: { format: string } = { format: "YYYY-MM-DD" },
  ) {
    return queryParamDecorator(queryFieldName, dateOptions(args));
  },
};

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

export const mdLink = (text: string, url: string) => {
  return `[${text}](${url})`;
};

export const mdList = (text: string) => {
  return `- ${text}`;
};

export const learnMoreLink = (
  learnMoreURL?: string,
  addFinalPeriod?: boolean,
) => {
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
) => {
  if (!zendeskNumber) {
    return "";
  }
  return learnMoreLink(zendeskURL(zendeskNumber), addFinalPeriod);
};

export const learnMoreZendeskCategory = (
  zendeskNumber: string,
  addFinalPeriod?: boolean,
) => {
  if (!zendeskNumber) {
    return "";
  }
  return learnMoreLink(zendeskCategoryURL(zendeskNumber), addFinalPeriod);
};

const useQueryParam = <T>(
  key: string,
  options: {
    // legacy code, any's need to be fixed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any;
    mapper?: {
      deserialize?: (rawValue: string) => T | null | undefined;
      serialize?: (domain: T) => string;
    };
  } = { default: null },
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
    setter as (value: ReadonlyArray<T>) => void,
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
