//
//  stores/ExperimentStore.tsx
//  Project-Lego
//
//  Contains functions related to our experiments frameworks.
//
//  Created by Sola Ogunsakin on 2/13/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable local-rules/no-pageParams */

/* External Libraries */
import { useState, useEffect, createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import gql from "graphql-tag";

/* Relative Imports */
import { useApolloStore } from "./ApolloStore";
import { useUserStore } from "./UserStore";
import { useNavigationStore } from "./NavigationStore";
import { useEnvironmentStore } from "./EnvironmentStore";

import {
  ExpSchema,
  ExpSchemaBucketArgs,
  DeciderKeySchema,
  DeciderKeySchemaDecideForNameArgs,
} from "@schema/types";

const GET_EXP_BUCKET_FOR_MERCHANT = gql`
  query ExperimentStore_GetBucketForExperiment($name: String!) {
    currentMerchant {
      exp {
        bucket(name: $name)
      }
    }
  }
`;

type GetExpBucketForMerchantResponseType = {
  readonly currentMerchant: {
    readonly exp: Pick<ExpSchema, "bucket">;
  };
};

const GET_DECIDER_KEY = gql`
  query ExperimentStore_GetDeciderKey($name: String!) {
    platformConstants {
      deciderKey {
        decideForName(name: $name)
      }
    }
  }
`;

type GetDeciderKeyResponseType = {
  readonly platformConstants: {
    readonly deciderKey: Pick<DeciderKeySchema, "decideForName">;
  };
};

const EXPERIMENT_STORE_INITIAL_QUERY = gql`
  query ExperimentStore_InitialQuery {
    currentMerchant {
      experiments
    }
  }
`;

type ExperimentStoreInitialQueryResponse = {
  readonly currentMerchant?: {
    readonly experiments?: Readonly<Record<string, string>>;
  };
};

type ExperimentState = {
  experiments: Readonly<Record<string, string>>;
};

const ExperimentStateContext = createContext<ExperimentState>({
  experiments: {},
});

export const ExperimentProvider: React.FC = ({ children }) => {
  // TODO [lliepert]: handle GQL errors
  // const { data } = useQuery<ExperimentStoreInitialQueryResponse>(
  //   EXPERIMENT_STORE_INITIAL_QUERY,
  // );
  // const experiments = data?.currentMerchant?.experiments || {};

  return (
    <ExperimentStateContext.Provider value={{ experiments: {} }}>
      {children}
    </ExperimentStateContext.Provider>
  );
};

// TODO [lliepert]: is this still used? can we deprecate?
type ExperimentStore = {
  readonly bucketForUser: (experimentName: string) => string | null | undefined;
  readonly overrideLocally: (experimentName: string, bucket: string) => void;
  readonly clearLocalOverride: (experimentName: string) => void;
  readonly getBucketForMerchant: (name: string) => Promise<string>;
  readonly getDeciderKeyDecision: (name: string) => Promise<boolean>;
};

export const useExperimentStore = (): ExperimentStore => {
  const { experiments } = useContext(ExperimentStateContext);
  const { isProd } = useEnvironmentStore();
  const { isSu } = useUserStore();
  const { client } = useApolloStore();
  const navigationStore = useNavigationStore();

  const bucketForUser = (experimentName: string): string | null | undefined => {
    const cookieOverride = Cookies.get(`expoverride_${experimentName}`);
    if (cookieOverride != null) {
      return cookieOverride;
    }

    return experiments == null ? null : experiments[experimentName];
  };

  const overrideLocally = (experimentName: string, bucket: string): void => {
    if (isProd && !isSu) {
      return;
    }
    Cookies.set(`expoverride_${experimentName}`, bucket);
    void navigationStore.reload({ fullReload: true });
  };

  const clearLocalOverride = (experimentName: string): void => {
    if (!isSu) {
      return;
    }
    Cookies.remove(`expoverride_${experimentName}`);
    void navigationStore.reload({ fullReload: true });
  };

  const getBucketForMerchant = async (name: string): Promise<string> => {
    const { data } = await client.query<
      GetExpBucketForMerchantResponseType,
      ExpSchemaBucketArgs
    >({
      query: GET_EXP_BUCKET_FOR_MERCHANT,
      variables: { name },
      fetchPolicy: "no-cache",
    });
    return data.currentMerchant.exp.bucket;
  };

  const getDeciderKeyDecision = async (name: string): Promise<boolean> => {
    const { data } = await client.query<
      GetDeciderKeyResponseType,
      DeciderKeySchemaDecideForNameArgs
    >({
      query: GET_DECIDER_KEY,
      variables: { name },
    });
    return data.platformConstants.deciderKey.decideForName;
  };

  return {
    bucketForUser,
    overrideLocally,
    clearLocalOverride,
    getBucketForMerchant,
    getDeciderKeyDecision,
  };
};

export const useExperiment = (
  name: string,
): {
  readonly bucket: string | undefined | null;
  readonly isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState(true);
  const [bucket, setBucket] = useState<string | undefined>();
  const experimentStore = useExperimentStore();

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const bucket = await experimentStore.getBucketForMerchant(name);
      setBucket(bucket);
      setIsLoading(false);
    })();
  }, [name, experimentStore]);

  return { bucket, isLoading };
};

export const useDeciderKey = (
  name: string,
): {
  readonly decision: boolean | undefined | null;
  readonly isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<boolean | undefined>();
  const experimentStore = useExperimentStore();

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const decision = await experimentStore.getDeciderKeyDecision(name);
      setDecision(decision);
      setIsLoading(false);
    })();
  }, [name, experimentStore]);

  return { decision, isLoading };
};
