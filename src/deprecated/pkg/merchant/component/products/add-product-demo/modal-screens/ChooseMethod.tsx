import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import MethodButton from "./MethodButton";

type Props = BaseProps & {
  readonly onClickUploadVideo: () => unknown;
};

const ChooseMethod: React.FC<Props> = (props: Props) => {
  const { className, style, onClickUploadVideo } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <MethodButton
        className={css(styles.button)}
        onClick={onClickUploadVideo}
        illustration="cloudUpload"
        title={i`Upload your video`}
      >
        Use this tool to add your high quality product video.
      </MethodButton>
    </div>
  );
};

export default ChooseMethod;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 456,
        },
        button: {
          maxWidth: 240,
          height: 240,
          boxSizing: "border-box",
        },
      }),
    []
  );
};
