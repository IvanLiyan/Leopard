/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

const RedirectUriInstructions = () => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.uploadInstructions)}>
      <div className={css(styles.uploadNotes)}>
        <div className={css(styles.uploadNote)}>
          The URI to which we send the authorization code when a user authorizes
          your app.
        </div>
        <div className={css(styles.uploadNote)}>This URI must use HTTPS.</div>
      </div>
    </div>
  );
};

export default RedirectUriInstructions;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        uploadInstructions: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 300,
          padding: "7px 0px 7px 0px",
        },
        uploadNotes: {
          marginBottom: 0,
          display: "flex",
          flexDirection: "column",
          padding: "8px 12px 3px 12px",
        },
        uploadNote: {
          lineHeight: 1.33,
          fontSize: 12,
          marginBottom: 5,
          alignSelf: "flex-start",
          display: "flex",
          flexDirection: "column",
        },
      }),
    []
  );
