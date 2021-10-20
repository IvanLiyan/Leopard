/*
 * CompleteContent.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import _ from "lodash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Info, Markdown } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly onCancel: () => unknown;
  readonly backupCodes: readonly string[];
};

const CompleteContent: React.FC<Props> = (props: Props) => {
  const { onCancel, backupCodes } = props;
  const styles = useStylesheet();

  const statusText = i`Two-factor authentication is **ON.**`;
  const instructionsText = i`**Keep your backup codes somewhere secure**`;
  const popoverText =
    i`You can use these to login when you can't receive your authentication ` +
    i`codes via text. Each code may only be used once. Please keep these ` +
    i`codes safe.`;

  const onDownload = () => {
    const filename = "wish_merchant_backup_codes.txt";

    let body = i`These are your Wish merchant account recovery codes:`;
    body += backupCodes.map((code) => `\n* ${code}\n`).join("");
    body +=
      i`You can use them to login when you can't receive your ` +
      i`authentication codes via text. Each code may only be ` +
      i`used once. Please keep these codes safe.`;

    const hiddenElement = document.createElement("a");
    hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(body)}`;
    hiddenElement.target = "_blank";
    hiddenElement.download = filename;
    hiddenElement.click();
  };

  return (
    <>
      <div className={css(styles.root)}>
        <Illustration
          name="merchantPlus2FAOn"
          alt={i`two-factor authentication on illustration`}
        />
        <Markdown className={css(styles.statusText)} text={statusText} />
        <div className={css(styles.row)}>
          <Markdown text={instructionsText} />
          <Info
            className={css(styles.info)}
            text={popoverText}
            position="top"
          />
        </div>
        <table className={css(styles.table)}>
          <tbody>
            {_.chunk(backupCodes, 3).map((row) => (
              <tr>
                {row.map((code) => (
                  <td className={css(styles.cell)}>{code}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={css(styles.buttonContainer)}>
        <Button className={css(styles.button)} onClick={onCancel}>
          Cancel
        </Button>
        <PrimaryButton
          onClick={() => {
            onDownload();
          }}
          popoverStyle={css(styles.button)}
        >
          Download backup codes
        </PrimaryButton>
      </div>
    </>
  );
};

export default CompleteContent;

const useStylesheet = () => {
  const { surfaceDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: 314,
          padding: "0px 72px",
        },
        statusText: {
          margin: "10px 0px 30px 0px",
        },
        row: {
          display: "flex",
          alignItems: "center",
        },
        info: {
          marginLeft: 8,
        },
        table: {
          marginTop: 5,
        },
        cell: {
          padding: "5px 25px",
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
    [surfaceDark],
  );
};
