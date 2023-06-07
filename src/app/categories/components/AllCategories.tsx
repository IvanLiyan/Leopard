import { Card } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import { getL1Node, useCategoryTreeMap } from "@core/taxonomy/toolkit";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import AttributesTable from "./AttributesTable";
import DownloadCSVButton from "./DownloadCSVButton";
import TaxonomyCategorySelectSection from "@core/taxonomy/v2/TaxonomyCategorySelectSection";
import Skeleton from "@core/components/Skeleton";
import { SelfClassifyAllowedL1 } from "@core/taxonomy/constants";
import { Button, Tooltip, Alert, Stack } from "@ContextLogic/atlas-ui";

const AllCategories: React.FC = () => {
  const styles = useStylesheet();

  const { categoryMap, loading: isLoadingCategoryTree } = useCategoryTreeMap();
  const [selectedLeafCategoryId, setSelectedLeafCategoryId] =
    useState<number>();
  const [showAttributes, setShowAttributes] = useState(false);

  const attributesButtonDisabled = useMemo<boolean>(() => {
    if (selectedLeafCategoryId == null) {
      return true;
    }

    const currentNode = categoryMap.get(selectedLeafCategoryId);
    const l1Node = currentNode && getL1Node(currentNode, categoryMap);
    if (!SelfClassifyAllowedL1.some((id) => id === l1Node?.id)) {
      return true;
    }

    return false;
  }, [categoryMap, selectedLeafCategoryId]);

  const csvButtonDisabled = useMemo<boolean>(() => {
    if (attributesButtonDisabled) {
      return true;
    }
    return false;
  }, [attributesButtonDisabled]);

  const renderSelectSection = () => {
    if (isLoadingCategoryTree) {
      return <Skeleton height={300} sx={{ marginTop: "16px" }} />;
    }

    if (categoryMap.size === 0) {
      return null;
    }

    return (
      <TaxonomyCategorySelectSection
        style={{ marginTop: "16px" }}
        initialCategoryTreeMap={categoryMap}
        onSelectionsChange={(categories) =>
          categories.length > 0
            ? setSelectedLeafCategoryId(categories[0])
            : setSelectedLeafCategoryId(undefined)
        }
        maxSelection={1}
        hideToken
        selectLeafOnly
      />
    );
  };

  const stepOne = (
    <Card
      title={i`Step 1: Search Category`}
      contentContainerStyle={{ padding: 16 }}
    >
      <Alert severity="info">
        Note: Only these 1st level categories have attributes: Apparel
        Accessories, Cellphones & Telecommunications, Computer & Office,
        Consumer Electronics, Entertainment, Home & Garden, Home Improvement,
        Jewelry & Accessories, Luggage & Bags, Men&apos;s Clothing, Shoes,
        Sports, and Toys & Hobbies
      </Alert>
      {renderSelectSection()}
      <Stack
        sx={{ marginTop: "26px" }}
        justifyContent="flex-end"
        direction="row"
        spacing={2}
      >
        <DownloadCSVButton
          disabled={csvButtonDisabled}
          categoryId={selectedLeafCategoryId}
        />
        <Tooltip
          title={
            attributesButtonDisabled
              ? i`Attributes are unavailable for this category level. ` +
                i`Please select a different category path to view attributes.`
              : undefined
          }
        >
          {/* excess div required since Mui disables tooltips wrapping disabled buttons */}
          <div>
            <Button
              sx={{ height: 40 }}
              disabled={attributesButtonDisabled}
              onClick={() => {
                setShowAttributes(true);
              }}
              primary
            >
              {ci18n("CTA text", "View Attributes")}
            </Button>
          </div>
        </Tooltip>
      </Stack>
    </Card>
  );

  const stepTwo = showAttributes && selectedLeafCategoryId != null && (
    <Card
      title={i`Step 2: View Attributes`}
      contentContainerStyle={{ padding: 16 }}
    >
      <AttributesTable
        style={styles.step}
        categoryId={selectedLeafCategoryId}
      />
    </Card>
  );

  return (
    <Stack direction="column" sx={{ paddingTop: "16px" }} spacing={4}>
      {stepOne}
      {stepTwo}
    </Stack>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        step: {
          marginTop: 16,
        },
      }),
    [],
  );

export default observer(AllCategories);
