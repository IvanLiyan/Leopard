import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { Validator } from "@toolkit/validators";

export const pageName = {
  contactInfo: i`Contact information`,
  accountType: i`Account type`,
  proofOfIdentity: i`Proof of identity`,
  review: i`Review`,
};

export type Page = keyof typeof pageName;

export type Validity = {
  readonly isValid: boolean;
  readonly errorMsg: string | null | undefined;
};

const asyncDebounce = <F extends (...args: any[]) => Promise<any>>(
  func: F,
  wait?: number
) => {
  // eslint-disable-next-line local-rules/no-large-method-params
  const debounced = debounce(async (resolve, reject, args: Parameters<F>) => {
    try {
      resolve(await func(...args));
    } catch (err) {
      reject(err);
    }
  }, wait);
  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      debounced(resolve, reject, args);
    }) as ReturnType<F>;
};

const validateField = async <T>(
  validator: Validator<T>[] | undefined,
  value: T
) => {
  for (const v of validator || []) {
    const errorMsg = await v.validate(value);
    if (errorMsg) {
      return { isValid: false, errorMsg };
    }
  }
  return { isValid: true, errorMsg: null };
};

const validateFieldDebounced = asyncDebounce(validateField, 1000);

export const shouldShowError = (validity?: Validity) => {
  return validity ? validity.errorMsg && !validity.isValid : false;
};

export const defaultValidities = <T extends Object>(formData: T) =>
  Object.keys(formData).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: { isValid: false, errorMsg: null },
    }),
    {} as {
      [P in keyof T]?: Validity;
    }
  );

export const useValidities = <T extends Object>(
  formData: T,
  validators: Record<keyof T, Validator<any>[]>
) => {
  const defaultValidities = useMemo(
    () =>
      Object.keys(formData).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: { isValid: false, errorMsg: null },
        }),
        {} as {
          [P in keyof T]?: Validity;
        }
      ),
    // default value no need for recalculation
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [validities, setValidities] = useState(defaultValidities);

  useEffect(() => {
    validateForm({ isInitialValidation: true });
    // run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateValidity = (field: keyof T, validity: Validity) => {
    const { isValid, errorMsg } = validity;
    setValidities((v) => ({
      ...v,
      [field]: { isValid, errorMsg },
    }));
  };

  // eslint-disable-next-line local-rules/no-large-method-params
  const validateAndUpdate = async <P extends keyof T>(
    field: P,
    value: T[P],
    options?: {
      debounce?: boolean;
    }
  ) => {
    const { debounce = false } = options || {};
    if (debounce) {
      updateValidity(field, {
        isValid: false,
        errorMsg: validities[field]?.errorMsg,
      });
    }
    const validatorFn = debounce ? validateFieldDebounced : validateField;
    const validity = await validatorFn(validators[field], value);
    updateValidity(field, validity);
  };

  const validateForm = async (config?: {
    isInitialValidation?: boolean;
    fields?: Array<keyof T>;
  }) => {
    const { isInitialValidation = false, fields } = config || {};
    const formDataEntries = Object.entries(formData).filter(([_key]) => {
      const key = _key as keyof T;
      return fields ? fields.includes(key) : true;
    });
    const result = await Promise.all(
      formDataEntries.map(async ([_key, value]) => {
        const key = _key as keyof T;
        const { isValid, errorMsg } = await validateField(
          validators[key],
          value
        );
        updateValidity(key, {
          isValid,
          // silence required error during initial validation
          errorMsg: !value && isInitialValidation ? "" : errorMsg,
        });
        return isValid;
      })
    );
    return result.every((isValid) => isValid);
  };

  return { validities, validateAndUpdate, validateForm };
};

export const useAccordionGroup = <G extends string, T extends string>({
  group,
  validities,
  validateForm,
  defaultOpen,
}: {
  group: Record<G, Array<T>>;
  validities: { [P in T]?: Validity };
  validateForm: (config?: {
    isInitialValidation?: boolean;
    fields?: Array<T>;
  }) => Promise<boolean>;
  defaultOpen?: G;
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<Record<G, boolean>>(
    () => {
      const entries = Object.fromEntries(
        Object.keys(group).map((key) => [key, false])
      ) as Record<G, boolean>;
      if (defaultOpen) {
        entries[defaultOpen] = true;
      }
      return entries;
    }
  );

  const { primary, negative } = useTheme();

  const getPromptColor = (groupKey: G) => {
    const error = group[groupKey].some((field) =>
      shouldShowError(validities[field])
    );
    return error ? negative : primary;
  };

  const getAccordionOpen = (groupKey: G) => {
    return isAccordionOpen[groupKey];
  };

  const setAccordionOpen = (groupKey: G) => async (isOpen: boolean) => {
    setIsAccordionOpen({ ...isAccordionOpen, [groupKey]: isOpen });
  };

  const onNextClick = (groupKey: G) => async () => {
    const isValid = await validateForm({ fields: group[groupKey] });
    if (isValid) {
      const newAccordionOpen = { ...isAccordionOpen };
      newAccordionOpen[groupKey] = false;
      const keys = Object.keys(group) as Array<G>;
      const currentIdx = keys.findIndex((value) => value === groupKey);
      if (currentIdx < keys.length - 1) {
        newAccordionOpen[keys[currentIdx + 1]] = true;
      }
      setIsAccordionOpen(newAccordionOpen);
    }
  };

  const validateAllGroups = async () => {
    const invalidGroups = [];
    for (const key of Object.keys(group)) {
      const groupKey = key as G;
      const isValid = await validateForm({ fields: group[groupKey] });
      if (!isValid) {
        invalidGroups.push(groupKey);
      }
    }
    setIsAccordionOpen(
      invalidGroups.reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: true,
        }),
        isAccordionOpen
      )
    );
    return invalidGroups.length === 0;
  };

  return {
    getAccordionOpen,
    setAccordionOpen,
    getPromptColor,
    validateAllGroups,
    onNextClick,
  };
};
