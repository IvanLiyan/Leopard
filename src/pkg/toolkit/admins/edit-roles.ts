import gql from "graphql-tag";
import {
  RoleSchema,
  UserSchema,
  IdentityServiceSchemaUserArgs,
  UpdateRoleInput,
  UpdateRoleMutation,
} from "@schema/types";

export type PickedRole = Pick<RoleSchema, "id" | "name" | "description">;

export type RoleInTable = PickedRole & {
  readonly assigned: boolean;
};

export type EditRolesInitialData = {
  readonly identity: {
    readonly user: Pick<UserSchema, "id" | "name">;
    readonly platformRoles: ReadonlyArray<PickedRole>;
  };
};

export const GET_ROLES_QUERY = gql`
  query EditRolesTable_GetRolesQuery($id: String!) {
    identity {
      user(id: $id) {
        roles {
          id
          name
          description
        }
      }
    }
  }
`;

export type GetRolesResponseType = {
  readonly identity: {
    readonly user: {
      readonly roles: ReadonlyArray<PickedRole>;
    };
  };
};

export type GetRolesRequestType = Pick<IdentityServiceSchemaUserArgs, "id">;

export const UPDATE_ROLE_MUTATION = gql`
  mutation EditRolesTable_UpdateRoleMutation($input: UpdateRoleInput!) {
    identity {
      updateRole(input: $input) {
        ok
        error
      }
    }
  }
`;

export type UpdateRoleResponseType = {
  readonly identity: {
    readonly updateRole: UpdateRoleMutation;
  };
};

export type UpdateRoleRequestType = {
  readonly input: UpdateRoleInput;
};
