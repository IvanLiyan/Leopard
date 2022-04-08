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
/* eslint-disable filenames/match-exported */

/* External Libraries */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import gql from "graphql-tag";

/* Relative Imports */
import ApolloStore from "@stores/ApolloStore";
import UserStore from "@stores/UserStore";
import NavigationStore from "@stores/NavigationStore";
import EnvironmentStore from "@stores/EnvironmentStore";

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

type UseExperimentOptions = {
  readonly skip?: boolean;
};

const defaultUseExperimentOptions: Required<UseExperimentOptions> = {
  skip: false,
};

type UseDeciderKeyOptions = {
  readonly skip?: boolean;
};

const defaultUseDeciderKeyOptions: Required<UseDeciderKeyOptions> = {
  skip: false,
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

export default class ExperimentStore {
  experiments: {
    [key: string]: string;
  };

  constructor() {
    this.experiments = { ...(window as any).pageParams.experiments };
  }

  bucketForUser(experimentName: string): string | null | undefined {
    const cookieOverride = Cookies.get(`expoverride_${experimentName}`);
    if (cookieOverride != null) {
      return cookieOverride;
    }

    return this.experiments[experimentName];
  }

  overrideLocally(experimentName: string, bucket: string) {
    const navigationStore = NavigationStore.instance();
    const { isProd } = EnvironmentStore.instance();
    const { isSu } = UserStore.instance();
    if (isProd && !isSu) {
      return;
    }
    Cookies.set(`expoverride_${experimentName}`, bucket);
    navigationStore.reload({ fullReload: true });
  }

  clearLocalOverride(experimentName: string) {
    const navigationStore = NavigationStore.instance();
    const { isSu } = UserStore.instance();

    if (!isSu) {
      return;
    }
    Cookies.remove(`expoverride_${experimentName}`);
    navigationStore.reload({ fullReload: true });
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
    let { experimentStore } = window as any;
    if (experimentStore == null) {
      experimentStore = new ExperimentStore();
      (window as any).experimentStore = experimentStore;
    }
    return experimentStore;
  }
}

export const useExperimentStore = (): ExperimentStore => {
  return ExperimentStore.instance();
};

export const useExperiment = (
  name: string,
  options: UseExperimentOptions = defaultUseExperimentOptions
): {
  readonly bucket: string | undefined | null;
  readonly isLoading: boolean;
} => {
  const { skip = defaultUseExperimentOptions.skip } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [bucket, setBucket] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (!skip) {
        const experimentStore = new ExperimentStore();
        const bucket = await experimentStore.getBucketForMerchant(name);
        setBucket(bucket);
      }
      setIsLoading(false);
    })();
  }, [name, skip]);

  return { bucket, isLoading };
};

export const useDeciderKey = (
  name: string,
  options: UseDeciderKeyOptions = defaultUseDeciderKeyOptions
): {
  readonly decision: boolean | undefined | null;
  readonly isLoading: boolean;
} => {
  const { skip = defaultUseExperimentOptions.skip } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<boolean | undefined>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (!skip) {
        const experimentStore = new ExperimentStore();
        const decision = await experimentStore.getDeciderKeyDecision(name);
        setDecision(decision);
      }
      setIsLoading(false);
    })();
  }, [name, skip]);

  return { decision, isLoading };
};
