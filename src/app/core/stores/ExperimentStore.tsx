//
//  stores/ExperimentStore.tsx
//  Project-Lego
//
//  Contains functions related to our experiments frameworks.
//
//  Created by Sola Ogunsakin on 2/13/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//

/* External Libraries */
import { useState, useEffect } from "react";
import { gql } from "@gql";

/* Relative Imports */
import { useApolloStore } from "./ApolloStore";

import {
  ExpSchema,
  ExpSchemaBucketArgs,
  DeciderKeySchema,
  DeciderKeySchemaDecideForNameArgs,
} from "@schema";

const GET_EXP_BUCKET_FOR_MERCHANT = gql(`
  query ExperimentStore_GetBucketForExperiment($name: String!) {
    currentMerchant {
      exp {
        bucket(name: $name)
      }
    }
  }
`);

type GetExpBucketForMerchantResponseType = {
  readonly currentMerchant: {
    readonly exp: Pick<ExpSchema, "bucket">;
  };
};

const GET_DECIDER_KEY = gql(`
  query ExperimentStore_GetDeciderKey($name: String!) {
    platformConstants {
      deciderKey {
        decideForName(name: $name)
      }
    }
  }
`);

type GetDeciderKeyResponseType = {
  readonly platformConstants: {
    readonly deciderKey: Pick<DeciderKeySchema, "decideForName">;
  };
};

type ExperimentStore = {
  readonly getBucketForMerchant: (name: string) => Promise<string>;
  readonly getDeciderKeyDecision: (name: string) => Promise<boolean>;
};

export const useExperimentStore = (): ExperimentStore => {
  const { client } = useApolloStore();

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
    // Exclude experimentStore in dependency to avoid infinite loop, as updating states "isLoading" and "bucket" will
    // cause a component re-render, and a new experimentStore to be instantiated, hence this useEffect hook will run infinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return { bucket, isLoading };
};

export const useDeciderKey = (
  name: string,
  options?: { readonly skip?: boolean | null | undefined },
): {
  readonly decision: boolean | undefined | null;
  readonly isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<boolean | undefined>();
  const experimentStore = useExperimentStore();

  useEffect(() => {
    if (options?.skip) {
      return;
    }
    void (async () => {
      setIsLoading(true);
      const decision = await experimentStore.getDeciderKeyDecision(name);
      setDecision(decision);
      setIsLoading(false);
    })();
    // Exclude experimentStore in dependency to avoid infinite loop, as updating states "isLoading" and "bucket" will
    // cause a component re-render, and a new experimentStore to be instantiated, hence this useEffect hook will run infinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, options?.skip]);

  return {
    decision,
    isLoading: (isLoading || decision == null) && !options?.skip,
  };
};
