import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import RadioCard from "@core/components/RadioCard";
import { IS_LARGE_SCREEN, IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { Button, Text } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";
import { DownloadTemplateType, UpdateActionType } from "@products-csv/toolkit";
import EditTemplateSelect from "./EditTemplateSelect";
import {
  CategoryTreeNode,
  parseJsonTree,
  buildMapFromTree,
  CategoryId,
} from "@core/taxonomy/toolkit";
import TaxonomyCategorySelectSection from "@core/taxonomy/v2/TaxonomyCategorySelectSection";
import { jsonTree } from "../mock-tree-json"; // csv TODO: remove mock
import { LoadingIndicator } from "@ContextLogic/lego";

const DownloadTemplateSection: React.FC = () => {
  const [updateActionType, setUpdateActionType] = useState<UpdateActionType>();
  const [templateType, setTemplateType] = useState<DownloadTemplateType>();
  // csv TODO use selectedCategories in download api
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategories, setSelectedCategories] = useState<
    ReadonlyArray<CategoryId>
  >([]);
  const { textWhite, primary, textDark } = useTheme();
  const [categoryMap, setCategoryMap] = useState<
    Map<CategoryId, CategoryTreeNode>
  >(new Map());
  const [isLoadingTree, setIsLoadingTree] = useState<boolean>(false);
  const maxCategory = 5;

  useEffect(() => {
    setIsLoadingTree(true);
    const tree = parseJsonTree(jsonTree);
    const treeMap = buildMapFromTree({
      parentId: undefined,
      currentNode: tree,
      currentPath: "",
      currentMap: categoryMap,
    });
    setIsLoadingTree(false);
    setCategoryMap(treeMap);
    // csv TODO: update mock
    // map only depends on tree data, categoryMap is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonTree]);

  const renderCategorySelectSection = () => {
    if (isLoadingTree) {
      return <LoadingIndicator />;
    }

    return (
      <TaxonomyCategorySelectSection
        initialCategoryTreeMap={categoryMap}
        onSelectionsChange={setSelectedCategories}
        maxSelection={maxCategory}
        showHeader
      />
    );
  };

  return (
    <div className="download-template-root">
      <style jsx>{`
        .download-template-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: flex-start;
          justify-content: flex-start;
        }

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

        .download-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .download-buttons {
          display: flex;
          gap: 16px;
        }
      `}</style>
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
      </div>
      {updateActionType === "EDIT" && (
        <>
          <EditTemplateSelect
            selectedType={
              templateType === "ADD_PRODUCT" ? undefined : templateType
            }
            onSelect={setTemplateType}
          />
          {(templateType === "EDIT_ALL" ||
            templateType === "EDIT_BY_CATEGORY") &&
            renderCategorySelectSection()}
          <div className="download-buttons-container">
            <div className="download-buttons">
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
            </div>
            <Text variant="bodyM" sx={{ color: textDark }}>
              If your catalog exceeds 150 products, you may receive it via
              email.
            </Text>
          </div>
        </>
      )}
      {updateActionType === "ADD" && (
        <>
          {renderCategorySelectSection()}
          <Button
            primary
            startIcon={<Icon name="download" color={textWhite} />}
          >
            {ci18n(
              "Button text, download bulk add/edit product csv template",
              "Download template",
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default observer(DownloadTemplateSection);
