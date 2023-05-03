import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { NextPage } from "next";
import PageRoot from "@core/components/PageRoot";
import { useTheme } from "@core/stores/ThemeStore";
import { Heading } from "@ContextLogic/atlas-ui";
import ProductsCsvSteps from "@products-csv/components/ProductsCsvSteps";
import Alert, { AlertProps } from "@mui/material/Alert";
import Link from "@core/components/Link";
import AlertTitle from "@mui/material/AlertTitle";
import Icon from "@core/components/Icon";
import { styled } from "@mui/material/styles";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";

type IntroAlertProps = AlertProps & {
  readonly backgroundColor: string;
  readonly messageColor: string;
};

const IntroAlert = styled(Alert)<IntroAlertProps>(
  ({ backgroundColor, messageColor }) => ({
    ["&.MuiAlert-root"]: {
      backgroundColor: backgroundColor,
      marginBottom: "40px",
      [".MuiAlert-message"]: {
        color: messageColor,
        fontSize: "14px",
      },
      [".MuiAlert-action"]: {
        color: messageColor,
      },
    },
  }),
);

const ProductsCsvPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(true);
  const { textWhite, textBlack } = useTheme();

  return (
    <PageRoot>
      <PageHeader title={i`Add/edit products with CSV`} relaxed />
      <PageGuide style={styles.content} relaxed hideFooter>
        {isAlertOpen && (
          <IntroAlert
            onClose={() => {
              setIsAlertOpen(false);
            }}
            icon={<Icon name="checkCircle" color={textWhite} />}
            backgroundColor={textBlack}
            messageColor={textWhite}
          >
            <AlertTitle>
              <Heading variant="h5" sx={{ color: textWhite }}>
                Introducing new product add/edit flow
              </Heading>
            </AlertTitle>
            We have retired our old bulk add/edit CSV templates. Create
            templates using our new flow to avoid uploading errors.{" "}
            <Link style={styles.link}>Learn more</Link>
          </IntroAlert>
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
          textDecoration: "underline",
        },
        content: {
          paddingTop: 40,
        },
      }),
    [textWhite],
  );
};

export default observer(ProductsCsvPage);
