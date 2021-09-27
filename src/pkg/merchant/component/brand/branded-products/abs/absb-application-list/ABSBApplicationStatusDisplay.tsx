import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { redX, greenCheckmark, error } from "@assets/icons";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBApplicationStatus } from "@toolkit/brand/branded-products/abs";

type ABSBApplicationStatusProps = BaseProps & {
  readonly status: ABSBApplicationStatus;
};

const statusText = {
  PENDING: i`Pending review`,
  APPROVED: i`Approved`,
  REJECTED: i`Rejected`,
  EXPIRED: i`Expired`,
};

const statusIcon = {
  APPROVED: greenCheckmark,
  REJECTED: redX,
  EXPIRED: error,
};

export const getAppStatusDisplayText = (status: ABSBApplicationStatus) => {
  return statusText[status].toLowerCase();
};

const ABSBApplicationStatusDisplay = ({
  status,
  style,
}: ABSBApplicationStatusProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.statusContainer, style)}>
      {status === "PENDING" ? (
        <i>{statusText[status]}</i>
      ) : (
        <>
          <img src={statusIcon[status]} className={css(styles.statusIcon)} />
          <div>{statusText[status]}</div>
        </>
      )}
    </div>
  );
};

export default observer(ABSBApplicationStatusDisplay);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        statusContainer: {
          display: "flex",
        },
        statusIcon: {
          width: "16px",
          display: "inline-block",
          marginRight: 5,
        },
      }),
    []
  );
};
