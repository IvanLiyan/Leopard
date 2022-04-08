import gql from "graphql-tag";
import {
  UserSchema,
  IdentityServiceSchemaUsersArgs,
  Country,
  RoleSchema,
  ByUserIdMutation,
  LoginAsMutationsUserArgs,
} from "@schema/types";

type PickedManager = Pick<UserSchema, "name">;

export type PickedUser = Pick<
  UserSchema,
  | "username"
  | "name"
  | "email"
  | "id"
  | "bdMerchantCountry"
  | "roles"
  | "serviceTypes"
  | "isEnabled"
  | "isSalesRep"
> & {
  readonly manager: PickedManager;
  readonly canBeAssignedToLogicalQueue: boolean;
};

export type UserInTable = Omit<PickedUser, "roles" | "serviceTypes"> & {
  readonly managerName: string | null | undefined;
  readonly roles: string | null | undefined;
  readonly serviceTypes: string | null | undefined;
};

export type PickedCountry = Pick<Country, "code">;

type PickedRole = Pick<RoleSchema, "id" | "name">;

export type VisibleRoles = ReadonlyArray<PickedRole>;

export type AdminUsersInitialData = {
  readonly identity: {
    readonly visibleRoles: VisibleRoles;
  };
  readonly currentUser: {
    readonly canManageRoles: boolean;
    readonly canManagePermissions: boolean;
    readonly canManageUserQueues: boolean;
    readonly canLoginAsUsers: boolean;
  };
};

export const GET_INTERNAL_USERS_QUERY = gql`
  query AdminUsersTable_GetInternalUsersQuery(
    $offset: Int!
    $limit: Int!
    $query: String
    $sortField: UsersSortFieldType!
    $sortOrder: SortOrderType!
    $includeDisabledUsers: Boolean!
    $roles: [RoleType!]!
  ) {
    identity {
      users(
        offset: $offset
        limit: $limit
        query: $query
        sortField: $sortField
        sortOrder: $sortOrder
        includeDisabledUsers: $includeDisabledUsers
        roles: $roles
      ) {
        username
        name
        email
        id
        bdMerchantCountry
        roles {
          name
        }
        manager {
          name
        }
        serviceTypes
        isEnabled
        isSalesRep
        canBeAssignedToLogicalQueue: hasPermission(
          permissions: [HANDLE_CS_TICKETS]
        )
      }
      usersCount(
        query: $query
        includeDisabledUsers: $includeDisabledUsers
        roles: $roles
      )
    }
  }
`;

export type GetInternalUsersResponseType = {
  readonly identity: {
    readonly users: ReadonlyArray<PickedUser>;
    readonly usersCount: number;
  };
};

export type GetInternalUsersRequestType = IdentityServiceSchemaUsersArgs;

export const LOGIN_AS_USER_MUTATION = gql`
  mutation AdminUsersTable_LoginAsUserMutation($input: ByUserIdInput!) {
    authentication {
      loginAs {
        user(input: $input) {
          ok
          error
        }
      }
    }
  }
`;

export type LoginAsUserResponseType = {
  readonly authentication: {
    readonly loginAs: {
      readonly user: ByUserIdMutation;
    };
  };
};

export type LoginAsUserRequestType = LoginAsMutationsUserArgs;

export const MAX_USERS_PER_PAGE = 100;

// Disable local-rules/unwrapped-i18n as the following sort field options are used by internal users only
/* eslint-disable local-rules/unwrapped-i18n */
export const SORT_FIELD_OPTIONS = [
  {
    text: "Username",
    value: "USERNAME",
  },
  {
    text: "User ID",
    value: "ID",
  },
  {
    text: "Email",
    value: "EMAIL",
  },
];
