import gql from "graphql-tag";
import {
  UserSchema,
  LogicalQueueSchema,
  IdentityServiceSchemaUserArgs,
  UpdateUserQueuesMutation,
  IdentityMutationsUpdateQueueArgs,
} from "@schema/types";

export type PickedLogicalQueue = Pick<
  LogicalQueueSchema,
  "id" | "name" | "state"
>;

type PickedUser = Pick<UserSchema, "id" | "name">;

export type QueueInTable = PickedLogicalQueue & {
  readonly assigned: boolean;
};

export type EditUserQueuesInitialData = {
  readonly identity: {
    readonly user: PickedUser & {
      readonly assignableQueues: ReadonlyArray<PickedLogicalQueue>;
    };
  };
};

export const GET_ASSIGNED_QUEUES_QUERY = gql`
  query EditUserQueuesTable_GetAssignedQueuesQuery($id: String!) {
    identity {
      user(id: $id) {
        assignedQueues: queues(assigned: true) {
          id
          name
          state
        }
      }
    }
  }
`;

export type GetAssignedQueuesResponseType = {
  readonly identity: {
    readonly user: {
      readonly assignedQueues: ReadonlyArray<PickedLogicalQueue>;
    };
  };
};

export type GetAssignedQueuesRequestType = IdentityServiceSchemaUserArgs;

export const UPDATE_QUEUES_MUTATION = gql`
  mutation EditUserQueuesTable_UpdateQueueMutation(
    $input: UpdateUserQueuesInput!
  ) {
    identity {
      updateQueue(input: $input) {
        ok
        error
      }
    }
  }
`;

export type UpdateQueuesResponseType = {
  readonly identity: {
    readonly updateQueue: UpdateUserQueuesMutation;
  };
};

export type UpdateQueuesRequestType = IdentityMutationsUpdateQueueArgs;
