/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

const LogoUploadInstructions = () => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.uploadInstructions)}>
      <div className={css(styles.uploadNotes)}>
        <div className={css(styles.uploadNote)}>
          Upload a logo to represent your app.
        </div>
        <div className={css(styles.uploadNote)}>
          The file must be a jpeg or png, and must be smaller than 2MB.
        </div>
      </div>
    </div>
  );
};

export default LogoUploadInstructions;

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
