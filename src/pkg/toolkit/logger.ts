//
//  toolkit/logger.tsx
//  Project-Lego
//
//  Created by Kevin Cai on 2/24/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { useMemo, useState } from "react";
import gql from "graphql-tag";

import UserStore from "@stores/UserStore";
import ApolloStore from "@stores/ApolloStore";

import { LoggableTable, LogToTreasureDataInput } from "@schema/types";

const LOG_MUTATION = gql`
  mutation Logger_WriteLog($input: LogToTreasureDataInput!) {
    analytics {
      log(input: $input) {
        ok
      }
    }
  }
`;

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

export const log = async (table: LoggableTable, data: LogData) => {
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

export const useLogger = (table: LoggableTable) => {
  const [sessionId] = useState(`${new Date().getTime()}_${Math.random()}`);
  return useMemo(
    () => ({
      info(data: LogData) {
        log(table, { ...data, session_id: sessionId });
      },
    }),
    [table, sessionId],
  );
};
