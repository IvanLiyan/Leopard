import { gql } from "@apollo/client/core";
import {
  PermissionStatusType,
  IdentityServiceSchemaUserArgs,
  PermissionSchema,
  UpdatePermissionInput,
} from "@schema/types";

export type PickedPermission = Pick<
  PermissionSchema,
  "id" | "name" | "description"
>;

export type PermissionInTable = PickedPermission & {
  readonly status: PermissionStatusType;
};

export type EditPermissionsInitialData = {
  readonly identity: {
    readonly user: {
      readonly id: string;
      readonly name: string;
      readonly assignablePermissions: ReadonlyArray<PickedPermission>;
      readonly defaultPermissions: ReadonlyArray<PickedPermission>;
    };
  };
};

export const GET_ASSIGNED_PERMISSIONS_QUERY = gql`
  query EditPermissionsTable_GetAssignedPermissionsQuery($id: String!) {
    identity {
      user(id: $id) {
        assignedPermissions: permissions(status: ASSIGNED) {
          id
          name
          description
        }
      }
    }
  }
`;

export type GetAssignedPermissionsResponseType = {
  readonly identity: {
    readonly user: {
      readonly assignedPermissions: ReadonlyArray<PickedPermission>;
    };
  };
};

export type GetAssignedPermissionsRequestType = IdentityServiceSchemaUserArgs;

export const UPDATE_PERMISSION_MUTATION = gql`
  mutation EditPermissionsTable_UpdatePermissionMutation(
    $input: UpdatePermissionInput!
  ) {
    identity {
      updatePermission(input: $input) {
        ok
        error
      }
    }
  }
`;

export type UpdatePermissionResponseType = {
  readonly identity: {
    readonly updatePermission: {
      readonly ok: boolean;
      readonly error: string | null;
    };
  };
};

export type UpdatePermissionRequestType = {
  readonly input: UpdatePermissionInput;
};
