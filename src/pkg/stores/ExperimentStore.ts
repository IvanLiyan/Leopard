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
import Cookies from "js-cookie";
import gql from "graphql-tag";

/* Relative Imports */
import ApolloStore, { defaultApolloStoreArgs } from "./ApolloStore";
import UserStore, { defaultUserStoreArgs } from "./UserStore";
import NavigationStore from "./NavigationStore";
import EnvironmentStore, {
  defaultEnvironmentStoreArgs,
} from "./EnvironmentStore";

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

type ExperimentStoreArgs = {
  readonly apolloStore: ApolloStore;
  readonly userStore: UserStore;
  readonly navigationStore: NavigationStore;
  readonly environmentStore: EnvironmentStore;
  readonly experiments: {
    [key: string]: string;
  };
};
export default class ExperimentStore {
  apolloStore: ApolloStore;
  userStore: UserStore;
  navigationStore: NavigationStore;
  environmentStore: EnvironmentStore;
  experiments: {
    [key: string]: string;
  };

  constructor({
    apolloStore,
    userStore,
    navigationStore,
    environmentStore,
    experiments,
  }: ExperimentStoreArgs) {
    this.apolloStore = apolloStore;
    this.userStore = userStore;
    this.navigationStore = navigationStore;
    this.environmentStore = environmentStore;
    this.experiments = experiments;
  }

  bucketForUser(experimentName: string): string | null | undefined {
    const cookieOverride = Cookies.get(`expoverride_${experimentName}`);
    if (cookieOverride != null) {
      return cookieOverride;
    }

    return this.experiments[experimentName];
  }

  overrideLocally(experimentName: string, bucket: string): void {
    const navigationStore = NavigationStore.instance();
    const { isProd } = EnvironmentStore.instance();
    const { isSu } = UserStore.instance();
    if (isProd && !isSu) {
      return;
    }
    Cookies.set(`expoverride_${experimentName}`, bucket);
    void navigationStore.reload({ fullReload: true });
  }

  clearLocalOverride(experimentName: string): void {
    const navigationStore = NavigationStore.instance();
    const { isSu } = UserStore.instance();

    if (!isSu) {
      return;
    }
    Cookies.remove(`expoverride_${experimentName}`);
    void navigationStore.reload({ fullReload: true });
  }

  async getBucketForMerchant(name: string): Promise<string> {
    const { client } = ApolloStore.instance();
    const { data } = await client.query<
      GetExpBucketForMerchantResponseType,
      ExpSchemaBucketArgs
    >({
      query: GET_EXP_BUCKET_FOR_MERCHANT,
      variables: { name },
      fetchPolicy: "no-cache",
    });
    return data.currentMerchant.exp.bucket;
  }

  async getDeciderKeyDecision(name: string): Promise<boolean> {
    const { client } = ApolloStore.instance();
    const { data } = await client.query<
      GetDeciderKeyResponseType,
      DeciderKeySchemaDecideForNameArgs
    >({
      query: GET_DECIDER_KEY,
      variables: { name },
    });
    return data.platformConstants.deciderKey.decideForName;
  }

  static instance(): ExperimentStore {
    throw "ExperimentStore Not Implemented";
  }
}

export const useExperimentStore = (): ExperimentStore => {
  return useContext(ExperimentStoreContext);
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

export const EXPERIMENT_STORE_INITIAL_QUERY = gql`
  query ExperimentStore_InitialQuery {
    currentMerchant {
      experiments
    }
  }
`;

// TODO [lliepert]: bad typing, redo once query is real
export type ExperimentStoreInitialQueryResponse = Pick<
  ExperimentStoreArgs,
  "experiments"
>;

export const defaultExperimentStoreArgs = {
  apolloStore: new ApolloStore(defaultApolloStoreArgs),
  userStore: new UserStore(defaultUserStoreArgs),
  navigationStore: new NavigationStore(),
  environmentStore: new EnvironmentStore(defaultEnvironmentStoreArgs),
  experiments: {},
};

export const ExperimentStoreContext = createContext(
  new ExperimentStore(defaultExperimentStoreArgs),
);
