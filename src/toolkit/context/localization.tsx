import { createContext, useContext } from "react";
import { BaseProps } from "@toolkit/types";

const LocalizationContext = createContext("en");

type LocalizationProviderProps = Pick<BaseProps, "children"> & {
  readonly locale: string;
};

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  locale,
  children,
}: LocalizationProviderProps) => {
  return (
    <LocalizationContext.Provider value={locale}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): {
  i18n: (s: string) => string;
  ni18n: (n: number, s1: string, s2: string) => string;
  ci18n: (s1: string, s2: string) => string;
  cni18n: (s1: string, n: number, s2: string, s3: string) => string;
} => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useContext(LocalizationContext);

  return {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    i18n: (s: string) => s,
    ni18n: (n: number, singular: string, plural: string) => singular,
    ci18n: (context: string, s: string) => s,
    cni18n: (context: string, n: number, singular: string, plural: string) =>
      singular,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  };
};
