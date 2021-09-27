/*
 * ClearDeviceHistoryModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/23/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Button } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Type Imports */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type ClearDeviceHistoryModalProps = BaseProps & {
  readonly onDelete: (onComplete: (success: boolean) => unknown) => unknown;
};

type ClearDeviceHistoryModalContentProps = ClearDeviceHistoryModalProps & {
  readonly closeModal: () => unknown;
  readonly setSuccess: (success: boolean | null) => unknown;
};

const ClearDeviceHistoryModalContent: React.FC<ClearDeviceHistoryModalContentProps> = ({
  closeModal,
  setSuccess,
  onDelete,
}: ClearDeviceHistoryModalContentProps) => {
  const styles = useStylesheet();
  const [loading, setLoading] = useState(false);

  const bodyText =
    i`This will clear your devices history and sign you out ` +
    i`from all devices other than your current device.`;

  return (
    <>
      <div className={css(styles.content)}>
        <Illustration
          name="merchantPlusDeleteAllDevices"
          alt={i`confirmation screen`}
        />
        <Markdown className={css(styles.markdown)} text={bodyText} />
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={closeModal}>
          Cancel
        </Button>
        <PrimaryButton
          popoverStyle={css(styles.button)}
          isLoading={loading}
          onClick={() => {
            setLoading(true);
            onDelete((success: boolean | null) => {
              setSuccess(success);
              closeModal();
            });
          }}
        >
          Confirm
        </PrimaryButton>
      </div>
    </>
  );
};

const useStylesheet = () => {
  const { surfaceDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 72px",
        },
        markdown: {
          marginTop: 40,
          maxWidth: 435,
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
          borderTop: `1px solid ${surfaceDark}`,
        },
        button: {
          minWidth: 160,
        },
      }),
    [surfaceDark]
  );
};

export default class ClearDeviceHistoryModal extends Modal {
  props: ClearDeviceHistoryModalProps;
  success: boolean | null = null;

  constructor(props: ClearDeviceHistoryModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Clear devices history`,
    });

    const { dimenStore } = AppStore.instance();
    const targetPercentage = 745 / dimenStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);

    this.props = props;
  }

  close() {
    const { toastStore } = AppStore.instance();
    super.close();
    if (this.success == true) {
      setTimeout(() => {
        toastStore.positive(i`Successfully cleared device history.`);
      }, 300);
    } else if (this.success == false) {
      setTimeout(() => {
        toastStore.negative(i`Something went wrong. Please try again later.`);
      }, 300);
    }
  }

  renderContent() {
    return (
      <ClearDeviceHistoryModalContent
        closeModal={() => this.close()}
        setSuccess={(success: boolean | null) => {
          this.success = success;
        }}
        {...this.props}
      />
    );
  }
}
