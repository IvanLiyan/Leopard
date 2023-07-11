import { gql } from "@gql";
import {
  CreateUin,
  CreateUinInput,
  DeleteUin,
  DeleteUinInput,
  UpdateUin,
  UpdateUinInput,
} from "@schema";

export const ADD_EPR_MUTATION = gql(`
  mutation AddEprMutation($input: CreateUinInput!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          createUin(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`);

export type AddEprMutationResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly createUin: Pick<CreateUin, "ok" | "message">;
      };
    };
  };
};

export type AddEprMutationVariables = { readonly input: CreateUinInput };

export const EDIT_EPR_MUTATION = gql(`
  mutation EditEprMutation($input: UpdateUinInput!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          updateUin(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`);

export type EditEprMutationResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly updateUin: Pick<UpdateUin, "ok" | "message">;
      };
    };
  };
};

export type EditEprMutationVariables = { readonly input: UpdateUinInput };

export const DELETE_EPR_MUTATION = gql(`
  mutation DeleteEprMutation($input: DeleteUinInput!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          deleteUin(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`);

export type DeleteEprMutationResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly deleteUin: Pick<DeleteUin, "ok" | "message">;
      };
    };
  };
};

export type DeleteEprMutationVariables = { readonly input: DeleteUinInput };
