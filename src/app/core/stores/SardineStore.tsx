import { useState, useEffect } from "react";
import { gql } from "@gql";

import { SardineConstants } from "@schema";
import { useApolloStore } from "./ApolloStore";

export const GET_SARDINE_CONSTANTS = gql(`
  query SardineStore_GetSardineConstants {
    platformConstants {
      sardineConstants {
        sardineHost
        sardineClientId
        sardineSessionKey
      }
    }
  }
`);

export const sardineScriptId = "sardine-script";

export type GetSardineConstantsResponseType = {
  readonly platformConstants: {
    readonly sardineConstants?: SardineConstants;
  };
};

type SardineStore = {
  readonly getSardineConstants: () => Promise<SardineConstants | undefined>;
};

export const useSardineStore = (): SardineStore => {
  const { client } = useApolloStore();
  const hasCookies = () => {
    // Check if there are any cookies
    return document.cookie && document.cookie !== "";
  };

  const getSardineConstants = async () => {
    if (!hasCookies()) {
      return undefined;
    }
    try {
      const { data } = await client.query<
        GetSardineConstantsResponseType,
        SardineConstants
      >({
        query: GET_SARDINE_CONSTANTS,
        fetchPolicy: "no-cache",
      });
      return data.platformConstants.sardineConstants;
    } catch (error) {
      return undefined;
    }
  };

  return {
    getSardineConstants,
  };
};

export const useSardineConstants = (): {
  readonly sardineHost: string | undefined | null;
  readonly sardineClientId: string | undefined | null;
  readonly sardineSessionKey: string | undefined | null;
} => {
  const [sardineHost, setSardineHost] = useState<string | null>();
  const [sardineClientId, setSardineClientId] = useState<string | null>();
  const [sardineSessionKey, setSardineSessionKey] = useState<string | null>();
  const sardineStore = useSardineStore();

  useEffect(() => {
    void (async () => {
      const sardineConstants = await sardineStore.getSardineConstants();
      const sardineHost = sardineConstants?.sardineHost;
      const sardineClientId = sardineConstants?.sardineClientId;
      const sardineSessionKey = sardineConstants?.sardineSessionKey;
      setSardineHost(sardineHost);
      setSardineClientId(sardineClientId);
      setSardineSessionKey(sardineSessionKey);
    })();
  }, [sardineStore]);

  return {
    sardineHost,
    sardineClientId,
    sardineSessionKey,
  };
};
