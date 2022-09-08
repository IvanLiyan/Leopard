import {
  FactoryMerchantConversionInput,
  FactoryToMerchantConversionMutation,
  IdentityServiceSchemaUsersArgs,
  UserSchema,
} from "@schema/types";

export type PickedUser = Pick<
  UserSchema,
  "username" | "name" | "email" | "id" | "roles"
>;

export type AccountManager = Pick<UserSchema, "id" | "username" | "email">;

export type Factory = {
  readonly id: string;
  readonly name: string;
  readonly username: string;
  readonly accountManager: AccountManager;
  readonly factoryManager: PickedUser;
};

export type GetFactoryListRequestType = IdentityServiceSchemaUsersArgs;

export type GetFactoryListResponseType = {
  readonly identity: {
    readonly users: ReadonlyArray<Factory>;
    readonly usersCount: number;
  };
};

export type ConvertFactoryToMerchantRequestType = {
  readonly input: FactoryMerchantConversionInput;
};

export type ConvertFactoryToMerchantResponseType = {
  readonly identity: {
    readonly factoryMutations: {
      readonly convertFactoryToMerchant: Pick<
        FactoryToMerchantConversionMutation,
        "ok" | "error"
      >;
    };
  };
};
