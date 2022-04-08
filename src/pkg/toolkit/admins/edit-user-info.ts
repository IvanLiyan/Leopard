import gql from "graphql-tag";
import {
  IdentityServiceSchemaUserArgs,
  UserSchema,
  UpdateUserInfoMutation,
  IdentityMutationsUpdateUserInfoArgs,
  BdMerchantCountryCodeType,
} from "@schema/types";

type PickedManager = Pick<UserSchema, "id">;

type PickedPossibleManager = Pick<UserSchema, "id" | "name" | "email">;

type PickedUser = Pick<
  UserSchema,
  | "id"
  | "username"
  | "firstName"
  | "lastName"
  | "email"
  | "bdMerchantCountry"
  | "isEnabled"
  | "roles"
> & {
  readonly manager: PickedManager;
  readonly possibleManagers: ReadonlyArray<PickedPossibleManager>;
};

export type EditUserInfoInitialData = {
  readonly currentUser: {
    canManageRoles: boolean;
    canManagePermissions: boolean;
  };
  readonly identity: {
    readonly user: PickedUser & {
      readonly canBeAssignedMerchantCountry: boolean;
      readonly canBeAssignedManager: boolean;
    };
    readonly platformBdMerchantCountries: ReadonlyArray<BdMerchantCountryCodeType>;
  };
};

export const GET_USER_INFO_QUERY = gql`
  query EditUserInfo_GetUserInfoQuery($id: String!) {
    identity {
      user(id: $id) {
        firstName
        lastName
        email
        bdMerchantCountry
        manager {
          id
          name
          email
        }
        isEnabled
        hasPermission(permissions: [CAN_BE_ASSIGNED_MERCHANT_COUNTRY])
      }
    }
  }
`;

export type GetUserInfoResponseType = {
  readonly identity: {
    readonly user: PickedUser;
  };
};

export type GetUserInfoRequestType = IdentityServiceSchemaUserArgs;

export const UPDATE_USER_INFO_MUTATION = gql`
  mutation EditUserInfo_UpdateUserInfoMutation($input: UpdateUserInfoInput!) {
    identity {
      updateUserInfo(input: $input) {
        ok
        error
      }
    }
  }
`;

export type UpdateUserInfoResponseType = {
  readonly identity: {
    readonly updateUserInfo: UpdateUserInfoMutation;
  };
};

export type UpdateUserInfoRequestType = IdentityMutationsUpdateUserInfoArgs;
