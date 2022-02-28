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
import gql from "graphql-tag";

/* Relative Imports */
import { useApolloStore } from "@stores/ApolloStore";

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
