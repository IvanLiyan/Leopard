import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import RadioCard from "@core/components/RadioCard";
import { IS_LARGE_SCREEN, IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { Button, Text } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";
import {
  DOWNLOAD_CATALOG_TEMPLATE_INPUT_TYPES,
  DOWNLOAD_TEMPLATE_FILENAME,
  DownloadTemplateType,
  UpdateActionType,
  useDownloadTemplateQuery,
} from "@products-csv/toolkit";
import EditTemplateSelect from "./EditTemplateSelect";
import {
  CategoryId,
  getLeafChildren,
  useCategoryTreeMap,
} from "@core/taxonomy/toolkit";
import TaxonomyCategorySelectSection from "@core/taxonomy/v2/TaxonomyCategorySelectSection";
import Skeleton from "@core/components/Skeleton";
import {
  DOWNLOAD_PRODUCT_CATALOG_MUTATION,
  DownloadProductCatalogRequestType,
  DownloadProductCatalogResponseType,
} from "@products-csv/queries";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import { createFileAndDownload, getCsvStrFromArray } from "@core/toolkit/file";
import { yyyymmdd } from "@core/toolkit/datetime";
import { Constants } from "@core/taxonomy/constants";

const DownloadTemplateSection: React.FC = () => {
  const toastStore = useToastStore();
  const [updateActionType, setUpdateActionType] = useState<UpdateActionType>();
  const [templateType, setTemplateType] = useState<DownloadTemplateType>();
  // csv TODO use selectedCategories in download api
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategories, setSelectedCategories] = useState<
    ReadonlyArray<CategoryId>
  >([]);
  const { textWhite, primary, textDark } = useTheme();
  const { categoryMap, loading: isLoadingCategoryMap } = useCategoryTreeMap();
  const [isLoadingSubcategories, setIsLoadingSubcategories] =
    useState<boolean>(false);
  const [isDownloadingCatalog, setIsDownloadingCatalog] =
    useState<boolean>(false);

  const subcategories = useMemo(() => {
    setIsLoadingSubcategories(true);
    let allLeaves: ReadonlyArray<CategoryId> = [];
    selectedCategories.forEach((categoryId) => {
      const curNode = categoryMap.get(categoryId);
      const curLeaves = curNode
        ? getLeafChildren({
            node: curNode,
            map: categoryMap,
            curLeaves: [],
          })
        : [];

      allLeaves = [...allLeaves, ...curLeaves];
    });

    setIsLoadingSubcategories(false);
    return allLeaves;
  }, [categoryMap, selectedCategories]);

  const renderCategorySelectSection = () => {
    if (isLoadingCategoryMap) {
      return <Skeleton width="100%" height={100} />;
    }

    return (
      <TaxonomyCategorySelectSection
        initialCategoryTreeMap={categoryMap}
        onSelectionsChange={setSelectedCategories}
        maxSelection={Constants.TAXONOMY.maxMultiselectCategory}
      />
    );
  };

  const showCategorySelection =
    templateType === "ADD_PRODUCT" ||
    templateType === "ADD_VARIATIONS" ||
    templateType === "EDIT_BY_CATEGORY";

  const showDownloadCatalogButton =
    templateType != null &&
    templateType !== "ADD_PRODUCT" &&
    templateType !== "ADD_VARIATIONS" &&
    templateType !== "EDIT_BY_CATEGORY";

  // download catalog
  const [downloadCatalog] = useMutation<
    DownloadProductCatalogResponseType,
    DownloadProductCatalogRequestType
  >(DOWNLOAD_PRODUCT_CATALOG_MUTATION);

  const onDownloadCatalog = async () => {
    try {
      setIsDownloadingCatalog(true);
      if (!showDownloadCatalogButton || templateType == null) {
        return;
      }

      if (showCategorySelection && selectedCategories.length === 0) {
        toastStore.negative(i`Please select at least one category`);
        return;
      }

      const categoryIds = showCategorySelection ? subcategories : undefined;
      const templateTypeInput =
        DOWNLOAD_CATALOG_TEMPLATE_INPUT_TYPES[templateType];
      const resp = await downloadCatalog({
        variables: {
          input: {
            categoryIds,
            templateType: templateTypeInput,
          },
        },
      });

      const ok = resp.data?.productCatalog.downloadAllProducts?.ok;
      const errorMessage =
        resp.data?.productCatalog.downloadAllProducts?.errorMessage;
      if (!ok) {
        toastStore.negative(errorMessage ?? i`Something went wrong`);
        return;
      }

      toastStore.positive(
        i`Your products are being processed into a CSV file. You will ` +
          i`receive an email with a link to download the file in ${24} hours.`,
      );
    } catch {
      toastStore.negative(`Something went wrong`);
    } finally {
      setIsDownloadingCatalog(false);
    }
  };

  // download empty template
  const { templateHeaders, loading: isLoadingTemplate } =
    useDownloadTemplateQuery({
      templateType,
      subcategories,
    });

  const onDownloadTemplate = () => {
    if (showCategorySelection && selectedCategories.length === 0) {
      toastStore.negative(i`Please select at least one category`);
      return;
    }

    if (
      templateType == null ||
      templateHeaders == null ||
      templateHeaders.length === 0
    ) {
      return;
    }

    const csvStr = getCsvStrFromArray([templateHeaders]);
    if (csvStr != null) {
      const dateStr = yyyymmdd(new Date());
      createFileAndDownload({
        filename: `${DOWNLOAD_TEMPLATE_FILENAME[templateType]}_${dateStr}.csv`,
        content: csvStr,
        mimeType: "text/csv",
      });
    }
  };

  return (
    <div className="download-template-root">
      <style jsx>{`
        .download-template-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
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
        <EditTemplateSelect
          selectedType={
            templateType === "ADD_PRODUCT" ? undefined : templateType
          }
          onSelect={setTemplateType}
        />
      )}
      {showCategorySelection && renderCategorySelectSection()}
      {templateType != null && (
        <div className="download-buttons-container">
          <div className="download-buttons">
            {showDownloadCatalogButton && (
              <Button
                primary
                startIcon={<Icon name="download" color={textWhite} />}
                disabled={isDownloadingCatalog || isLoadingSubcategories}
                onClick={() => void onDownloadCatalog()}
              >
                {ci18n(
                  "Button text, download bulk add/edit product csv template with product catalog data",
                  "Download catalog",
                )}
              </Button>
            )}

            <Button
              secondary
              startIcon={<Icon name="download" color={primary} />}
              disabled={isLoadingTemplate || isLoadingSubcategories}
              onClick={onDownloadTemplate}
            >
              {ci18n(
                "Button text, download bulk add/edit product csv template",
                "Download template",
              )}
            </Button>
          </div>
          {showDownloadCatalogButton && (
            <Text variant="bodyM" sx={{ color: textDark }}>
              You will receive your catalog via email.
            </Text>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(DownloadTemplateSection);
