import React, { createContext, useContext } from "react";
import { CountryCode } from "@toolkit/schema";
import { BaseProps } from "@toolkit/types";

export type StorefrontState = {
  readonly mid: string;
  readonly storeName: string;
  readonly merchantCreationDate: string;
  readonly location: {
    readonly cc: CountryCode;
    readonly name: string;
  };
  readonly numReviews: number;
  readonly averageRating: number;
  readonly productFeeds: {
    readonly id: string;
    readonly name: string;
  }[];
};

const defaultStorefrontState: StorefrontState = {
  mid: "",
  storeName: "",
  merchantCreationDate: "",
  location: {
    cc: "US",
    name: "",
  },
  numReviews: 0,
  averageRating: 0,
  productFeeds: [],
};

const StorefrontStateContext = createContext(defaultStorefrontState);

type StorefrontStateProviderProps = Pick<BaseProps, "children"> & {
  readonly state: StorefrontState;
};

export const StorefrontStateProvider: React.FC<StorefrontStateProviderProps> =
  ({ state, children }: StorefrontStateProviderProps) => {
    return (
      <StorefrontStateContext.Provider value={state}>
        {children}
      </StorefrontStateContext.Provider>
    );
  };

export const useStorefrontState = (): StorefrontState => {
  return useContext(StorefrontStateContext);
};
