/* React, Mobx and Aphrodite */
import { useState, useCallback } from "react";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ApolloClient from "apollo-client";

import {
  UiStateSchema,
  UserUiState as UserUIState,
  UiStateMutationsUpdateArgs,
} from "@schema/types";

type RequestType = {
  readonly state: UserUIState;
};

type ResponseType = {
  readonly currentUser: {
    readonly uiState: Pick<
      UiStateSchema,
      "string" | "int" | "bool" | "stringArray" | "intArray"
    >;
  };
};

const GET_UI_STATE_BOOL_VALUE = gql`
  query GetUIStateBool($state: UserUIState!) {
    currentUser {
      uiState {
        bool(state: $state)
      }
    }
  }
`;

const UPDATE_UI_STATE = gql`
  mutation UpdateUIStateBool($input: UpdateUIStateInput!) {
    currentUser {
      uiState {
        update(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

const GET_UI_STATE_STRING_VALUE = gql`
  query GetUIStateString($state: UserUIState!) {
    currentUser {
      uiState {
        string(state: $state)
      }
    }
  }
`;

const GET_UI_STATE_INT_VALUE = gql`
  query GetUIStateInt($state: UserUIState!) {
    currentUser {
      uiState {
        int(state: $state)
      }
    }
  }
`;

const GET_UI_STATE_STRING_ARRAY_VALUE = gql`
  query GetUIStateStringArray($state: UserUIState!) {
    currentUser {
      uiState {
        stringArray(state: $state)
      }
    }
  }
`;

const GET_UI_STATE_INT_ARRAY_VALUE = gql`
  query GetUIStateIntArray($state: UserUIState!) {
    currentUser {
      uiState {
        intArray(state: $state)
      }
    }
  }
`;

type SetterOptions = {
  readonly refresh?: boolean;
  readonly optimistic?: boolean;
};

const DEFAULT_OPTIMISTIC = true;
const DEFAULT_SHOULD_REFRESH = true;
const DefaultSetterOptions: SetterOptions = {
  refresh: DEFAULT_SHOULD_REFRESH,
  optimistic: DEFAULT_OPTIMISTIC,
};

type ReturnValue<T> = {
  readonly value: T | undefined | null;
  readonly isLoading: boolean;
  readonly update: (value: T, options?: SetterOptions) => Promise<void>;
  readonly refresh: () => void;
};

export const useUIStateString = (state: UserUIState): ReturnValue<string> => {
  const { data, loading: isLoading, refetch: refresh } = useQuery<
    ResponseType,
    RequestType
  >(GET_UI_STATE_STRING_VALUE, {
    variables: { state },
  });
  const [optimisticValue, setOptimisticValue] = useState<string | undefined>(
    undefined
  );
  const [updateState, { loading: isSaving }] = useMutation<
    void,
    UiStateMutationsUpdateArgs
  >(UPDATE_UI_STATE);
  const value = data?.currentUser?.uiState.string;
  const update = useCallback(
    async (value: string, options: SetterOptions = DefaultSetterOptions) => {
      const {
        refresh: shouldRefresh = DEFAULT_SHOULD_REFRESH,
        optimistic = DEFAULT_OPTIMISTIC,
      } = options;
      await updateState({
        variables: { input: { state, stringValue: value } },
      });
      if (shouldRefresh) {
        if (optimistic) {
          setOptimisticValue(value);
        }
        await refresh();
        setOptimisticValue(undefined);
      }
    },
    [updateState, state, refresh]
  );

  return {
    value: isSaving && optimisticValue !== undefined ? optimisticValue : value,
    isLoading,
    update,
    refresh,
  };
};

export const useUIStateBool = (
  state: UserUIState,
  options?: {
    readonly client?: ApolloClient<any>;
  }
): ReturnValue<boolean> => {
  const { data, loading: isLoading, refetch: refresh } = useQuery<
    ResponseType,
    RequestType
  >(GET_UI_STATE_BOOL_VALUE, {
    variables: { state },
    client: options?.client || undefined,
  });
  const [optimisticValue, setOptimisticValue] = useState<boolean | undefined>(
    undefined
  );
  const [updateState, { loading: isSaving }] = useMutation<
    void,
    UiStateMutationsUpdateArgs
  >(UPDATE_UI_STATE, {
    client: options?.client || undefined,
  });
  const value = data?.currentUser?.uiState.bool;
  const update = useCallback(
    async (value: boolean, options: SetterOptions = DefaultSetterOptions) => {
      const {
        refresh: shouldRefresh = DEFAULT_SHOULD_REFRESH,
        optimistic = DEFAULT_OPTIMISTIC,
      } = options;
      await updateState({ variables: { input: { state, boolValue: value } } });
      if (shouldRefresh) {
        if (optimistic) {
          setOptimisticValue(value);
        }
        await refresh();
        setOptimisticValue(undefined);
      }
    },
    [updateState, state, refresh]
  );

  return {
    value: isSaving && optimisticValue !== undefined ? optimisticValue : value,
    isLoading,
    update,
    refresh,
  };
};

export const useUIStateInt = (state: UserUIState): ReturnValue<number> => {
  const { data, loading: isLoading, refetch: refresh } = useQuery<
    ResponseType,
    RequestType
  >(GET_UI_STATE_INT_VALUE, {
    variables: { state },
  });
  const [optimisticValue, setOptimisticValue] = useState<number | undefined>(
    undefined
  );
  const [updateState, { loading: isSaving }] = useMutation<
    void,
    UiStateMutationsUpdateArgs
  >(UPDATE_UI_STATE);
  const value = data?.currentUser?.uiState.int;
  const update = useCallback(
    async (value: number, options: SetterOptions = DefaultSetterOptions) => {
      const {
        refresh: shouldRefresh = DEFAULT_SHOULD_REFRESH,
        optimistic = DEFAULT_OPTIMISTIC,
      } = options;
      await updateState({ variables: { input: { state, intValue: value } } });
      if (shouldRefresh) {
        if (optimistic) {
          setOptimisticValue(value);
        }
        await refresh();
        setOptimisticValue(undefined);
      }
    },
    [updateState, state, refresh]
  );

  return {
    value: isSaving && optimisticValue !== undefined ? optimisticValue : value,
    isLoading,
    update,
    refresh,
  };
};

export const useUIStateStringArray = (
  state: UserUIState
): ReturnValue<ReadonlyArray<string>> => {
  const { data, loading: isLoading, refetch: refresh } = useQuery<
    ResponseType,
    RequestType
  >(GET_UI_STATE_STRING_ARRAY_VALUE, {
    variables: { state },
  });
  const [optimisticValue, setOptimisticValue] = useState<
    ReadonlyArray<string> | undefined
  >(undefined);
  const [updateState, { loading: isSaving }] = useMutation<
    void,
    UiStateMutationsUpdateArgs
  >(UPDATE_UI_STATE);
  const value = data?.currentUser?.uiState.stringArray;
  const update = useCallback(
    async (
      value: ReadonlyArray<string>,
      options: SetterOptions = DefaultSetterOptions
    ) => {
      const {
        refresh: shouldRefresh = DEFAULT_SHOULD_REFRESH,
        optimistic = DEFAULT_OPTIMISTIC,
      } = options;
      await updateState({
        variables: { input: { state, stringArrayValue: value } },
      });
      if (shouldRefresh) {
        if (optimistic) {
          setOptimisticValue(value);
        }
        await refresh();
        setOptimisticValue(undefined);
      }
    },
    [updateState, state, refresh]
  );

  return {
    value: isSaving && optimisticValue !== undefined ? optimisticValue : value,
    isLoading,
    update,
    refresh,
  };
};

export const useUIStateIntArray = (
  state: UserUIState
): ReturnValue<ReadonlyArray<number>> => {
  const { data, loading: isLoading, refetch: refresh } = useQuery<
    ResponseType,
    RequestType
  >(GET_UI_STATE_INT_ARRAY_VALUE, {
    variables: { state },
  });
  const [optimisticValue, setOptimisticValue] = useState<
    ReadonlyArray<number> | undefined
  >(undefined);
  const [updateState, { loading: isSaving }] = useMutation<
    void,
    UiStateMutationsUpdateArgs
  >(UPDATE_UI_STATE);
  const value = data?.currentUser?.uiState.intArray;
  const update = useCallback(
    async (
      value: ReadonlyArray<number>,
      options: SetterOptions = DefaultSetterOptions
    ) => {
      const {
        refresh: shouldRefresh = DEFAULT_SHOULD_REFRESH,
        optimistic = DEFAULT_OPTIMISTIC,
      } = options;
      await updateState({
        variables: { input: { state, intArrayValue: value } },
      });
      if (shouldRefresh) {
        if (optimistic) {
          setOptimisticValue(value);
        }
        await refresh();
        setOptimisticValue(undefined);
      }
    },
    [updateState, state, refresh]
  );

  return {
    value: isSaving && optimisticValue !== undefined ? optimisticValue : value,
    isLoading,
    update,
    refresh,
  };
};

export const useUpdateUIStateString = (
  state: UserUIState
): ((value: string) => void) => {
  const [updateState] = useMutation<void, UiStateMutationsUpdateArgs>(
    UPDATE_UI_STATE
  );

  return useCallback(
    async (value: string) => {
      await updateState({
        variables: { input: { stringValue: value, state } },
      });
    },
    [updateState, state]
  );
};

export const useUpdateUIStateBool = (
  state: UserUIState
): ((value: boolean) => void) => {
  const [updateState] = useMutation<void, UiStateMutationsUpdateArgs>(
    UPDATE_UI_STATE
  );

  return useCallback(
    async (value: boolean) => {
      await updateState({ variables: { input: { boolValue: value, state } } });
    },
    [updateState, state]
  );
};

export const useUpdateUIStateInt = (
  state: UserUIState
): ((value: number) => void) => {
  const [updateState] = useMutation<void, UiStateMutationsUpdateArgs>(
    UPDATE_UI_STATE
  );

  return useCallback(
    async (value: number) => {
      await updateState({ variables: { input: { intValue: value, state } } });
    },
    [updateState, state]
  );
};

export const useUpdateUIStateStringArray = (
  state: UserUIState
): ((value: ReadonlyArray<string>) => void) => {
  const [updateState] = useMutation<void, UiStateMutationsUpdateArgs>(
    UPDATE_UI_STATE
  );

  return useCallback(
    async (value: ReadonlyArray<string>) => {
      await updateState({
        variables: { input: { stringArrayValue: value, state } },
      });
    },
    [updateState, state]
  );
};

export const useUpdateUIStateIntArray = (
  state: UserUIState
): ((value: ReadonlyArray<number>) => void) => {
  const [updateState] = useMutation<void, UiStateMutationsUpdateArgs>(
    UPDATE_UI_STATE
  );

  return useCallback(
    async (value: ReadonlyArray<number>) => {
      await updateState({
        variables: { input: { intArrayValue: value, state } },
      });
    },
    [updateState, state]
  );
};
