import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { Layout } from "@ContextLogic/lego";
import Illustration, { IllustrationName } from "./Illustration";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { StyleSheet } from "aphrodite";

type Error = "500" | "404" | "403";

const ErrorToIllustrationMap: { readonly [T in Error]: IllustrationName } = {
  "500": "error500",
  "404": "error404",
  "403": "error403",
};

const ErrorToAltTextMap: { readonly [T in Error]: string } = {
  "500": i`Something went wrong`,
  "404": i`Page not found`,
  "403": i`Page access not granted`,
};

type Props = BaseProps & {
  readonly error: Error;
};

const FullPageError: NextPage<Props> = ({ className, style, error }) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      alignItems="center"
      justifyContent="center"
      style={[styles.root, className, style]}
    >
      <Illustration
        style={styles.image}
        name={ErrorToIllustrationMap[error]}
        alt={ErrorToAltTextMap[error]}
      />
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: { height: "100vh", width: "100vw" },
        image: { height: "25%" },
      }),
    [],
  );
};

export default observer(FullPageError);
