import { UserSchema } from "@schema/types";

type PickedUser = Pick<UserSchema, "isAdmin">;
export type InitialData = {
  readonly currentUser: PickedUser;
};
