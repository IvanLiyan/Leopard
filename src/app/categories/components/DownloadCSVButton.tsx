import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTreeVersion } from "@core/taxonomy/constants";
import {
  CategoryId,
  CategoryAttributesCsvResponseType,
  CategoryAttributesCsvRequestType,
  CATEGORY_ATTRIBUTES_CSV_QUERY,
} from "@core/taxonomy/toolkit";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ci18n } from "@core/toolkit/i18n";
import { createFileAndDownload, getCsvStrFromArray } from "@core/toolkit/file";
import { yyyymmdd } from "@core/toolkit/datetime";
import { Button, Tooltip } from "@ContextLogic/atlas-ui";

type Props = BaseProps & {
  readonly categoryId?: CategoryId | null;
  readonly disabled?: boolean | null;
};

const DownloadCSVButton: React.FC<Props> = ({ categoryId, disabled }) => {
  const { version: treeVersion, loading: treeVersionLoading } =
    useTreeVersion();

  const { data, loading } = useQuery<
    CategoryAttributesCsvResponseType,
    CategoryAttributesCsvRequestType
  >(CATEGORY_ATTRIBUTES_CSV_QUERY, {
    variables: {
      categoryId: categoryId ?? 0, // categoryId will not be null, fallback added to bypass type error
    },
    skip:
      categoryId == null ||
      !!disabled ||
      treeVersion == null ||
      treeVersionLoading,
  });

  const attributesCsvText = useMemo(() => {
    const attributesCsvRows = data?.taxonomy?.categoryAttributesCsv ?? [];

    return getCsvStrFromArray(attributesCsvRows);
  }, [data?.taxonomy?.categoryAttributesCsv]);

  const downloadAttributesCsv = () => {
    if (attributesCsvText) {
      const dateStr = yyyymmdd(new Date());
      createFileAndDownload({
        filename: `${categoryId}_attributes_${dateStr}.csv`,
        content: attributesCsvText,
        mimeType: "text/csv",
      });
    }
  };

  const buttonDisabled = !attributesCsvText || !!disabled || loading;

  return (
    <Tooltip
      title={
        buttonDisabled
          ? i`Attributes are unavailable for this category level. ` +
            i`Please select a different category path to download.`
          : undefined
      }
    >
      {/* excess div required since Mui disables tooltips wrapping disabled buttons */}
      <div>
        <Button
          sx={{ padding: "10px 16px", height: 40 }}
          disabled={buttonDisabled}
          onClick={() => {
            downloadAttributesCsv();
          }}
          secondary
        >
          {ci18n(
            "Button text, download product attributes",
            "Download Attributes",
          )}
        </Button>
      </div>
    </Tooltip>
  );
};

export default observer(DownloadCSVButton);
