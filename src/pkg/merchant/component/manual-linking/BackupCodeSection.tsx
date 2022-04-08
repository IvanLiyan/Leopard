import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { Layout, Markdown, Ul, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type InitialProps = BaseProps & {
  readonly supportVerificationCode: string;
};

/**
 * Manual linking - 2FA backup code flow instructions
 */
const BackupCodeSection: React.FC<InitialProps> = ({
  style,
  className,
  supportVerificationCode,
}) => {
  const styles = useStylesheet();
  const merchantBdEmail = "merchant_support@wish.com";

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Markdown
        text={
          i`**Use Backup Codes**` +
          `\n\n` +
          i`Please use one of your Backup Codes to login if you are still ` +
          i`unable to receive the code.`
        }
      />
      <Markdown
        style={styles.backupCodesParagraph}
        text={
          i`**Don't have access to your Backup Codes?**` +
          `\n\n` +
          i`If you do not have access to your Backup Codes, you can receive ` +
          i`a one-time login code from your Account Manager.`
        }
      />
      <Markdown
        style={styles.backupCodesParagraph}
        text={
          i`Contact your Account Manager at ` +
          i`[${merchantBdEmail}](${`mailto:${merchantBdEmail}`}) with your account ` +
          i`email to verify your identity and receive your code.`
        }
      />
      <Text style={styles.backupCodesParagraph}>
        Please provide the following information:
      </Text>
      <Ul>
        <Ul.Li>Verification Code: {supportVerificationCode}</Ul.Li>
        <Ul.Li>Photo ID</Ul.Li>
        <Ul.Li>Business address</Ul.Li>
        <Ul.Li>
          External store URL (e.g. AliExpress store URL, Amazon store URL)
        </Ul.Li>
      </Ul>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontSize: 16,
          color: textDark,
        },
        backupCodesParagraph: {
          marginTop: 16,
        },
      }),
    [textDark]
  );
};

export default BackupCodeSection;
