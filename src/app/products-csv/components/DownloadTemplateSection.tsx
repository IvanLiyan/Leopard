import React, { useState } from "react";
import { observer } from "mobx-react";
import RadioCard from "@core/components/RadioCard";
import { Layout } from "@ContextLogic/lego";
import { IS_LARGE_SCREEN, IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { Button, Text } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";
import { DownloadTemplateType, UpdateActionType } from "@products-csv/toolkit";
import EditTemplateSelect from "./EditTemplateSelect";

const DownloadTemplateSection: React.FC = () => {
  const [updateActionType, setUpdateActionType] = useState<UpdateActionType>();
  const [templateType, setTemplateType] = useState<DownloadTemplateType>();
  const { textWhite, primary, textDark } = useTheme();

  return (
    <Layout.FlexColumn
      style={{ gap: 24 }}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <div className="update-buttons-container">
        <RadioCard
          checked={updateActionType === "ADD"}
          text={ci18n("Bulk csv add/edit action type", "Add new products")}
          onChange={() => {
            if (updateActionType !== "ADD") {
              setUpdateActionType("ADD");
              setTemplateType("ADD_PRODUCT");
            }
          }}
          sx={{ width: "400px" }}
        />
        <RadioCard
          checked={updateActionType === "EDIT"}
          text={ci18n(
            "Bulk csv add/edit action type",
            "Edit existing products",
          )}
          onChange={() => {
            if (updateActionType !== "EDIT") {
              setUpdateActionType("EDIT");
              setTemplateType("EDIT_PRICE_INVENTORY");
            }
          }}
          sx={{ width: "400px" }}
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
      {updateActionType === "EDIT" && (
        <>
          <EditTemplateSelect
            selectedType={
              templateType === "ADD_PRODUCT" ? undefined : templateType
            }
            onSelect={setTemplateType}
          />
          <Layout.FlexColumn style={{ gap: 8 }}>
            <Layout.FlexRow style={{ gap: 16 }}>
              <Button
                primary
                startIcon={<Icon name="download" color={textWhite} />}
              >
                {ci18n(
                  "Button text, download bulk add/edit product csv template with product catalog data",
                  "Download catalog",
                )}
              </Button>
              <Button
                secondary
                startIcon={<Icon name="download" color={primary} />}
              >
                {ci18n(
                  "Button text, download bulk add/edit product csv template",
                  "Download template",
                )}
              </Button>
            </Layout.FlexRow>
            <Text variant="bodyM" style={{ color: textDark }}>
              If your catalog exceeds 150 products, you may receive it via
              email.
            </Text>
          </Layout.FlexColumn>
        </>
      )}
      {updateActionType === "ADD" && (
        <Button primary startIcon={<Icon name="download" color={textWhite} />}>
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
