import gql from "graphql-tag";
import {
  GenWechatQrMutation,
  AuthenticationMutationsGenWechatQrArgs,
} from "@schema/types";

export const GEN_WECHAT_QR_MUTATION = gql`
  mutation Authentication_GenWechatQrMutation($input: GenWechatQrInput!) {
    authentication {
      genWechatQr(input: $input) {
        ticket
      }
    }
  }
`;

export type GenWechatQrResponseType = {
  readonly authentication: {
    readonly genWechatQr?: Pick<GenWechatQrMutation, "ticket">;
  };
};

export type GenWechatQrRequestType = AuthenticationMutationsGenWechatQrArgs;
