/* Legacy */
/* eslint-disable no-underscore-dangle */
import {
  zendeskURL as _zendeskURL,
  zendeskCategoryURL as _zendeskCategoryURL,
  zendeskSectionURL as _zendeskSectionURL,
  contestImageURL as _contestImageURL,
  wishURL as _wishURL,
} from "@legacy/core/url";
import { computed, decorate } from "mobx";
import NavigationStore, {
  useNavigationStore,
} from "@stores/NavigationStore";

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
    deserialize: (str: string | null | undefined): ReadonlySet<any> =>
      new Set((str || "").split(",").filter((_) => _.length > 0)),
    serialize: (set: ReadonlySet<any>) => Array.from(set).join(","),
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
    // if you find this please fix the any types (legacy)
    serialize: (list: any) => list.join(","),
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

export const zendeskURL = (articleId: string): string => _zendeskURL(articleId);

export const zendeskCategoryURL = (
  articleId: string,
  locale?: string
): string => {
  return _zendeskCategoryURL(articleId, locale);
};

export const zendeskSectionURL = (
  articleId: string,
  locale?: string
): string => {
  return _zendeskSectionURL(articleId, locale);
};

export const contestImageURL = ({
  contestId,
  size,
  sequenceId,
  cacheBuster,
}: ContestImageUrlParam): string =>
  _contestImageURL(contestId, size, sequenceId, cacheBuster);

export const wishURL = (path: string): string => _wishURL(path);

/* eslint-disable @typescript-eslint/naming-convention */
const queryParamDecorator = (
  queryFieldName: string,
  options: {
    default?: any;
    mapper?: {
      deserialize?: (rawValue: string) => any;
      serialize?: (domain: any) => string;
    };
  } = { default: null }
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
          navigationStore.pushPath(currentPath, _queryParams);
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
      // if you find this please fix the any types (legacy)
      set(val: any) {
        return (this[computedFieldName] = val);
      },
    };

    return descriptor;
  };
};

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
    args: { format: string } = { format: "YYYY-MM-DD" }
  ) {
    return queryParamDecorator(queryFieldName, dateOptions(args));
  },
} as any;
// `as any` here is to halt typescript from throwing
// errors about `Unable to resolve signature of property decorator when called as an expression.ts(1240)`
// It can't track decorators with call signatures. This is legacu code for class components
// so it should not be used going forward.

/* Need a name that won't clash with other fields on the component
 * or class. Chose `__filterFieldNames`.
 */
/* eslint-disable @typescript-eslint/naming-convention, local-rules/camel-case */
export class DEPRECATED_QueryParamState {
  static __filterFieldNames = [];

  ["constructor"]: typeof DEPRECATED_QueryParamState;

  @computed
  get hasActiveFilters(): boolean {
    const { queryParams } = NavigationStore.instance();
    const { __filterFieldNames } = this.constructor;
    const activeFilters = Object.keys(queryParams);
    return __filterFieldNames.some((filterName) =>
      activeFilters.includes(filterName)
    );
  }
}

export const usePathParams = (
  pattern: string
): {
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
  addFinalPeriod?: boolean
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
  addFinalPeriod?: boolean
) => {
  if (!zendeskNumber) {
    return "";
  }
  return learnMoreLink(zendeskURL(zendeskNumber), addFinalPeriod);
};

export const learnMoreZendeskCategory = (
  zendeskNumber: string,
  addFinalPeriod?: boolean
) => {
  if (!zendeskNumber) {
    return "";
  }
  return learnMoreLink(zendeskCategoryURL(zendeskNumber), addFinalPeriod);
};

const useQueryParam = <T>(
  key: string,
  options: {
    default?: any;
    mapper?: {
      deserialize?: (rawValue: string) => T | null | undefined;
      serialize?: (domain: T) => string;
    };
  } = { default: null }
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
    (value: T | null | undefined) => {
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
          navigationStore.pushPath(currentPath, newQueryParams);
        } else {
          navigationStore.pushPath(currentPath);
        }
      }
    },
    // Eslint bug: it thinks `T` is dependency, but its a type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, options, navigationStore, currentPath]
  );

  return [value, setter];
};

export const useIntQueryParam = (
  key: string
): [number | null | undefined, (value: number | null | undefined) => void] => {
  return useQueryParam(key, IntOptions);
};

export const useIntArrayQueryParam = (
  key: string
): [
  ReadonlyArray<number> | null | undefined,
  (value: ReadonlyArray<number> | null | undefined) => void
] => {
  return useQueryParam<ReadonlyArray<number>>(key, IntArrayOptions);
};

export const useStringQueryParam = (
  key: string,
  defaultValue = ""
): [string, (value: string | null | undefined) => void] => {
  const [v, setter] = useQueryParam(key, StringOptions);
  return [v || defaultValue, setter];
};

export const useStringEnumQueryParam = <T>(
  key: string,
  defaultValue?: null | undefined | T
): [T, (value: null | undefined | T) => void] => {
  const [v, setter] = useQueryParam(key, StringOptions);
  return [
    (v || defaultValue) as T,
    setter as (value: null | undefined | T) => void,
  ];
};

export const useStringEnumArrayQueryParam = <T>(
  key: string,
  defaultValue?: ReadonlyArray<T>
): [ReadonlyArray<T>, (value: ReadonlyArray<T>) => void] => {
  const [v, setter] = useQueryParam<ReadonlyArray<string>>(
    key,
    StringArrayOptions
  );
  return [
    (v || defaultValue || []) as ReadonlyArray<T>,
    setter as any as (value: ReadonlyArray<T>) => void,
  ];
};

export const useIntEnumQueryParam = <T>(
  key: string,
  defaultValue: null | undefined | T
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
  defaultValue?: null | undefined | ReadonlyArray<string>
): [ReadonlyArray<string>, (value: ReadonlyArray<string>) => void] => {
  const [v, setter] = useQueryParam<ReadonlyArray<string>>(
    key,
    StringArrayOptions
  );

  const value = useMemo(
    () => (v != null && v.length > 0 ? v : defaultValue || []),
    [v, defaultValue]
  );
  return [
    value as ReadonlyArray<string>,
    setter as (value: null | undefined | ReadonlyArray<string>) => void,
  ];
};

export const useStringSetQueryParam = <T>(
  key: string,
  defaultValue: ReadonlySet<T> = new Set()
): [ReadonlySet<T>, (value: ReadonlySet<T>) => void] => {
  const [v, setter] = useQueryParam(key, SetOptions);
  const value = useMemo(() => v || defaultValue, [v, defaultValue]);
  return [value as any as ReadonlySet<T>, setter];
};

export const useDateQueryParam = (
  key: string,
  args: { format: string; defaultValue?: Date | null | undefined } = {
    format: "YYYY-MM-DD",
  }
): [Date | null | undefined, (value: Date | null | undefined) => void] => {
  const [v, setter] = useQueryParam(key, dateOptions(args));
  const value = useMemo(() => v || args.defaultValue, [v, args.defaultValue]);
  return [value, setter];
};

export const useBoolQueryParam = (
  key: string,
  defaultValue = false
): [boolean, (value: boolean | null | undefined) => void] => {
  const [val, setter] = useQueryParam(key, BoolOptions);
  return [val != null ? val : defaultValue, setter];
};
