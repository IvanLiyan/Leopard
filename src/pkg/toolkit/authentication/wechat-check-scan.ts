import gql from "graphql-tag";
import {
  WechatCheckScanMutation,
  AuthenticationMutationsCheckWechatScanArgs,
} from "@schema/types";

export const WECHAT_CHECK_SCAN_MUTATION = gql`
  mutation Authentication_WechatCheckScanMutation(
    $input: WechatCheckScanInput!
  ) {
    authentication {
      checkWechatScan(input: $input) {
        expireIn
        scanned
        ok
        error
      }
    }
  }
`;

export type WechatCheckScanResponseType = {
  readonly authentication: {
    readonly checkWechatScan?: Pick<
      WechatCheckScanMutation,
      "expireIn" | "scanned" | "ok" | "error"
    >;
  };
};

export type WechatCheckScanRequestType =
  AuthenticationMutationsCheckWechatScanArgs;
