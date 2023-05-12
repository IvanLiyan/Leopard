import React, { useState } from "react";
import { observer } from "mobx-react";
import RadioButtonCard from "./RadioButtonCard";
import { Layout } from "@ContextLogic/lego";
import { IS_LARGE_SCREEN, IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { Button } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";
import { DownloadTemplateType } from "@products-csv/toolkit";

const DownloadTemplateSection: React.FC = () => {
  const [downloadType, setDownloadType] = useState<DownloadTemplateType>();
  const { textWhite } = useTheme();

  return (
    <Layout.FlexColumn
      style={{ gap: 24 }}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <div className="update-buttons-container">
        <RadioButtonCard
          checked={downloadType === "ADD"}
          text={ci18n("Bulk csv add/edit action type", "Add new products")}
          onCheck={() => {
            if (downloadType !== "ADD") {
              setDownloadType("ADD");
            }
          }}
        />
        <RadioButtonCard
          checked={downloadType === "EDIT"}
          text={ci18n(
            "Bulk csv add/edit action type",
            "Edit existing products",
          )}
          onCheck={() => {
            if (downloadType !== "EDIT") {
              setDownloadType("EDIT");
            }
          }}
        />
        <style jsx>{`
          @media ${IS_LARGE_SCREEN} {
            .update-buttons-container {
              display: flex;
              flex-direction: row;
              gap: 24px;
            }
          }

          @media ${IS_SMALL_SCREEN} {
            .update-buttons-container {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
          }
        `}</style>
      </div>
      {downloadType === "ADD" && (
        <Button
          primary
          startIcon={<Icon name="uploadCloud" color={textWhite} />}
        >
          {ci18n(
            "Button text, download bulk add/edit product csv template",
            "Download template",
          )}
        </Button>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(DownloadTemplateSection);
