//
//  toolkit/logger.tsx
//  Project-Lego
//
//  Created by Kevin Cai on 2/24/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { useMemo, useState } from "react";
import { gql } from "@gql";

import UserStore from "@core/stores/UserStore";
import ApolloStore from "@core/stores/ApolloStore";

import { LoggableTable, LogToTreasureDataInput } from "@schema";

const LOG_MUTATION = gql(`
  mutation Logger_WriteLog($input: LogToTreasureDataInput!) {
    analytics {
      log(input: $input) {
        ok
      }
    }
  }
`);

export type LoggableValue =
  | (string | null | undefined)
  | (number | null | undefined)
  | (boolean | null | undefined);

export type LogData = {
  [key: string]: LoggableValue;
};

export type Logger = {
  info: (data: LogData) => void;
};

type MutationVariables = {
  readonly input: LogToTreasureDataInput;
};

export const log = async (
  table: LoggableTable,
  data: LogData,
): Promise<void> => {
  const { isSu } = UserStore.instance();
  if (isSu) {
    return;
  }
  const { client } = ApolloStore.instance();
  await client.mutate<void, MutationVariables>({
    mutation: LOG_MUTATION,
    variables: { input: { table, data: JSON.stringify(data) } },
  });
};

export const useLogger = (
  table: LoggableTable,
): {
  info(data: LogData): void;
} => {
  const [sessionId] = useState(`${new Date().getTime()}_${Math.random()}`);
  return useMemo(
    () => ({
      info(data: LogData) {
        void log(table, { ...data, session_id: sessionId });
      },
    }),
    [table, sessionId],
  );
};
