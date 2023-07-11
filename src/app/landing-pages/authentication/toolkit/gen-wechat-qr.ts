import { gql } from "@gql";
import {
  GenWechatQrMutation,
  AuthenticationMutationsGenWechatQrArgs,
} from "@schema";

export const GEN_WECHAT_QR_MUTATION = gql(`
  mutation Authentication_GenWechatQrMutation($input: GenWechatQrInput!) {
    authentication {
      genWechatQr(input: $input) {
        ticket
      }
    }
  }
`);

export type GenWechatQrResponseType = {
  readonly authentication?: {
    readonly genWechatQr?: Pick<GenWechatQrMutation, "ticket"> | null;
  } | null;
};

export type GenWechatQrRequestType = AuthenticationMutationsGenWechatQrArgs;
