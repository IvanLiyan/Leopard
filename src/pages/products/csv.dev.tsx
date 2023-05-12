import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { NextPage } from "next";
import PageRoot from "@core/components/PageRoot";
import { useTheme } from "@core/stores/ThemeStore";
import { Alert, AlertTitle } from "@ContextLogic/atlas-ui";
import ProductsCsvSteps from "@products-csv/components/ProductsCsvSteps";
import Link from "@core/components/Link";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";

const ProductsCsvPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(true);

  return (
    <PageRoot>
      <PageHeader title={i`Add/edit products with CSV`} relaxed />
      <PageGuide style={styles.content} relaxed hideFooter>
        {isAlertOpen && (
          <Alert
            severity="success"
            onClose={() => {
              setIsAlertOpen(false);
            }}
            style={{ marginBottom: "40px" }}
          >
            <AlertTitle>Introducing the new product add/edit flow</AlertTitle>
            We have retired our old bulk add/edit CSV templates. Create
            templates using our new flow to avoid uploading errors.{" "}
            <Link style={styles.link} underline>
              Learn more
            </Link>
          </Alert>
        )}
        <ProductsCsvSteps />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        link: {
          color: textWhite,
        },
        content: {
          paddingTop: 40,
        },
      }),
    [textWhite],
  );
};

export default observer(ProductsCsvPage);
