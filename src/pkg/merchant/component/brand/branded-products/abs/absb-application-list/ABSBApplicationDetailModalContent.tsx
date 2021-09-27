import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import ABSBApplicationDetailTip from "./ABSBApplicationDetailTip";
import ABSBApplicationDetailCard from "./ABSBApplicationDetailCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBBrandApplication } from "@toolkit/brand/branded-products/abs";

export type ABSBApplicationDetailModalProps = BaseProps & {
  readonly brandApp: ABSBBrandApplication;
  readonly appIndex?: number;
};

export type ABSBApplicationDetailModalContentProps = ABSBApplicationDetailModalProps & {
  readonly closeModal: () => void;
  readonly renderModal: (
    brandApp: ABSBBrandApplication,
    appIndex?: number
  ) => void;
};

const ABSBApplicationDetailModalContent = ({
  brandApp,
  appIndex = 0,
  closeModal,
  renderModal,
}: ABSBApplicationDetailModalContentProps) => {
  const styles = useStylesheet();
  const application = brandApp.applications[appIndex];

  const leftNav = appIndex > 0;
  const rightNav = appIndex + 1 < brandApp.applications.length;

  const prev = () => {
    closeModal();
    if (leftNav) {
      renderModal(brandApp, appIndex - 1);
    }
  };
  const next = () => {
    closeModal();
    if (rightNav) {
      renderModal(brandApp, appIndex + 1);
    }
  };

  return (
    <div className={css(styles.container)}>
      {leftNav && (
        <Button hideBorder onClick={prev} style={styles.navBtn}>
          <Icon name="chevronLeft" />
        </Button>
      )}
      <div
        className={css(
          styles.contentContainer,
          leftNav ? styles.withLeftNav : null,
          rightNav ? styles.withRightNav : null
        )}
      >
        <ABSBApplicationDetailTip
          brandId={brandApp.brand_id}
          status={application.status}
          style={css(styles.tip)}
        />
        <ABSBApplicationDetailCard
          brandName={brandApp.brand_name}
          application={application}
        />
      </div>
      {rightNav && (
        <Button hideBorder onClick={next} style={styles.navBtn}>
          <Icon name="chevronRight" />
        </Button>
      )}
    </div>
  );
};

export default observer(ABSBApplicationDetailModalContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        contentContainer: {
          padding: "24px 56px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        withLeftNav: {
          paddingLeft: 0,
        },
        withRightNav: {
          paddingRight: 0,
        },
        navBtn: {
          width: 15,
          margin: 20,
          padding: "0",
        },
        tip: {
          marginBottom: 24,
        },
      }),
    []
  );
