import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { Layout } from "@ContextLogic/lego";
import { StyleSheet } from "aphrodite";
import { Card, Heading, Text } from "@ContextLogic/atlas-ui";
import Link from "@core/components/Link";
import { merchFeUrl } from "@core/toolkit/router";
import { zendeskURL } from "@core/toolkit/url";
import { useTheme } from "@core/stores/ThemeStore";
import Illustration from "@core/components/Illustration";
import { ci18n } from "@core/toolkit/i18n";

const TemplateInfoSection: React.FC = () => {
  const styles = useStylesheet();
  const { textDark } = useTheme();

  return (
    <Layout.FlexColumn
      style={{ gap: "24px" }}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Text variant="bodyM" style={{ color: textDark }}>
        Please fill in all required sections and save your document as a CSV
        file.
      </Text>
      <Card
        style={{ padding: "24px", width: "400px", boxSizing: "border-box" }}
        borderRadius="md"
      >
        <Layout.FlexRow justifyContent="space-between">
          <Layout.FlexColumn style={{ gap: "16px" }}>
            <Heading variant="h4">
              {ci18n(
                "Section header, the section contains links to useful documentation",
                "Useful links",
              )}
            </Heading>
            <Link style={styles.link} underline>
              Find category ID
            </Link>
            <Link
              href={merchFeUrl("/product/categories")}
              style={styles.link}
              underline
            >
              Find category attributes and values
            </Link>
            <Link
              href={zendeskURL("1260805100070")}
              style={styles.link}
              underline
            >
              See all other attributes
            </Link>
          </Layout.FlexColumn>
          <Illustration
            name="magnifier"
            alt={ci18n("Image description", "magnifier image")}
          />
        </Layout.FlexRow>
      </Card>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        link: {
          color: textDark,
        },
      }),
    [textDark],
  );
};

export default observer(TemplateInfoSection);
