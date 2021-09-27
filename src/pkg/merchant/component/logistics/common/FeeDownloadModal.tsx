import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { exportFBWFees, exportFBSFees } from "@merchant/api/fbw";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import { ExportFBWFeesParams } from "@merchant/api/fbw";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { Markdown } from "@ContextLogic/lego";

export type FeeDownloadModalProps = {
  readonly exportApiParams: ExportFBWFeesParams;
  readonly productType: "fbs" | "fbw";
};

const FeeDownloadModalContent = (props: FeeDownloadModalProps) => {
  const styles = useStylesheet();
  const { exportApiParams, productType } = props;
  const apiMethod = productType === "fbs" ? exportFBSFees : exportFBWFees;
  const [response] = useRequest(apiMethod(exportApiParams));
  const responseData = response?.data;
  const { userStore } = AppStore.instance();
  const userEmail = userStore.loggedInMerchantUser.email;
  if (responseData == null) {
    return (
      <div className={css(styles.modal)}>
        <LoadingIndicator
          type="spinner"
          size={100}
          style={{ marginLeft: 150 }}
        />
      </div>
    );
  }
  if (responseData.download && responseData.download.trim().length > 0) {
    const downloadMarkdown = `[${i`here`}](${responseData.download})`;
    return (
      <div className={css(styles.modal)}>
        <Markdown
          className={css(styles.text)}
          openLinksInNewTab
          text={
            i`Your FBW fee download request is completed. Please download your FBW ` +
            i`fees by clicking ` +
            i`${downloadMarkdown}.`
          }
        />
      </div>
    );
  }
  return (
    <div className={css(styles.modal)}>
      <span className={css(styles.text)}>
        Your fee download request is being processed. We will send you the link
        to download to your email address {userEmail} when it is done.
      </span>
    </div>
  );
};

export default class FeeDownloadModal extends Modal {
  props: FeeDownloadModalProps;

  constructor(props: FeeDownloadModalProps) {
    super(() => null);
    this.props = props;
    const { productType } = this.props;
    const header =
      productType === "fbs"
        ? i`Download Your FBS Fees`
        : i`Download Your FBW Fees`;
    this.setHeader({
      title: header,
    });
    const { dimenStore } = AppStore.instance();
    const targetPercentage = 500 / dimenStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return <FeeDownloadModalContent {...this.props} />;
  }
}

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        modal: {
          padding: "20px 50px",
        },
        text: {
          textAlign: "center",
          fontSize: 16,
          marginRight: "0.3em",
        },
      }),
    [],
  );
