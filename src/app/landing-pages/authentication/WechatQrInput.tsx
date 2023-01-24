import React, { useState, useMemo, useCallback, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation } from "@apollo/client";

/* Lego Toolkit */
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { css } from "@core/toolkit/styling";

/* Lego Components */
import { LoadingIndicator, Layout } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { GenWechatQrInput, WechatCheckScanInput } from "@schema";

/* Toolkit */
import {
  GEN_WECHAT_QR_MUTATION,
  GenWechatQrResponseType,
  GenWechatQrRequestType,
} from "@landing-pages/authentication/toolkit/gen-wechat-qr";
import {
  WECHAT_CHECK_SCAN_MUTATION,
  WechatCheckScanResponseType,
  WechatCheckScanRequestType,
} from "@landing-pages/authentication/toolkit/wechat-check-scan";

/* Components */
import NextImage from "@core/components/Image";

type WechatQrInputProps = BaseProps & {
  readonly onVerified: (qrTicket: string) => void;
};

const WechatQrInput: React.FC<WechatQrInputProps> = (
  props: WechatQrInputProps,
) => {
  const { onVerified } = props;
  const styles = useStylesheet();
  const [qrTicket, setQrTicket] = useState<string | undefined>();
  const [genWechatQr] = useMutation<
    GenWechatQrResponseType,
    GenWechatQrRequestType
  >(GEN_WECHAT_QR_MUTATION);
  const [checkWechatScan] = useMutation<
    WechatCheckScanResponseType,
    WechatCheckScanRequestType
  >(WECHAT_CHECK_SCAN_MUTATION);
  const refreshQrCode = useCallback(async () => {
    const scene = window.location.pathname;
    setQrTicket(undefined);
    const input: GenWechatQrInput = {
      scene,
    };
    const { data } = await genWechatQr({ variables: { input } });
    if (data != null && data.authentication?.genWechatQr != null) {
      const { ticket } = data.authentication.genWechatQr;
      if (ticket) {
        setQrTicket(ticket);
      }
    }
  }, [genWechatQr]);
  useMountEffect(() => void refreshQrCode());

  const checkQrCode = useCallback(async () => {
    if (qrTicket) {
      const input: WechatCheckScanInput = {
        qrTicket,
      };
      const { data } = await checkWechatScan({ variables: { input } });
      if (data != null && data.authentication?.checkWechatScan != null) {
        const { expireIn, scanned, ok } = data.authentication.checkWechatScan;
        if (ok) {
          if (expireIn != null && expireIn <= 0) {
            await refreshQrCode();
          } else if (scanned) {
            onVerified(qrTicket);
          }
        }
      }
    }
  }, [qrTicket, refreshQrCode, onVerified, checkWechatScan]);

  useEffect(() => {
    const interval = setInterval(() => void checkQrCode(), 1000);
    return () => clearInterval(interval);
  }, [checkQrCode]);

  const qrUrl = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(
    qrTicket || "",
  )}`;
  return (
    <Layout.FlexColumn style={styles.qr} alignItems="center">
      {qrTicket ? (
        <NextImage
          src={qrUrl}
          className={css(styles.qrImage)}
          alt={i`qr code`}
        />
      ) : (
        <LoadingIndicator style={styles.qrImage} />
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        qr: {
          height: 250,
          maxWidth: 250,
          alignSelf: "center",
        },
        qrImage: {
          height: "100%",
          width: "100%",
        },
      }),
    [],
  );
};

export default observer(WechatQrInput);
