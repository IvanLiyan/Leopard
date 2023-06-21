import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { Card, Heading, Text } from "@ContextLogic/atlas-ui";
import Link from "@deprecated/components/Link";
import { zendeskURL } from "@core/toolkit/url";
import { useTheme } from "@core/stores/ThemeStore";
import Illustration from "@core/components/Illustration";
import { ci18n } from "@core/toolkit/i18n";
import { createFileAndDownload, getCsvStrFromArray } from "@core/toolkit/file";
import { useQuery } from "@apollo/client";
import {
  GET_TAXONOMY_TREE_CSV_ROWS_QUERY,
  GetTaxonomyTreeCsvRowsResponseType,
} from "@products-csv/queries";
import { yyyymmdd } from "@core/toolkit/datetime";

const TemplateInfoSection: React.FC = () => {
  const styles = useStylesheet();
  const { textDark } = useTheme();

  const { data: taxonomyTreeData } =
    useQuery<GetTaxonomyTreeCsvRowsResponseType>(
      GET_TAXONOMY_TREE_CSV_ROWS_QUERY,
    );

  const taxonomyTreeCsvText = useMemo(() => {
    const taxonomyTreeCsvRows =
      taxonomyTreeData?.taxonomy?.taxonomyTreeCsv ?? [];

    return getCsvStrFromArray(taxonomyTreeCsvRows);
  }, [taxonomyTreeData?.taxonomy?.taxonomyTreeCsv]);

  const downloadCsvTree = () => {
    if (taxonomyTreeCsvText) {
      const dateStr = yyyymmdd(new Date());
      createFileAndDownload({
        filename: `${ci18n(
          "CSV filename for downloading product categories, please do not include any space in translation",
          "categories",
        )}_${dateStr}.csv`,
        content: taxonomyTreeCsvText,
        mimeType: "text/csv",
      });
    }
  };

  return (
    <div className="template-info-root">
      <style jsx>{`
        .template-info-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .template-info-card {
          display: flex;
          justify-content: space-between;
        }
        .template-info-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
      <Text variant="bodyM" sx={{ color: textDark }}>
        Please fill in all required sections and save your document as a CSV
        file.
      </Text>
      <Card
        sx={{ padding: "24px", width: "400px", boxSizing: "border-box" }}
        borderRadius="md"
      >
        <div className="template-info-card">
          <div className="template-info-content">
            <Heading variant="h4">
              {ci18n(
                "Section header, the section contains links to useful documentation",
                "Useful links",
              )}
            </Heading>
            <Link
              style={styles.link}
              onClick={() => {
                downloadCsvTree();
              }}
              data-cy="link-category-tree-csv"
              underline
            >
              Find category ID
            </Link>
            <Link
              href={"/products/categories"}
              style={styles.link}
              data-cy="link-categories-page"
              underline
              openInNewTab
            >
              Find category attributes and values
            </Link>
            <Link
              href={zendeskURL("1260805100070")}
              style={styles.link}
              data-cy="link-attributes-faq"
              openInNewTab
              underline
            >
              See all other attributes
            </Link>
          </div>

          <Illustration
            name="magnifier"
            alt={ci18n("Image description", "magnifier image")}
          />
        </div>
      </Card>
    </div>
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
